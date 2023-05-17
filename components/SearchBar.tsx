import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,FlatList, Modal, TextInput, Keyboard } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ColorScheme, Contact, RootStackParamList } from "../database/types";
import DatabaseHelper from "../database/Database";
import ContactCard from "./ContactCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import UseDeviceTheme from "./theme/UseDeviceTheme";

interface SearchBarProps {
//   searchContacts: (query: string) => void;
}
type ContactDetailsScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetailsScreen'>;
type ContactDetailsScreenRouteProp = RouteProp<RootStackParamList, 'SearchBar'>;
type Props = {
  navigation: ContactDetailsScreenNavigatorProp;
  route: ContactDetailsScreenRouteProp;
}

const SearchBar = ({navigation, route} : Props) => {

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

    // const [contacts, setContacts] = useState<Contact[]>([]);
    const { contact } = route.params;
  // const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
   const colorScheme = UseDeviceTheme();
   

  
  // const handleSearchPress = () => {
  //   setModalVisible(true);
  // };

  // const handleSearchClose = () => {
  //   setModalVisible(false);
  // };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // fetchContacts();
    // searchContacts(searchQuery);
    // setModalVisible(false);
  };

  const handleCardPress = (id: number) => {
    Keyboard.dismiss();
    const getContact = contact.find((contact) => contact.id === id);
    console.log(getContact?.email)
    if (getContact) {
      navigation.navigate('ContactDetailsScreen', { contact: getContact });
    }
  }
  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.id)}>
      <ContactCard contact={item} />
    </TouchableOpacity>
  );
  
  const filteredContacts = searchQuery ? contact.filter((contact) => { 
    const query = searchQuery.toLowerCase();
    const firstNameMatch = contact.firstName.toLowerCase().includes(query);
    const lastNameMatch = contact.lastName.toLowerCase().includes(query);
    const phoneNumberMatch = contact.phoneNumber.includes(searchQuery);
    const fullNameMatch = `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(query);
    const fullNameMatchBackward = `${contact.lastName} ${contact.firstName}`.toLowerCase().includes(query);


    return firstNameMatch || lastNameMatch || phoneNumberMatch || fullNameMatch || fullNameMatchBackward;
  }) : null;

  const style = styles(colorScheme);
  
  return (
    <View style={style.container}>
          <TextInput
          ref={inputRef}
            placeholder="Search Contacts"
            style={style.searchInput}
            onChangeText={handleSearch}
            // onSubmitEditing={handleSearch}
            value={searchQuery}
            placeholderTextColor={colorScheme.colors.textMuted}
          />
          <FlatList
            data={filteredContacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id.toString()}
        />
    </View>
  );
};

const styles = (colorScheme : ColorScheme) => StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: colorScheme.colors.background,
  },
  searchButton: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: colorScheme.colors.card,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 5,
    color: colorScheme.colors.textMuted,
  },
  closeButton: {
    backgroundColor: "#a4b0be",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default SearchBar;
