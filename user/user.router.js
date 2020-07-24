const User = require("./user.model");
const { Router } = require("express");
const { validateUpdateUserMiddleware } = require("./user.validator");
const { authMiddleware } = require("../auth/auth.middleware");
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
  authMiddleware,
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

module.exports = { userRouter };
