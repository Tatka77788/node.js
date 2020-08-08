const fs = require('fs-extra')
const { createAvatar } = require('./avatar.builder');

const uploadAvatar = (req, res, next) => {
    const { email } = req.body;
    createAvatar(email) 
    const avatarPath = `/public/images/${email}${Date.now()}.png`;
    fs.rename(`./tmp/${email}.png`, `.${avatarPath}`, err => {
      if (err) {
        console.error (err);
      }
      console.log(`Avatar for ${email} created!`);
    });
  
    req.body.avatarUrl = `${process.env.AVATAR_URL}/${avatarPath.split('/').slice(2).join('/')}`;
    next();
  };
  
  module.exports = {
    uploadAvatar,
  };