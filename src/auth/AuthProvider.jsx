import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";
import { API_URL } from "../utils/api";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Helper function to create/update user in database and get role
  const syncAndFetchUser = async (currentUser) => {
    if (!currentUser) {
      setUserRole(null);
      return;
    }
    
    try {
      // Sync user data with the backend
              await axios.post(`${API_URL}/api/users`, {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        createdAt: new Date()
      });

      // After syncing, fetch the full user profile including the role
              const response = await axios.get(`${API_URL}/api/users/${currentUser.uid}`);
      if (response.data.success) {
        setUserRole(response.data.data.role);
      }
    } catch (error) {
      console.error('Error syncing/fetching user data:', error);
      setUserRole(null); // Reset role on error
    }
  };

  // Create user with email and password
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await syncAndFetchUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncAndFetchUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await syncAndFetchUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update user profile
  const updateUserProfile = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo
      });
      // Update the user in the database as well
      await syncAndFetchUser({
        ...auth.currentUser,
        displayName: name,
        photoURL: photo
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncAndFetchUser(currentUser);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    userRole,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
