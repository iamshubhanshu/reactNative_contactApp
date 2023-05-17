import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, RouteProp, Route, useRoute } from '@react-navigation/native';
import { ColorScheme, Contact, RootStackParamList } from '../database/types';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import DatabaseHelper from '../database/Database';
import UseDeviceTheme from './theme/UseDeviceTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


type ContactDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ContactDetailsScreen'>;
type ContactDetailsScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetailsScreen'>;

type Props = {

}

type ContactDetailsScreenProps = {
  route: ContactDetailsScreenRouteProp;
  navigation: ContactDetailsScreenNavigatorProp;
}

const ContactDetailsScreen = ({ route, navigation }: ContactDetailsScreenProps) => {
  const { contact } = route.params;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const colorScheme = UseDeviceTheme();

  function handleDeletePress() {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`,
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
              await db.deleteContact(contact.id);
              setContacts([...contacts.filter((c) => c.id !== contact.id)]);
              setLoading(false);
              navigation.goBack();
            } catch (error) {
              setLoading(false);
              Alert.alert("Error", "Failed to delete contact. Please try again later.");
            }
          }
        }
      ]
    );
  }

  function handleUpdatePress() {
    navigation.navigate('UpdateContact', { contact: contact });
  }

  const handleFavoritePress = async (id: number) => {
    try {
      const db = new DatabaseHelper();
      if (contact) {
        contact.isFavorite = !contact.isFavorite;
        await db.updateContact(contact);
        setContacts([...contacts]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update contact. Please try again later.");
    }
  };

  const style = styles(colorScheme);

  if (loading) {
    return (
      <View style={style.loadingContainer}>
        <ActivityIndicator size="large" color={colorScheme.contactDetailsScreen.primary} />
      </View>
    );
  }
  return (
    <View style={style.container}>
      {/* <View style={styles.headerContainer}>
       
      <Text style={styles.headerText}>Contact Details - {contact.firstName} {contact.lastName}</Text>
      </View> */}
      <View style={style.headerContainer}>
      {contact.photoUrl ? (
          <Image source={{ uri: contact.photoUrl }} style={style.photo} />
        ) : (
          <Text style={style.photoPlaceholder}>{contact.firstName.charAt(0)}{contact.lastName.charAt(0)}</Text>
        )}
        <TouchableOpacity
          style={[
            style.favoriteButton,
            { borderWidth:2 },
          ]}
          onPress={(event) => {
            event.stopPropagation();
            handleFavoritePress(contact.id);
          }}
        >
          <MaterialIcons
            name={contact.isFavorite ? 'star' : 'star-border'}
            size={24}
            color={colorScheme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <View style={style.contentContainer}>
        <View style={style.rowContainer}>
        <MaterialIcons name="person" size={24} color={colorScheme.contactDetailsScreen.text} />
          <View style={style.labelContainer}>
            <Text style={style.label}>
              {' Name:'}
            </Text>
          </View>
          <View style={style.infoContainer}>
            <Text style={style.info}>
              {contact.firstName.charAt(0).toUpperCase() + contact.firstName.slice(1)} {contact.lastName.charAt(0).toUpperCase() + contact.lastName.slice(1)}
            </Text>
          </View>
        </View>
        <View style={style.rowContainer}>
        <MaterialIcons name="phone" size={24} color={colorScheme.contactDetailsScreen.text} />
          <View style={style.labelContainer}>
            <Text style={style.label}>
              {' Phone Number:'}
            </Text>
          </View>
          <View style={style.infoContainer}>
            <Text style={style.info}>{contact.phoneNumber}</Text>
          </View>
        </View>
        <View style={style.rowContainer}>
        <MaterialIcons name="email" size={24} color={colorScheme.contactDetailsScreen.text} />
          <View style={style.labelContainer}>
            <Text style={style.label}>
              {' Email:'}
            </Text>
          </View>
          <View style={style.infoContainer}>
            <Text style={style.info}>{contact.email}</Text>
          </View>
        </View>
      </View>
      <View style={style.footerContainer}>
        <TouchableOpacity
          style={style.deleteButton}
          onPress={handleDeletePress}
        >
          <MaterialIcons
            name="delete"
            size={24}
            color={colorScheme.contactDetailsScreen.deleteButtonIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={style.updateButton}
          onPress={handleUpdatePress}
        >
          <MaterialIcons
            name="edit"
            size={24}
            color={colorScheme.contactDetailsScreen.updateButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (colorScheme: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.colors.background,
  },
  headerContainer: {
    height: 100,
    top:40,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colorScheme.contactDetailsScreen?.primary,
    borderBottomWidth:1,
    borderBottomColor: colorScheme.colors?.background,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoPlaceholder: {
    fontSize: 16,
    color: 'gray',
  },
  headerText: {
    fontSize: 24,
    color: colorScheme.contactDetailsScreen?.headerText,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginTop:55,
    color: colorScheme.contactDetailsScreen?.text,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 20,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    color: colorScheme.contactDetailsScreen?.text,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  info: {
    fontSize: 16,
    color: colorScheme.contactDetailsScreen?.text,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 10,
    // backgroundColor: colorScheme.contactDetailsScreen?.favoriteButtonBackground,
  },
  footerContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colorScheme.contactDetailsScreen?.border,
    backgroundColor: colorScheme.colors?.background,
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: colorScheme.contactDetailsScreen?.deleteButtonBackground,
    marginRight: 10,
  },
  updateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: colorScheme.contactDetailsScreen?.updateButtonBackground,

  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  starIcon: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorScheme.contactDetailsScreen?.background,
  },
});

export default ContactDetailsScreen;
