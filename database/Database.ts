import SQLite, { SQLiteDatabase, openDatabase } from 'react-native-sqlite-storage';
import { Contact } from './types';

// SQLite.enablePromise(true);

const database_name = 'Contacts';
const contact_table_name = 'contacts';

interface IDatabaseHelper {
  getContacts: () => Promise<Contact[]>;
  addContact: (contact: Contact) => Promise<number>;
  updateContact: (contact: Contact) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
}

class DatabaseHelper implements IDatabaseHelper {
  private db!: SQLiteDatabase;

  constructor() {
    this.initializeDatabase();
  }

  // Function to initialize the database and create the contacts table if it doesn't exist
  public async initializeDatabase() {
    try {
      //open the database
      this.db = openDatabase({
        name: database_name,
      }, () => console.log('Database opened successfully'), error => console.log('Database open error: ', error));

      // Create the contacts table if it doesn't exist
      await this.db.transaction(async (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${contact_table_name} (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, phoneNumber TEXT, email TEXT, photoUrl TEXT, isFavorite INTEGER)`,
          [],
          (transaction: SQLite.Transaction, ResultSet: SQLite.ResultSet) => {
            console.log("table created successfully");
          },
          error => {
            console.log("error on creating table" + error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error initializing database');
    }
  }

  async getFavoriteContacts(): Promise<Contact[]> {
    try {
      let favoriteContacts: Contact[] = [];
      await this.db.transaction(
        async (tx) => {
          const result = await tx.executeSql(
            `SELECT * FROM ${contact_table_name} WHERE isFavorite = 1`,
            [],
            (tx, res) => {

              for (let i = 0; i < res.rows.length; i++) {
                favoriteContacts.push(res.rows.item(i));
                console.log(favoriteContacts)
              }
            }
          );
        }
      );
      return Promise.resolve(favoriteContacts);
    } catch (error) {
      console.error("Error fetching favorite contacts:", error);
      return [];
    }
  }

  
  // Function to get all contacts from the database
  public async getContacts(): Promise<Contact[]> {
    try {
      const contacts: Contact[] = [];

      await this.db.transaction(async (tx) => {
        const results = await tx.executeSql(
          `SELECT * FROM ${contact_table_name}`,
          [],
          (tx, res) => {
            for (let i = 0; i < res.rows.length; i++) {
              const contact = res.rows.item(i);
              contacts.push(contact);
            }
          }
        );
      });

      return Promise.resolve(contacts);
    } catch (error) {
      console.log(error);
      return Promise.reject(new Error('Error getting contacts from database'));
    }
  }

  // public async addContact(contact: Contact): Promise<number> {
  //   try {
  //     const results = await this.db.executeSql(
  //       `INSERT INTO ${contact_table_name} (firstName, lastName, phoneNumber, email, photoUrl, isFavorite) VALUES (?, ?, ?, ?, ?, ?)`,
  //       [
  //         contact.firstName,
  //         contact.lastName,
  //         contact.phoneNumber,
  //         contact.email,
  //         contact.photoUrl,
  //         contact.isFavorite ? 1 : 0,
  //       ]
  //     );
  //     console.log("add contact")
  //     const id = results[0].insertId;
  //     return id;
  //   } catch (error : any) {
  //     console.log(error);
  //     throw new Error('Error adding contact to database');
  //   }
  // }


  // Function to add a new contact to the database
  public async addContact(contact: Contact): Promise<number> {
    try {
      const query = `INSERT INTO ${contact_table_name} (firstName, lastName, phoneNumber, email, photoUrl, isFavorite) VALUES (?, ?, ?, ?, ?, ?)`;
      console.log(query);
      const params = [
        contact.firstName,
        contact.lastName,
        contact.phoneNumber,
        contact.email,
        contact.photoUrl,
        contact.isFavorite ? true : false,
      ];

      // const result = await this.db.executeSql(query);

      // Execute the query and return the id of the newly added contact
      var result = await this.db.transaction(async (tx) => {
        tx.executeSql(
          query, params,
          (transaction: SQLite.Transaction, ResultSet: SQLite.ResultSet) => {
            console.log("added successfully");
          },
          error => {
            console.log("error on adding" + error);
          }
        );
      });
      return 1;
    } catch (error) {
      console.log(error);
      throw new Error('Error adding contact to database');
    }
  }


  public async updateContact(contact: Contact): Promise<void> {
    try {
      await this.db.executeSql(
        `UPDATE ${contact_table_name} SET firstName = ?, lastName = ?, phoneNumber = ?, email = ?, photoUrl = ?, isFavorite = ? WHERE id = ?`,
        [
          contact.firstName,
          contact.lastName,
          contact.phoneNumber,
          contact.email,
          contact.photoUrl,
          contact.isFavorite ? 1 : 0,
          contact.id,
        ]
      );
    } catch (error) {
      console.log(error);
      throw new Error('Error updating contact in database');
    }
  }

  public async deleteContact(id: number): Promise<void> {
    try {
      await this.db.executeSql(`DELETE FROM ${contact_table_name} WHERE id = ?`, [id]);
    } catch (error) {
      console.log(error);
      throw new Error('Error deleting contact from database');
    }
  }
}

export default DatabaseHelper;
