import { Request, Response, NextFunction } from "express";
import admin from "../firebase";

export const authenticateFirebase = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

    if (!token) {
    return res.status(401).json({ 
      message: "Invalid token format",
      error: true 
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).firebaseUser = decodedToken;
    (req as any).userId = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};