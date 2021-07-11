import React from 'react'
import { useAuth } from '../../Firebase/context/AuthContext';
import { Route, Redirect } from 'react-router-dom';


export default function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();
    return (
        <Route
            {...rest}
            render={props => {
                
                if (currentUser)
                {
                    console.log("Userul este: ", currentUser);
                    // <Component {...props} />
                }
                else
                {
                    console.log("s-a deconectat");

                    // <Redirect to="/login" />
                }
                return currentUser ? <Component {...props} /> : <Redirect to="/neauth-home" />
            }}
        >
        </Route>
    )
}