import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ColorScheme, Contact, RootStackParamList } from '../database/types';
import DatabaseHelper from '../database/Database';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UseDeviceTheme from './theme/UseDeviceTheme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Asset, launchImageLibrary } from 'react-native-image-picker';

type ContactDetailsScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetailsScreen'>;

type Props = {
  navigation: ContactDetailsScreenNavigatorProp;
  route: RouteProp<RootStackParamList, 'UpdateContact'>;
}

const UpdateContact: React.FC<Props> = ({ route, navigation }) => {
  const { contact } = route.params;
  const [firstName, setFirstName] = useState<string>(contact.firstName);
  const [lastName, setLastName] = useState<string>(contact.lastName);
  const [phoneNumber, setPhoneNumber] = useState<string>(contact.phoneNumber);
  const [email, setEmail] = useState<string>(contact.email);
  const [photoUrl, setPhotoUrl] = useState<Asset | { uri: string; type: string | null; name: string } | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(contact.isFavorite);
  const colorScheme = UseDeviceTheme();

  const databaseHelper = new DatabaseHelper;

  useEffect(() => {
    navigation.setOptions({ title: `Edit ${firstName}` });

    if (contact.photoUrl) {
      const photoType = contact.photoUrl.substring(
        contact.photoUrl.lastIndexOf(".") + 1
      );
      const photoName = contact.photoUrl.substring(
        contact.photoUrl.lastIndexOf("/") + 1
      );
      setPhotoUrl({ uri: contact.photoUrl, type: `image/${photoType}`, name: photoName });
    }
  }, [firstName, navigation]);

  // useEffect(() => {
  //   if (contact.photoUrl) {
  //     setPhotoUrl({ uri: contact.photoUrl, type: 'image/jpeg' });
  //   }
  // }, [contact.photoUrl]);

  const handleSave = () => {
    const updatedContact = {
      id: contact.id,
      firstName,
      lastName,
      phoneNumber,
      email,
      photoUrl: photoUrl?.uri || null,
      isFavorite,
    };

    databaseHelper.updateContact(updatedContact).then(() => {
      Alert.alert('Success', 'Contact updated successfully');
      navigation.navigate('ContactList');
    });
  };

  const handleDelete = () => {
    databaseHelper.deleteContact(contact.id).then(() => {
      Alert.alert('Success', 'Contact deleted successfully');
      navigation.navigate('ContactList');
    });
  };

  const handleFavoriteChange = () => {
    setIsFavorite(!isFavorite);
  };

  const handlePhotoChange = () => {
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
        // const asset = {
        //   uri: response.assets[0].uri,
        //   type: undefined,
        //   name: response.assets[0].fileName || 'photo.jpg',
        // };
      }
    });
  };

  const style = styles(colorScheme);
  return (
    <View style={style.container}>
      <TouchableOpacity
        style={style.photoPicker}
        onPress={handlePhotoChange}
      >
        {photoUrl ? (
          <Image source={{ uri: photoUrl.uri }} style={style.photo} />
        ) : (
          <Text style={style.photoPlaceholder}>Add photo</Text>
        )}
      </TouchableOpacity>
      <View style={style.viewIconText}>
        <Icon name="user-circle" size={16} color="#666" style={style.inputIcon} />
        <TextInput
          style={style.textInput}
          placeholder="firstName"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      <View style={style.viewIconText}>
        {/* <Icon name="user-circle" size={30} color="#666" style={styles.inputIcon} /> */}
        <TextInput
          style={[style.textInput, { marginLeft: 25 }]}
          placeholder="lastName"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <View style={style.viewIconText}>
        <Icon name="phone" size={30} color="#666" style={style.inputIcon} />
        <TextInput
          style={style.textInput}
          placeholder="PhoneNumber"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={style.viewIconText}>
        <Icon name="envelope" size={30} color="#666" style={style.inputIcon} />
        <TextInput
          style={style.textInput}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {/* <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Favorite:</Text>
        <CheckBox
          style={styles.checkbox}
          value={isFavorite}
          onValueChange={handleFavoriteChange}
        />
      </View> */}
      <TouchableOpacity style={style.button} onPress={handleSave}>
        <Text style={style.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.button}
        onPress={() =>
          Alert.alert(
            'Delete Contact',
            `Are you sure you want to delete ${firstName} ${lastName}?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              { text: 'OK', onPress: handleDelete },
            ]
          )
        }
      >
        <Text style={style.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = (colorScheme: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colorScheme.colors.background,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    color: colorScheme.colors.text,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  photoPicker: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  checkbox: {},
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  viewIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 8,

    fontSize: 18,
  },
});
export default UpdateContact;
