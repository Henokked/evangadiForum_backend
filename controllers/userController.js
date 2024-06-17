import { dbConn } from "../db/dbConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const [user] = await dbConn.query(
      "SELECT username, userid FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (user.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await dbConn.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }

  res.send({ username, firstname, lastname, email, password });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const [user] = await dbConn.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userid: user[0].userid, username: user[0].username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({ token, username: user[0].username });
  } catch (error) {
    console.error("Login controller error: ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const checkUser = async (req, res) => {
  res
    .status(200)
    .json({ username: req.user.username, userid: req.user.userid });
};

export const getUser = async (req, res) => {
  const [user] = await dbConn.query("SELECT * FROM users WHERE userid = ?", [
    req.params.userId,
  ]);

  if (user.length === 0) {
    return res.status(404).send("User not found");
  }

  res.send(user);
};
