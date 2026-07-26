import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { db } from "../../firebase";
import { Student } from "../../types";

interface SigninBody {
  email: string;
  password: string;
}

const signin: RequestHandler<{}, unknown, SigninBody> = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const snapshot = await db
      .collection("students")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data() as Student;

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      userId: userDoc.id,
      fullName: user.fullName,
      email: user.email,
      studentNumber: user.studentNumber,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default signin;
