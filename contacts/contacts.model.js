//global.rootPath = __dirname;
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join( "db", "contacts.json");

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

  const getContactById = async id => {
    const contactsData = await listContacts();
    const findContact = contactsData.find((contact) => contact.id === id);
    console.log(findContact)
  return contactsData.find((contact) => contact.id === id);
  }

  const removeContact = async id => {
    const contactsData = await listContacts();
    const newListContacts = await contactsData.filter((contact) => contact.id !== id);
    await fs.writeFile (contactsPath, JSON.stringify(newListContacts));
    return newListContacts;
  }

  const addContact = async(name, email, phone) => {
    const contactsData = await listContacts();
    const newId = [...contactsData].pop().id + 1;
    const creatContact = new Contact ({name, email, phone}, newId );
    contactsData.push(creatContact);
    await fs.writeFile (contactsPath, JSON.stringify(contactsData));
    return creatContact
  }

  const updateContact = async(id, value) => {
    const contactsData = await listContacts();
    const getContact = await getContactById(id);
    if (getContact) {
      const newResult = {...getContact, ...value};
    const newResults = contactsData.map((contact) => (contact.id !== newResult.id ? contact : newResult))

   await fs.writeFile(contactsPath, JSON.stringify(newResults));
   return newResult;
}
  }

  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
  };