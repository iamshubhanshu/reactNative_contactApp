import React from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { ColorScheme, Contact } from '../database/types';
import { useNavigation } from '@react-navigation/native';
import UseDeviceTheme from './theme/UseDeviceTheme';

interface ContactProps {
  contact: Contact;
}

const ContactCard = ({ contact}: ContactProps) => {

  const colorScheme = UseDeviceTheme();

  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const style = styles(colorScheme);

  return (
      <Animated.View
        style={[
          style.container,
          { opacity: fadeAnim, justifyContent: 'space-between' },
        ]}
      >
        <View style={style.leftContainer}>
          <Image
            style={style.avatar}
            source={{ uri: contact.photoUrl ?? '' }}
          />
          <View style={style.infoContainer}>
            <Text style={style.name}>
              {contact.firstName.charAt(0).toUpperCase() +
                contact.firstName.slice(1)}{' '}
              {contact.lastName.charAt(0).toUpperCase() +
                contact.lastName.slice(1)}
            </Text>
            <Text style={style.phone}>{contact.phoneNumber}</Text>
          </View>
        </View>
      </Animated.View>
  );
};

const styles =(colorScheme : ColorScheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor : colorScheme.colors.background,
    // backgroundColor: 'blue',
    // borderRadius: 10,
    // marginVertical: 5,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colorScheme.colors.primary,
    marginRight: 10,
  },
  infoContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: colorScheme.colors.textMuted,
  },
  phone: {
    fontSize: 14,
    color: colorScheme.colors.textMuted,
  }
});

export default ContactCard;
