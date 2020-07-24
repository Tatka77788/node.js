const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose').Types;

const contactSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  subscription: String,
  token: String
}, { versionKey: false });

class Contact {
  constructor () {
    this.contact = mongoose.model('Contact', contactSchema);
  }
   getContacts = async () =>{
    return await this.contact.find();
 };

  getContactById = async contactId => {
    if (ObjectId.isValid(contactId)) {
  return await this.contact.findById(contactId);}
};

 deleteContactById = async contactId => {
  if (ObjectId.isValid(contactId)) {
  return await this.contact.findByIdAndDelete(contactId);}
};

 addContact = async contact => {
  return await this.contact.create(contact);
};

 updateContact = async (contactId, data) => {
  if (ObjectId.isValid(contactId)) {
  return await this.contact.findByIdAndUpdate(contactId, data, { new: true });}
}
}

module.exports = new Contact();