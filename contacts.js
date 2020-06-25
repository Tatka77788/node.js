global.rootPath = __dirname;
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(rootPath, "db", "contacts.json");

class Contact {
    constructor ({name, email, phone}, id) {
        this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    }
}

const listContacts = async () => {
   const contacts = await fs.readFile (contactsPath, "utf-8")
   console.table(JSON.parse(contacts));
   return JSON.parse(contacts);
  }

  const getContactById = async (contactId) => {
    const contactsData = await listContacts();
    const findContact = contactsData.find((contact) => contact.id === contactId);
    console.log(findContact)
  return contactsData.find((contact) => contact.id === contactId);
  }

  const removeContact = async(contactId) => {
    const contactsData = await listContacts();
    const findContact = contactsData.find((contact) => contact.id === contactId);
    if (findContact) {
    const newListContacts = await contactsData.filter((contact) => contact.id !== contactId);
    await fs.writeFile (contactsPath, JSON.stringify(newListContacts));}
    return findContact;
  }

  const addContact = async(name, email, phone) => {
    const contactsData = await listContacts();
    const newId = [...contactsData].pop().id + 1;
    const creatContact = new Contact ({name, email, phone}, newId );
    contactsData.push(creatContact);
    await fs.writeFile (contactsPath, JSON.stringify(contactsData));
    console.log(creatContact)
  }

  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
  };