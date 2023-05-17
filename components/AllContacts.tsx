import React, { useEffect, useState } from "react";
import UseDeviceTheme from "./theme/UseDeviceTheme";
import { ColorScheme, Contact, RootStackParamList } from "../database/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity, StyleSheet, View, FlatList, Text, TextInput, TouchableWithoutFeedback, Animated, Alert } from "react-native";
import DatabaseHelper from "../database/Database";
import ContactCard from "./ContactCard";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import SearchBar from "./SearchBar";
import Icon from "react-native-vector-icons/FontAwesome";

type ContactDetailsScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetailsScreen'>;

type Props = {
  navigation: ContactDetailsScreenNavigatorProp;
}

const AllContacts = ({ navigation }: Props) => {

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddButton, setShowAddButton] = useState(true);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const colorScheme = UseDeviceTheme();
  // const [hasLoadedContacts, setHasLoadedContacts] = useState<boolean>(false);
  // const [fadeAnim] = useState(new Animated.Value(0));


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchContacts().then((data) => {
        setContacts(data);
      });
    });
    return unsubscribe;
  }, [navigation]);


  const fetchContacts = async () => {
    const db = new DatabaseHelper();
    const contact = await db.getContacts();
    setContacts(contact);
    // setHasLoadedContacts(true);
    return contact;
  };

  const handleAddPress = () => {
    navigation.navigate('AddContact');
  }

  const handleCardPress = (id: number) => {
    const contact = contacts.find((contact) => contact.id === id);
    console.log(contact?.email)
    if (contact) {
      navigation.navigate('ContactDetailsScreen', { contact: contact });
    }
  }

  const onEdit = (id: number) => {
    const contact = contacts.find((contact) => contact.id === id);
    console.log(contact?.email)
    if (contact) {
      navigation.navigate('UpdateContact', { contact: contact });
    }
  }
  const onDelete = (item: Contact) => {
    const contact = contacts.find((contact) => contact.id === item.id);
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${item.firstName} ${item.lastName}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const db = new DatabaseHelper();
              await db.deleteContact(item.id);
              setContacts([...contacts.filter((c) => c.id !== item.id)]);
              setLoading(false);
              navigation.navigate('ContactList')
            } catch (error) {
              setLoading(false);
              Alert.alert("Error", "Failed to delete contact. Please try again later.");
            }
          }
        }
      ]
    );
  }
  const renderHiddenButtons = ({ item }: { item: Contact }) => {
    return (
      <View style={style.hiddenButtons}>
        <TouchableOpacity style={style.editButton} onPress={() => onEdit(item.id)}>
          <Icon name="edit" color="white" size={25} style={style.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={style.deleteButton} onPress={() => onDelete(item)}>
          <Icon name="trash" color="white" size={25} style={style.icon}/>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.id)} activeOpacity={1} style={{
      // backgroundColor: 'whitesmoke',
      // paddingVertical: 1,
      // paddingHorizontal: 1,
      // borderRadius: 5,
    }}>
      <ContactCard contact={item} />
    </TouchableOpacity>
  );

  const handleSearch = () => {
    navigation.navigate('SearchBar', { contact: contacts });
  }

  // const filteredContacts = searchQuery ? contacts.filter((contact) => {
  //   const query = searchQuery.toLowerCase();
  //   const firstNameMatch = contact.firstName.toLowerCase().includes(query);
  //   const lastNameMatch = contact.lastName.toLowerCase().includes(query);
  //   const phoneNumberMatch = contact.phoneNumber.includes(searchQuery);
  //   const fullNameMatch = `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(query);
  //   const fullNameMatchBackward = `${contact.lastName} ${contact.firstName}`.toLowerCase().includes(query);


  //   return firstNameMatch || lastNameMatch || phoneNumberMatch || fullNameMatch || fullNameMatchBackward;
  // })
  //   : contacts;

  const style = styles(colorScheme);

  return (
    <TouchableWithoutFeedback onPress={() => setIsSearchBarFocused(false)}>
      <View style={style.container}>
        <TextInput
          style={style.searchBar}
          placeholder="Search contacts"
          placeholderTextColor={colorScheme.colors.textMuted}
          // onChangeText={handleSearchChange}
          onFocus={() => { setShowAddButton(false); setIsSearchBarFocused(true); handleSearch(); }} // Hide add button on focus
          onBlur={() => setShowAddButton(true)} // Show add button on blur
        // value={searchQuery}
        />
        <SwipeListView
          rightOpenValue={-160}
          stopRightSwipe={-160}
          data={contacts}
          renderItem={renderContact}
          renderHiddenItem={renderHiddenButtons}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isRefreshing}
          onRefresh={async () => {
            setIsRefreshing(true);
            await fetchContacts().then((data) => {
              setContacts(data);
            });
            setIsRefreshing(false);
          }}
          onScroll={() => setIsSearchBarFocused(false)}
        />
        {/* )} */}
        {showAddButton && (
          <TouchableOpacity onPress={handleAddPress} style={style.addButton}>
            <Text style={style.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

    </TouchableWithoutFeedback>
  );
}

const styles = (colorScheme: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.colors.background,
  },
  searchBar: {
    backgroundColor: colorScheme.colors.card,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 5,
    color: colorScheme.colors.text,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#607d8b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  hiddenButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    height: 100,
  },
  editButton: {
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#8AC6D0',
    paddingHorizontal: 29,
    height: 100
  },
  deleteButton: {
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#C95B5B',
    paddingHorizontal: 29,
    height: 100,
  },
  buttonText: {
    color: '#fff',
  },
  icon: {
    textAlignVertical: 'center',
    marginTop:25,
  }
});

export default AllContacts;