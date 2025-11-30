import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el userId del middleware authenticateFirebase
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - No user ID found",
        error: true
      });
    }

    // Buscar el usuario en MongoDB para verificar su rol
    const user = await User.findOne({ firebaseUid: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true
      });
    }

    // Verificar que el rol sea 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: "Forbidden - Admin access required",
        error: true
      });
    }

    // Usuario es admin, continuar
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying admin role",
      error: true
    });
  }
};