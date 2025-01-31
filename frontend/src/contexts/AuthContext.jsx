import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch(`http://localhost:5001/api/students/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            }),
          });

          if (response.ok) {
            const { student } = await response.json();
            setUser(student);
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const response = await fetch('http://localhost:5001/api/students/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        }),
      });
      
      const { student, isFirstLogin } = await response.json();
      setUser(student);
      
      if (isFirstLogin) {
        navigate('/nickname-selection');
      } else {
        navigate('/dashboard');
      }
      
      return firebaseUser;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const value = {
    user,
    signInWithGoogle,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 