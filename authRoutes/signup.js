const { db } = require('../../firebase.js')
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { fullName, studentNumber, email, password } = req.body;

    // check if email exists
    var existingUser = await db
      .collection("students")
      .where("email", "==", email)
      .get();

    console.log("Email:", email);
    console.log("Snapshot:", existingUser.empty);

    if (!existingUser.empty) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // check if student number exists
    existingUser = await db
      .collection("students")
      .where("studentNumber", "==", studentNumber)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ error: "Student number already registered" });
    }

    // hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // create user
    const userRef = db.collection("students").doc();

    await userRef.set({
      fullName,
      studentNumber,
      email,
      passwordHash,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "User created successfully",
      userId: userRef.id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = signup;