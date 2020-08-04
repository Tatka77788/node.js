const User = require("./user.model");
const { Router } = require("express");
const { validateUpdateUserMiddleware } = require("./user.validator");
const { authMiddleware } = require("../auth/auth.middleware");
const { avatarUploader } = require("../avatar/avatarUploader.middleware");
const { uploadAvatarToGCP } = require("../services/uploadAvatar.service");
const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.getUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json(error);
  } finally {
    res.end();
  }
});

userRouter.get("/current", authMiddleware, async (req, res) => {
  try {
    if (!req.currentUser) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { email, subscription } = req.currentUser;
    res.status(200).json({ email, subscription });
  } catch (error) {
    res.status(500).json(error);
  } finally {
    res.end();
  }
});

userRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await User.getUserById(id);
    findUser
      ? res.status(200).json(findUser)
      : res.status(400).json({ message: "User not found!" });
  } catch (error) {
    res.status(500).json(error);
  } finally {
    res.end();
  }
});

userRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.deleteUserById(id);
    deleteUser
      ? res.status(200).json({ message: "User succesful deleted!" })
      : res.status(400).json({ message: "User not found!" });
  } catch (error) {
    res.status(500).json(error);
  } finally {
    res.end();
  }
});

userRouter.patch(
  "/:id",
  validateUpdateUserMiddleware,
  //authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const results = await User.updateUser(id, req.body);
      results
        ? res.status(200).json(results)
        : res.status(404).json({ message: "User not found!", user: results });
    } catch (error) {
      res.status(400).send({ error });
    } finally {
      res.end();
    }
  }
);

userRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.createUser({ name, email, password });
    newUser
      ? res.status(201).json(newUser)
      : res.status(400).json({ message: "missing required name field" });
  } catch (error) {
    res.status(400).send({ error });
    console.log(error);
  } finally {
    res.end();
  }
});

userRouter.post(
  "/uploadAvatar",
  authMiddleware,
  avatarUploader,
  async (req, res) => {
    const { _id: id } = req.currentUser;
    const { path } = req.file;
    const avatarUrl = await uploadAvatarToGCP(path);
    await User.updateUser(id, { avatarUrl });
    res.json({ avatarUrl });
    res.end();
  }
);

userRouter.patch("/avatars", authMiddleware, avatarUploader,
  async (req, res) => {
    try {
      const { id } = req.currentUser;
      const { path } = req.file;
      const avatarPath = `${process.env.AVATAR_URL}/${path.split('\\').slice(1).join('/')}`;
      await User.updateUser(id, { avatarUrl: avatarPath });
      (!avatarPath)
      ? res.status(401).json({ message: "Not authorized" })
      : res.status(200).json({ avatarUrl: avatarPath });
    } catch (error) {
      res.status(400).json(error);
    }}
)

module.exports = { userRouter };
