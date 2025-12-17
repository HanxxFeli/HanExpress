// File contains the context that will be used to share user authentication data

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import firebase from 'firebase/compat/app';

// create context for auth data
const AuthContext = createContext({
    user: null, // logged in user, default null if not logged in 
    loading: true, // checking for auth status
    signInWithGoogle: async () => {}, // sign in function
    signOut: async() => {} // sign out function
})

/**
 * AuthProvider component
 * @param props - Component props
 * @param props.children - Child components
 */
export function AuthProvider( {children} ) { 
    const [user, setUser] = useState(null) // current user state 
    const [loading, setLoading] = useState(true) // authentication checking state

    // check authentication changes
    useEffect(() => { 
        const unsubscribe = onAuthStateChanged(auth, (user) => { 
            setUser(user) // update state
            setLoading(false) // done loading 
        })

        return unsubscribe // unsubscribe during unmount
    }, [])

    
    /**
     * Google Sign in
     */
    const signInWithGoogle = async () => { 
        try { 
            await signInWithPopup(auth, googleProvider) // uses firebase file functions
        }
        catch (error) { 
            console.error('Sign in error:', error);
            throw error; // rethrow error
        }
    }

    /**
     * Signout User
     */
    const signOut = async () => { 
        try { 
            await firebaseSignOut(auth)
        } 
        catch (error) { 
            console.error('Sign out error:', error);
            throw error;
        }
    }

    // Provide the auth data and functions to all child components
    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access auth context in any component
 * Destructuring: const { user, signInWithGoogle } = useAuth();
 */
export const useAuth = () => useContext(AuthContext)
 
  