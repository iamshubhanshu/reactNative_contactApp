

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  photoUrl: string | null;
  isFavorite: boolean;
}

export type RootStackParamList = {
  ContactList: undefined;
  ContactDetailsScreen: { contact: Contact };
  AddContact: undefined;
  UpdateContact: { contact: Contact };
  SearchBar: { contact: Contact[] };
};

export type ColorScheme = {
  contactDetailsScreen?: {
    primary: string;
    background: string;
    text: string;
    headerText: string;
    border: string;
    footer: string;
    favoriteButtonBackground: string;
    favoriteButtonBackgroundActive: string;
    favoriteButtonIcon: string;
    deleteButtonBackground: string;
    deleteButtonIcon: string;
    updateButtonBackground: string;
    updateButtonIcon: string;
  },
  colors: any;
  isDarkMode?: boolean;
}
