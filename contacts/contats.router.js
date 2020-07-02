const {Router} = require('express');
const {listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact } = require('./contacts.model');

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    const contacts = await listContacts();
    res.json(contacts);
});
userRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    const findContact = await getContactById (+id);
    findContact 
    ? res.status(200).json(findContact)
    : res.status(404).json({"message": "Not found"});
});

userRouter.post('/', async (req, res) => {
    const {name, email, phone} = req.body;
    const newContact = await addContact(name, email, phone);
    newContact
    ? res.status(201).json(newContact)
    : res.status(400).json({"message": "missing required name field"});
});

userRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const deleteContact = await removeContact (+id);
    deleteContact
    ? res.status(200).json({"message": "contact deleted"})
    : res.status(404).json({"message": "Not found"});
});

userRouter.patch('/:id', async (req, res) => {
    const {id} = req.params;
    const results = await updateContact (+id, req.body)
    updateContact
    ? res.status(200).json(results)
    : res.status(404).json({"message": "Not found"});
})

module.exports = {
    userRouter
}