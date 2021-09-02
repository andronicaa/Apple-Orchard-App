import React, { useState, useEffect, useContext } from 'react'
import { auth, googleProvider } from '../firebase';
import { useHistory } from 'react-router-dom';

// stabilim contextul
const AuthContext = React.createContext();


export function useAuth() {
    return useContext(AuthContext);
}
export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();



    function signInWithGoogle() {
        auth.signInWithPopup(googleProvider)
        .then((result) => {
            var credential = result.credential;
            /*
            var token = credential.accessTocken;
            var user = result.user;
            */
            setTimeout(function(){
                history.push("/addprofile");
            }, 1000);
        }).catch(error => {
            var errorCode = error.errorCode;
            var errorMessage = error.message;
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        })
    }




    // functia ce face logarea efectiva cu credentialele date de user
    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
      }

    // it is a promise!
    function login(email, password) {
        if (currentUser)
        {
            setCurrentUser(currentUser);
        }
        return auth.signInWithEmailAndPassword(email, password);
        
    }
    function logout() {
        return auth.signOut();
    }
    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
      }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }
    function emailVerification() {
        return auth.currentUser.sendEmailVerification();
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
            // setam userul curent
        })
        return unsubscribe;
    }, [])
    
    const value = {
        currentUser,
        login,
        signInWithGoogle,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        emailVerification
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}