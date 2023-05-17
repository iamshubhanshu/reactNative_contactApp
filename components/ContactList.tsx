import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import AllContacts from './AllContacts';
import FavoriteContacts from './FavoriteContacts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../database/types';
import UseDeviceTheme from './theme/UseDeviceTheme';

type ContactDetailsScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetailsScreen'>;

type Props = {
    navigation: ContactDetailsScreenNavigatorProp;
}

const ContactList: React.FC<Props> = ({navigation}) => {
  const Tab = createMaterialBottomTabNavigator();
  const colorScheme = UseDeviceTheme();


  return (
    <View style={{ flex: 1 }}>
    <Tab.Navigator
      initialRouteName="All Contacts"
      shifting={true}
      barStyle={{ backgroundColor: colorScheme.colors.barColor}}
      // activeColor={colorScheme.colors.textMuted}
      inactiveColor={colorScheme.colors.textMuted}
      >
      <Tab.Screen
        name="All Contacts"
        component={AllContacts}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="users" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteContacts}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="star" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  </View>
  );
};

export default ContactList;
