import User from "../model/user.js";
import Crypto from "crypto-js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    // user verification
    if (!email || !password) {
      return res.status(401).json({ error: "Missing required fields." });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Passwords does not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exist." });
    }

    const encryptedPassword = await Crypto.AES.encrypt(
      password,
      process.env.SECURE_PASS
    ).toString();

    if (encryptedPassword) {
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        passwordConfirm: encryptedPassword,
      });

      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } else {
      res
        .status(500)
        .json({ error: "Something went wrong while creating the account." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, userPassword } = req.body;

    if (!email || !userPassword) {
      return res.status(500).json({ error: "Missing credentials" });
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (!existingUser) {
      return res.status(401).json({ error: "Email not found." });
    }

    console.log("isPro?" + existingUser?.isPro);

    const decryptedPassword = await Crypto.AES.decrypt(
      existingUser.password,
      process.env.SECURE_PASS
    );

    const originalPassword = decryptedPassword.toString(Crypto.enc.Utf8);
    if (originalPassword !== userPassword) {
      return res.status(401).json({ error: "Incorrect password or email." });
    }

    // creating the token
    const token = jwt.sign(
      { user: existingUser._id, isPro: existingUser.isPro },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // DONT SEND PASSWORD WITH USER DATA
    const { password, passwordConfirm, ...others } = await existingUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json(others);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const logout = async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Sucessfully logged out 👋!"})
};
