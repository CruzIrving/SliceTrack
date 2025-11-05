import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TabNavigation from './Navigation/TabNavigation';

export default function App() {
  return (
<NavigationContainer>
  <TabNavigation></TabNavigation>
</NavigationContainer>
  );
}
