const {Router} = require('express');
const { Contact } = require('./contacts.model');

const contactRouter = Router();

contactRouter.get('/', async (req, res) =>{
    try {
        const contacts = await Contact.getContacts();
        res.json(contacts);
    } catch (error) {
        res.status(400).send({ error })
      }
});

contactRouter.get('/:id', async (req, res) =>{
    const {id} = req.params;
    try{
        const findContact = await Contact.getContactById(id);
        findContact 
        ? res.status(200).json(findContact)
        : res.status(404).json({"message": "Not found"});
        }  catch (error) {
            res.status(400).send({ error })
          }
} );

contactRouter.post('/', async (req, res) =>{
    const {name, email, phone} = req.body;
    try{
        const newContact = await Contact.addContact({name, email, phone});
        newContact
        ? res.status(201).json(newContact)
        : res.status(400).json({"message": "missing required name field"});
        }  catch (error) {
            res.status(400).send({ error })
          }
});

contactRouter.delete('/:id', async (req, res) =>{
    const {id} = req.params;
    try{
        const deleteContact = await Contact.deleteContactById(id);
        deleteContact
        ? res.status(200).json({"message": "contact deleted"})
        : res.status(404).json({"message": "Not found"});
        } catch (error) {
            res.status(400).send({ error })
          }
});

contactRouter.patch('/:id',   async (req, res) =>{
    const {id} = req.params;
    try{
        const results = await Contact.updateContact(id, req.body)
        results
        ? res.status(200).json(results)
        : res.status(404).json({"message": "Not found"});
        }  catch (error) {
            res.status(400).send({ error })
          }
});

module.exports ={
    contactRouter,
}
