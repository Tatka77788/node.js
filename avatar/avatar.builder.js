const Avatar = require('avatar-builder');
const fs = require('fs').promises;

const avatar = Avatar.catBuilder(128);

const createAvatar = email =>
  avatar.create(`${email}`).then(buffer => {
    return fs.writeFile(`tmp/${email}.png`, buffer);
  });

  module.exports = {
    createAvatar,
  }