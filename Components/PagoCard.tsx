// PagoCard.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart, PaymentMethod } from "./CartContext";
import uuid from "react-native-uuid";
import { Picker } from "@react-native-picker/picker";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-12

const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const maskCard = (num: string) => {
  if (!num) return "";
  const cleaned = num.replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  return "**** **** **** " + cleaned.slice(-4);
};

const PagoCard = () => {
  const { pagos, addPago, selectedPaymentId, setSelectedPayment } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [showNewForm, setShowNewForm] = useState(pagos.length === 0); // si no hay pagos, mostramos form
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [selMonth, setSelMonth] = useState<number>(currentMonth);
  const [selYear, setSelYear] = useState<number>(currentYear);

  const metodoActual = useMemo(
    () => pagos.find((p) => p.id === selectedPaymentId) ?? (pagos.length > 0 ? pagos[pagos.length - 1] : null),
    [pagos, selectedPaymentId]
  );

  // validaciones
  const onlyDigits = (s: string) => s.replace(/\D/g, "");
  const handleCardNumber = (text: string) => {
    const digits = onlyDigits(text).slice(0, 16);
    // formateo con espacios opcional: XXXX XXXX XXXX XXXX
    const parts = digits.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(" ") : digits);
  };
  const handleCvv = (text: string) => {
    const digits = onlyDigits(text).slice(0, 3);
    setCvv(digits);
  };

  const expiryIsValid = () => {
    const month = selMonth;
    const year = selYear;
    if (!month || !year) return false;
    if (year > currentYear) return true;
    if (year === currentYear && month >= currentMonth) return true;
    return false;
  };

  const cardNumberDigits = onlyDigits(cardNumber);
  const isCardNumberValid = cardNumberDigits.length === 16;
  const isCvvValid = cvv.length === 3;
  const isHolderValid = cardHolder.trim().length > 2;
  const canAdd = isCardNumberValid && isCvvValid && expiryIsValid() && isHolderValid;

  const handleAdd = async () => {
    if (!canAdd) {
      Alert.alert("Error", "Revisa los campos: número, CVV, fecha y nombre.");
      return;
    }

    const newPago: PaymentMethod = {
      id: uuid.v4().toString(),
      cardNumber: cardNumberDigits,
      cardHolder: cardHolder.trim(),
      expiry: `${selMonth.toString().padStart(2, "0")}/${selYear.toString().slice(-2)}`, // MM/YY
      cvv,
    };

    await addPago(newPago);
    // seleccionarlo
    await setSelectedPayment(newPago.id);
    // reset form
    setCardNumber("");
    setCardHolder("");
    setCvv("");
    setSelMonth(currentMonth);
    setSelYear(currentYear);
    setShowNewForm(false);
    setModalVisible(false);
  };

  const handleSelect = async (id: string) => {
    await setSelectedPayment(id);
    setModalVisible(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Método de pago</Text>
      <View style={styles.cardContent}>
        <Ionicons name="card-outline" size={28} color="#000" style={styles.icon} />
        <Text style={styles.infoText}>
          {metodoActual ? `**** **** **** ${metodoActual.cardNumber.slice(-4)} • ${metodoActual.cardHolder}` : "No hay método de pago"}
        </Text>
        <TouchableOpacity onPress={() => { setModalVisible(true); setShowNewForm(pagos.length === 0); }} style={styles.buttonRight}>
          <Text style={styles.changeBtn}>{metodoActual ? "Cambiar" : "Agregar"}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Métodos de pago</Text>

            {pagos.length > 0 && !showNewForm ? (
              <>
                <FlatList
                  data={pagos}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.paymentRow}>
                      <View>
                        <Text style={{ fontWeight: "700" }}>{maskCard(item.cardNumber)}</Text>
                        <Text style={{ color: "#666" }}>{item.cardHolder} • {item.expiry}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity onPress={() => handleSelect(item.id)} style={styles.selectBtn}>
                          <Text style={{ color: "#fff" }}>Seleccionar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                <TouchableOpacity onPress={() => setShowNewForm(true)} style={styles.addNewBtn}>
                  <Text style={{ color: "#ff6b00", fontWeight: "700", textAlign: "center" }}>Agregar nuevo método</Text>
                </TouchableOpacity>
              </>
            ) : (
              // formulario para nuevo método
              <ScrollView>
                <Text style={styles.modalSubtitle}>Agregar tarjeta</Text>

                <TextInput
                  placeholder="Número de tarjeta"
                  value={cardNumber}
                  onChangeText={handleCardNumber}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={19} // 16 digits + 3 spaces
                />
                <Text style={styles.hint}>{isCardNumberValid ? "" : "El número debe ser de 16 dígitos"}</Text>

                <TextInput
                  placeholder="Nombre en la tarjeta"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  style={styles.input}
                />
                <Text style={styles.hint}>{isHolderValid ? "" : "Ingresa el nombre tal como aparece en la tarjeta"}</Text>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickerLabel}>Mes</Text>
                    <View style={styles.pickerWrap}>
                      <Picker selectedValue={selMonth} onValueChange={(v) => setSelMonth(Number(v))}>
                        {months.map((m) => (
                          <Picker.Item key={m} label={m.toString().padStart(2, "0")} value={m} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.pickerLabel}>Año</Text>
                    <View style={styles.pickerWrap}>
                      <Picker selectedValue={selYear} onValueChange={(v) => setSelYear(Number(v))}>
                        {years.map((y) => (
                          <Picker.Item key={y} label={y.toString()} value={y} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
                <Text style={styles.hint}>{expiryIsValid() ? "" : "La fecha debe ser igual o posterior al mes actual"}</Text>

                <TextInput
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={handleCvv}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                />
                <Text style={styles.hint}>{isCvvValid ? "" : "CVV = 3 dígitos"}</Text>

                <TouchableOpacity onPress={handleAdd} style={[styles.addBtn, { opacity: canAdd ? 1 : 0.5 }]} disabled={!canAdd}>
                  <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Agregar método</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setShowNewForm(false); if (pagos.length === 0) setModalVisible(false); }} style={{ marginTop: 10 }}>
                  <Text style={{ color: "#ff6b00", fontWeight: "700", textAlign: "center" }}>Cancelar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {/* cerrar modal */}
            {pagos.length > 0 && !showNewForm && (
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                <Text style={{ color: "#ff6b00", fontWeight: "700", textAlign: "center" }}>Cerrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  label: { fontSize: 18, fontWeight: "900", color: "#ff6b00", marginBottom: 6 },
  cardContent: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 10 },
  infoText: { flex: 1, color: "#000", fontSize: 16 },
  buttonRight: { marginLeft: 10, justifyContent: "center", alignItems: "center" },
  changeBtn: { color: "#ff6b00", fontWeight: "bold" },

  modalBackground: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.45)" },
  modalContent: { backgroundColor: "#fff", margin: 18, borderRadius: 8, padding: 16, maxHeight: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "900", marginBottom: 10, textAlign: "center" },
  modalSubtitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },

  paymentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  selectBtn: { backgroundColor: "#ff6b00", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addNewBtn: { marginTop: 12, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: "#ff6b00" },

  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, padding: 10, marginTop: 8 },
  hint: { color: "#cc0000", fontSize: 12, marginTop: 4, minHeight: 16 },

  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  pickerWrap: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, overflow: "hidden" },
  pickerLabel: { fontSize: 12, color: "#666", marginBottom: 4 },

  addBtn: { backgroundColor: "#ff6b00", padding: 12, borderRadius: 8, marginTop: 12 },

});

export default PagoCard;
