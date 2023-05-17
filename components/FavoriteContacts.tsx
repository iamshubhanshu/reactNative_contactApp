import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatabaseHelper from "../database/Database";
import { useEffect, useState } from "react";
import { Contact, RootStackParamList } from "../database/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ContactCard from "./ContactCard";
import UseDeviceTheme from "./theme/UseDeviceTheme";

type ContactDetailsScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetailsScreen'>;

type Props = {
    navigation: ContactDetailsScreenNavigatorProp;
}

const FavoriteContacts = ({navigation} : Props) => {

    const [contacts,setContact] = useState<Contact[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const colorScheme = UseDeviceTheme();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchContacts().then((data) => {
                setContact(data);
            });
        });
        return unsubscribe;
    }, [navigation]);

    const fetchContacts = async () => {
        const db = new DatabaseHelper();
        const contact = await db.getFavoriteContacts();
        
        return contact;
    };

    const handleCardPress = (id: number) => {
        const contact = contacts.find((contact) => contact.id === id);
        console.log(contact?.email)
        if (contact) {
            navigation.navigate('ContactDetailsScreen', { contact: contact });
        }
    }

    const renderContact = ({ item }: { item: Contact }) => (
        <TouchableOpacity onPress={() => handleCardPress(item.id)}>
            <ContactCard contact={item} />
        </TouchableOpacity>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme.colors.background,
        },
    });

    return(
        <View style={styles.container}>
            <FlatList
                data={contacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id.toString()}
                refreshing={isRefreshing}
                onRefresh={async () => {
                    setIsRefreshing(true);
                    fetchContacts().then((data) => {
                        setContact(data);
                    });
                    setIsRefreshing(false);
                }}
            />
        </View>
    );
}

export default FavoriteContacts;

function handleFavorite(id: number): void {
    throw new Error("Function not implemented.");
}
