import axios from 'axios';
import { Request, Response } from 'express';
import admin from '../../firebase';
import User from '../../models/user';

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, lastName, password, role } = req.body;
    
    // Validar que vengan todos los datos necesarios
    if (!email || !name || !lastName || !password || !role) {
      return res.status(400).json({ 
        message: "Faltan datos requeridos" 
      });
    }
    
    // Verificar si ya existe un usuario con ese email en la DB
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({  
        message: "El email ya está registrado" 
      });
    }
    
    // 1. Crear usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${lastName}`
    });
    
    // 2. Crear usuario en la base de datos con el firebaseUid generado
    const user = new User({
      name,
      lastName,
      email,
      role: role || 'jugador', // Por defecto 'jugador', o el role que venga en el body
      firebaseUid: userRecord.uid
    });
    
    await user.save();
    
    // Retornar el formato que espera el frontend
    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      firebaseUid: user.firebaseUid
    });
  } catch (error: any) {
    // Si hay error y se creó el usuario en Firebase, eliminarlo
    if (error.code === 11000 && req.body.firebaseUid) {
      try {
        await admin.auth().deleteUser(req.body.firebaseUid);
      } catch (deleteError) {
        console.error('Error al eliminar usuario de Firebase:', deleteError);
      }
    }
    
    // Manejar errores específicos de Firebase
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ 
        message: "El email ya está registrado en Firebase" 
      });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        message: "Email inválido" 
      });
    }
    
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({ 
        message: "La contraseña debe tener al menos 6 caracteres" 
      });
    }
    
    res.status(500).json({ 
      message: "Error al registrar usuario", 
      error: error.message 
    });
  }
};

const loginWithEmailPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const apiKey = process.env.FIREBASE_API_KEY;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });
    res.json({
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      localId: response.data.localId
    });
  } catch (error: any) {
    res.status(401).json({
      message: 'Login fallido',
      error: error.response?.data || error.message
    });
  }
};

// Obtener usuario por Firebase UID
const getUserByFirebaseUid = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    
    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      firebaseUid: user.firebaseUid
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error al obtener usuario", 
      error: error.message 
    });
  }
};

// Obtener usuario actual
const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.query;
    
    if (!firebaseUid) {
      return res.status(400).json({ message: 'firebaseUid es requerido' });
    }
    
    const user = await User.findOne({ firebaseUid: firebaseUid as string });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      firebaseUid: user.firebaseUid
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error al obtener usuario", 
      error: error.message 
    });
  }
};

export default {
  registerUser,
  loginWithEmailPassword,
  getUserByFirebaseUid,
  getCurrentUser
};