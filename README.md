# React Native Contact App

This is a simple React Native application that allows you to manage contacts. The app provides features to add new contacts, update existing contacts, delete contacts, view contact details, and mark contacts as favorites.

## Features

- Add New Contact: Enter the details of a new contact, including first name, last name, phone number, email, and an optional photo. Save the contact to the database.

- Update Contact: Edit the details of an existing contact, including first name, last name, phone number, email, and photo. Update the contact's information in the database.

- Delete Contact: Remove a contact from the database. Confirmation is required before the contact is deleted.

- Show Contact Details: View the details of a specific contact, including their first name, last name, phone number, email, and photo.

- Favorite Contact: Mark a contact as a favorite to easily identify important contacts. The app provides a way to toggle the favorite status of a contact.

## Getting Started

Follow these steps to set up and run the React Native Contact App:

1. Make sure you have Node.js and npm installed on your system.

2. Clone this repository to your local machine.

3. Open a terminal and navigate to the project's root directory.

4. Install the project dependencies by running the following command:
   ```
   npm install
   ```

5. Connect your Android or iOS device, or set up an emulator/simulator to run the app.

6. Start the Metro bundler by running the following command:
   ```
   npx react-native start
   ```

7. In a separate terminal window, build and run the app on your device/emulator/simulator:
   - For Android:
     ```
     npx react-native run-android
     ```
   - For iOS:
     ```
     npx react-native run-ios
     ```

8. The React Native Contact App should now be running on your device/emulator/simulator.

## Libraries and Technologies Used

The React Native Contact App utilizes the following libraries and technologies:

- React Native: A framework for building native mobile apps using JavaScript and React.

- SQLite: A lightweight, serverless database engine used to store and retrieve contact information.

- react-native-sqlite-storage: A SQLite database implementation for React Native.

- react-navigation: A routing and navigation library for React Native apps.

- react-native-image-picker: A library for selecting images from the device's gallery or taking new photos.

- FontAwesome: A library of customizable icons for React Native.

## Folder Structure

The project's folder structure is organized as follows:

```
├── android
│   └── ... (Android-specific files and configurations)
├── ios
│   └── ... (iOS-specific files and configurations)
├── src
│   ├── components
│   │   └── ... (Reusable UI components)
│   ├── database
│   │   └── ... (Database-related files and operations)
│   ├── screens
│   │   └── ... (Different screens of the app)
│   ├── theme
│   │   └── ... (Theme-related files and styling)
│   ├── App.tsx
│   └── ... (Other app-related files)
└── ... (Other project-related files and configurations)
```

## Contributing

If you would like to contribute to the React Native Contact App, feel free to submit a pull request with your proposed changes. Contributions are always welcome!

## License

The React Native Contact App is open source and available under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the app as per the terms of the license.
