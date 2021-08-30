import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../Firebase/context/AuthContext';
import { Route, Redirect } from 'react-router-dom';
import firebase from "../../Firebase/firebase";


export default function Employee({ component: Component, ...rest }) {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const role = useRef("");
    
    const refRole = firebase.firestore().collection("userRole").doc(currentUser.uid); 
    function getUserRole() {
        refRole.get()
            .then(doc => {
                if(doc.exists)
                {
                    console.log(doc.data().job);
                    role.current = doc.data().job;
                    setTimeout(function() {
                        setLoading(false);
                    }, 100) 
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        getUserRole();
    }, []);


    return (

        <Route
            {...rest}
            render={props => {
                
                if (currentUser)
                {
                    console.log(role.current);
                    // <Component {...props} />
                }
                else
                {
                    console.log("s-a deconectat");

                    // <Redirect to="/login" />
                }
                if(loading)
                {
                    return <div>...</div>
                }
                else
                if(role.current == 'Angajat' && currentUser) 
                {
                    console.log("am intrat aici");
                    return <Component {...props} />
                }
                else 
                return <Redirect to="/neauth-home" />
            }}
        >
        </Route>
    )
}
