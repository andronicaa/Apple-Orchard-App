import React from 'react';
import styles from "./Style/Main.module.css";
import SignUp from './SignUp/SignUp';
import Login from './SignUp/Login';
import MainPage from '../MainPage';
import AuthProvider from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './SignUp/ForgotPassword';
import UpdateProfile from './SignUp/UpdateProfile';
import Home from '../Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
  
const Main = () => {
    return ( 
        <div>
            <Router>
                <AuthProvider>
                    <Switch>
                        <PrivateRoute exact path="/" component={MainPage} />
                        <PrivateRoute path="/update-profile" component={UpdateProfile} />
                        <Route path="/neauth-home" component={Home} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/forgot-password" component={ForgotPassword} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </AuthProvider>
            </Router>
        </div>
        
        
    );
}
 
export default Main;