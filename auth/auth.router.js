const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../user/user.model");
const {
  validateSignUpMiddleware,
  validateLogInMiddleware,
} = require("./auth.validator");
const { authMiddleware } = require("./auth.middleware");
const {uploadAvatar} = require("../avatar/avatar.builder.middleware");
const uuid = require('uuid');
const sendEmailToVerified  = require('../sendGridEmail');

const authRouter = Router();

authRouter.post("/registration", validateSignUpMiddleware, uploadAvatar, async (req, res) => {
  const data = req.body;
  try {
    const { password } = data;
    const hashPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
    const createdUser = await User.createUser({
      ...data,
      password: hashPassword,
      verificationToken: uuid.v4(),
    });
    await this.sendEmailToVerified(createdUser);
    res.status(201).json({
      succes: true,
      message: "User succesfully created!",
      user: {
        email: createdUser.email,
        avatarUrl: createdUser.avatarUrl,
        subscription: createdUser.subscription,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  } finally {
    res.end();
  }
});

authRouter.post("/login", validateLogInMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentUser = await User.getUsers({ email });
    if (!currentUser.length) {
      res.status(400).send(`User with email: ${email} not found`);
      return;
    }
    const isEqualPassword = await bcrypt.compare(
      password,
      currentUser[0].password
    );

    if (!isEqualPassword) {
      res.status(400).json({ succes: false, message: `Incorrect password!` });
      return;
    }
    const acces_token = await jwt.sign(
      { id: currentUser[0]._id },
      process.env.PRIVATE_JWT_KEY,
      { expiresIn: "1d" }
    );

    await User.updateUser(currentUser[0]._id, { token: acces_token });

    res.json({
      acces_token: `Bearer ${acces_token}`,
      user: {
        email: currentUser[0].email,
        avatarUrl: currentUser[0].avatarUrl,
        subscription: currentUser[0].subscription,
      },
    });
  } catch (error) {
    res.status(400).json({ succes: false, error });
  } finally {
    res.end();
  }
});

authRouter.post("/logout", authMiddleware, async (req, res) => {
  try {
    const { id } = req.currentUser;
    const user = User.getUserById(id);
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    await User.updateUser(id, { token: "" });
    res.status(204);
  } catch (error) {
    res.status(500).json({ succes: false, error });
  } finally {
    res.end();
  }
});

authRouter.get('/verify/:verificationToken',  async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const verifyUser = await User.getUserByVerificationToken(
      verificationToken
    );
    if (!verifyUser) {
      res.status(404).json({message:"User not found"});
    }
    await User.verificatedUser(verifyUser.email);

    res.status(200).json("User been verificated");
  } catch (err) {
    res.status(400).json({err});
  }
})

module.exports = { authRouter };
