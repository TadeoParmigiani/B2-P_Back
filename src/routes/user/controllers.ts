import axios from 'axios';
import { Request, Response } from 'express';
import admin from '../../firebase';
import User from '../../models/user';

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, lastName, password, role } = req.body;
    
    if (!email || !name || !lastName || !password || !role) {
      return res.status(400).json({ 
        message: "Faltan datos requeridos" 
      });
    }
    
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({  
        message: "El email ya está registrado" 
      });
    }
    
    // Crear usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${lastName}`
    });
    
    // Crear usuario en la base de datos con el firebaseUid generado
    const user = new User({
      name,
      lastName,
      email,
      role: role || 'jugador',
      firebaseUid: userRecord.uid
    });
    
    await user.save();
    
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

const verifyAdmin = async (req: Request, res: Response) => {
  try {
    // Obtener el userId del middleware authenticateFirebase
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'No autenticado',
        debug: 'No se encontró userId en el request'
      });
    }
    
    const user = await User.findOne({ firebaseUid: userId });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado',
        debug: `Buscando firebaseUid: ${userId}`
      });
    }
    
    res.json({
      isAdmin: user.role === 'admin',
      role: user.role
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error al verificar permisos", 
      error: error.message 
    });
  }
};

export default {
  registerUser,
  loginWithEmailPassword,
  getUserByFirebaseUid,
  getCurrentUser,
  verifyAdmin
};