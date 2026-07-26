import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { db } from "../../firebase";
import { Student } from "../../types";

interface SignupBody {
  fullName: string;
  studentNumber: string;
  email: string;
  password: string;
}

const signup: RequestHandler<{}, unknown, SignupBody> = async (req, res) => {
  try {
    const { fullName, studentNumber, email, password } = req.body;

    if (!fullName || !studentNumber || !email || !password) {
      return res.status(400).json({ error: "Missing required signup fields" });
    }

    // check if email exists
    let existingUser = await db
      .collection("students")
      .where("email", "==", email)
      .get();

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

    const student: Student = {
      fullName,
      studentNumber,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    await userRef.set(student);

    return res.status(201).json({
      message: "User created successfully",
      userId: userRef.id,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default signup;
