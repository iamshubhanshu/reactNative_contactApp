import { useColorScheme } from 'react-native';

const UseDeviceTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return {
    // container : {
    //     backgroundColor: isDarkMode ? '#333' : '#fff',
    // },
    contactDetailsScreen: {
      primary: '#2196f3',
      background: '#fff',
      text: isDarkMode ? 'whitesmoke':'#555',
      headerText: '#fff',
      border: '#ccc',
      footer: '#f5f5f5',
      favoriteButtonBackground: '#2196f3',
      favoriteButtonBackgroundActive: '#ff6b6b',
      favoriteButtonIcon: '#fff',
      deleteButtonBackground: '#f44336',
      deleteButtonIcon: '#fff',
      updateButtonBackground: '#2196f3',
      updateButtonIcon: '#fff',
    },
    colors: {
      primary: isDarkMode ? '#fff' : '#000',
      background: isDarkMode ? '#232B2B' : '#F8F8FF',
      // headerColor: isDarkMode ? '#555555' : 'whitesmoke',
      headerColor: isDarkMode ? '#36454F' : '#F5FEFD',
      barColor: isDarkMode ? '#36454F' : '#F5FEFD',
      text: isDarkMode ? '#fff' : '#000',
      card: isDarkMode ? '#222' : '#f0f0f0',
      textMuted: isDarkMode ? '#888' : '#777'
      // Add more color values as needed
    },
    isDarkMode,
  };
};

export default UseDeviceTheme;
