
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddContact from './components/AddContact';
import ContactList from './components/ContactList';
import UpdateContact from './components/UpdateContact';
import DatabaseHelper from './database/Database';
import ContactDetailsScreen from './components/ContactDetailsScreen';
import { Contact, RootStackParamList } from './database/types';
import { StyleSheet } from 'react-native';
import SearchBar from './components/SearchBar';
import UseDeviceTheme from './components/theme/UseDeviceTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();
// const Stack = createNativeStackNavigator();

const App = (): JSX.Element => {

  const colorScheme = UseDeviceTheme();
  useEffect(() => {
    const databaseHelper = new DatabaseHelper();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ContactList">
        <Stack.Screen name="ContactList" component={ContactList} options={{ title: 'Contacts', headerStyle: { backgroundColor: colorScheme.colors.headerColor }, headerTitleStyle: { fontFamily: 'sans serif' ,color: colorScheme.colors.text } }} />
        <Stack.Screen name="AddContact" component={AddContact} options={{ title: 'Add Contact', headerStyle: { backgroundColor: colorScheme.colors.headerColor }, headerTitleStyle: { fontFamily: 'sans serif',color: colorScheme.colors.text } }} />
        <Stack.Screen name="UpdateContact" component={UpdateContact} options={{ title: 'Update Contact', headerStyle: { backgroundColor: colorScheme.colors.headerColor }, headerTitleStyle: { fontFamily: 'sans serif',color: colorScheme.colors.text } }} />
        <Stack.Screen name="ContactDetailsScreen" component={ContactDetailsScreen} options={{ title: 'Contact Details', headerStyle: { backgroundColor: colorScheme.colors.headerColor }, headerTitleStyle: { fontFamily: 'sans serif',color: colorScheme.colors.text } }} />
        <Stack.Screen name="SearchBar" component={SearchBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
