const { db } = require('../../firebase.js')
const bcrypt = require("bcrypt");

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db
      .collection("students")
      .where("email", "==", email)
      .limit(1)
      .get();

    console.log("Email:", email);
    console.log("Snapshot:", snapshot.empty);

    if (snapshot.empty) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: userDoc.id,
      fullName: user.fullName,
      email: user.email,
      studentNumber: user.studentNumber
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = signin;