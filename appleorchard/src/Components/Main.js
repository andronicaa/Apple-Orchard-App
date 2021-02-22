import React from 'react';
import styles from "./Style/Main.module.css";
import SignUp from './SignUp/SignUp';
import Login from './SignUp/Login';
import MainPage from '../MainPage';
import AuthProvider from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './SignUp/ForgotPassword';
import UpdateProfile from './SignUp/UpdateProfile';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
  
const Main = () => {
    return ( 
        <div className={styles.mainContainer}>
            <Router>
                <AuthProvider>
                    <Switch>
                        <PrivateRoute exact path="/" component={MainPage} />
                        <Route path="/signup" component={SignUp} />
                        <Route exact path="/login" component={Login} />
                        <Route path="/forgot-password" component={ForgotPassword} />
                        <Route path="/update-profile" component={UpdateProfile} />
                    </Switch>
                </AuthProvider>
            </Router>
        </div>
        
        
    );
}
 
export default Main;