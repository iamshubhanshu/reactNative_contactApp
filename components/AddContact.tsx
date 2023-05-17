/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage'
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import DatabaseHelper from '../database/Database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ColorScheme, Contact, RootStackParamList } from '../database/types';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import UseDeviceTheme from './theme/UseDeviceTheme';

// Import vector icons
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type ContactDetailsScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetailsScreen'>;

type Props = {
  navigation: ContactDetailsScreenNavigatorProp;
}

const AddContact = ({ navigation }: Props) => {

  const [contact, setContact] = useState<Contact[]>([]);
  const id: number = 0;
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<Asset | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  // const [errors, setErrors] = useState<Array<string>>([]);
  const [error, setError] = useState<string>('');
  const photoPickerRef = useRef(null);

  const colorScheme = UseDeviceTheme();

  const handleSaveContact = async () => {

    let error = '';

    if (photoUrl === null) {
      Alert.alert("please! select a photo")
    }
    else if (firstName === '') {
      // errors.push('First name cannot be empty.');
      error = "firstName cannot be empty";
      setError(error)
    }
    else if (phoneNumber === '') {
      // errors.push('Phone number cannot be empty.');
      error = "phoneNumber cannot be empty";
      setError(error)
    }
    // else if (email === '') {
    //   // errors.push('Email cannot be empty.');
    //   error = "email cannot be empty";
    //   setError(error)

    // }
    else {
      // onSubmit(firstName, lastName, phoneNumber, email);
      const newContact = {
        id,
        firstName,
        lastName,
        phoneNumber,
        email,
        photoUrl: photoUrl?.uri || null,
        isFavorite,
      };

      const db = new DatabaseHelper();

      try {
        const id = await db.addContact(newContact);

        Alert.alert('Success', 'Contact added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // navigation.navigate('ContactDetailsScreen', { contact: newContact });
              navigation.goBack();
            },
          },
        ]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log('Error adding contact:', error);
          Alert.alert('Failed to add contact!');
        }
      }
    }


  };

  const handlePickPhoto = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: true,
      maxHeight: 300,
      maxWidth: 300,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setPhotoUrl(response.assets[0]);
      } else {
        // Show error message to the user
        Alert.alert('Error', 'Please select an image.');
      }
    });
  };

  const style = styles(colorScheme);

  return (
    <ScrollView style={style.container}>
      {/* <KeyboardAvoidingView style={style.container} behavior="padding"> */}
      <TouchableOpacity style={style.photoPicker} onPress={handlePickPhoto}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl.uri }} style={style.image} />
        ) : (
          <View style={style.imagePlaceholder}>
            <Icon name="image" size={40} color={colorScheme.colors.primary} style={style.icon} />
            <Text style={style.imagePlaceholderText}>Add photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <View style={style.viewIconText}>
        <Icon name="user" size={16} color="#666" style={style.inputIcon} />
        <TextInput
          style={style.textInput}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        >
        </TextInput>
      </View>

      <View style={style.viewIconText}>
        <Icon name="user" size={16} color="#666" style={style.inputIcon} />
        <TextInput
          style={style.textInput}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        >
        </TextInput>
      </View>

      <View style={style.viewIconText}>
        <Icon name="phone" size={30} color="#666" style={style.inputIcon} />
        <TextInput
          style={style.textInput}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        >
        </TextInput>
      </View>

      <View style={style.viewIconText}>
        <Icon name="envelope" size={16} color="#666" style={style.inputIcon} />
        <TextInput
          style={style.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        >
        </TextInput>
      </View>

      <View style={style.checkboxContainer}>
        <Text style={style.checkboxLabel}>Favorite:</Text>
        {/* <View style={style.checkbox}> */}

        <TouchableOpacity
          style={[
            style.favoriteButton,
            { backgroundColor: '#2196f3' },
          ]}
          onPress={(event) => {
            event.stopPropagation()
            setIsFavorite(!isFavorite)
          }
          }
        >
          <MaterialIcons
            name={isFavorite ? 'star' : 'star-border'}
            size={24}
            color={colorScheme.contactDetailsScreen.favoriteButtonIcon}
          />
        </TouchableOpacity>
        {/* </View> */}
      </View>
      {/* {errors.map((error, index) => ( */}
      {/* <Text key={index} style={style.error}>{error}</Text> */}
      <Text style={style.error}>{error}</Text>
      {/* ))} */}
      <Button title="Save Contact" onPress={handleSaveContact}/>
    </ScrollView>
    // </KeyboardAvoidingView>
  );
};

const styles = (colorScheme: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // justifyContent: 'center',
    backgroundColor: colorScheme.colors.background
  },
  photoPicker: {
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: '#e6e6e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: colorScheme.colors.background,
    borderWidth:1,
    borderColor: colorScheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 15,
    // fontWeight: 'bold',
    color: '#9b9b9b',
  },
  viewIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    color: colorScheme.colors.textMuted,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // top: 20,
    // right: 20,
    backgroundColor: colorScheme.contactDetailsScreen?.favoriteButtonBackground,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: colorScheme.colors.textMuted,
  },
  checkbox: {
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderColor: '#cccccc',
  },
  inputIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  icon: {
    marginRight: 0,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default AddContact;