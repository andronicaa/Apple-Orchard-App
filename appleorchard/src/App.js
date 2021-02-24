import styles from "./Components/Style/Main.module.css";
import SignUp from './Components/SignUp/SignUp';
import Login from './Components/SignUp/Login';
import MainPage from './MainPage';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
import ForgotPassword from './Components/SignUp/ForgotPassword';
import UpdateProfile from './Components/SignUp/UpdateProfile';
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <div>
    <Router>
        <AuthProvider>
            <Switch>
            <Route path="/neauth-home" component={Home} />
            <div className={styles.mainContainer}>
              <PrivateRoute exact path="/" component={MainPage} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={SignUp} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/login" component={Login} />
            </div>
            </Switch>
        </AuthProvider>
    </Router>
  </div>
  );
}

export default App;
