const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const uploadAvatar = require("../middleware/multer");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    // req.user.avatar = req.file.buffer;

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 240, height: 320 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ err: err.message });
  }
);

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updateInfo = req.body;

  const updateKeys = Object.keys(updateInfo);
  const allowedUpdateKeys = ["name", "email", "password", "age"];
  const isValidUpdate = updateKeys.every((update) =>
    allowedUpdateKeys.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update object key" });
  }

  try {
    const user = req.user;

    updateKeys.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send();
    // }
    sendCancellationEmail(req.user.email, req.user.name);
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
