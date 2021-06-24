import styles from "./Components/Style/Main.module.css";
import SignUp from './Components/SignUp/SignUp';
import Login from './Components/SignUp/Login';
import MainPage from './Components/AuthHome/MainPage';
import AuthProvider from './Firebase/context/AuthContext';
import PrivateRoute from './Components/Routes/PrivateRoute';
import ForgotPassword from './Components/SignUp/ForgotPassword';
import UpdateProfile from './Components/SignUp/UpdateProfile';
import Home from "./Components/Home/Home";
import AddProfile from "./Components/SignUp/AddProfile";
import TempProfile from "./Components/Feed/TempProfile";
import OrchardInfo from "./Components/Orchard/OrchardInfo";
import ReceiptPageTabs from "./Components/Orchard/ReceiptPageTabs";
import MainInfoBudget from "./Components/Orchard/Budget/MainInfoBudget.js";
import Daunatori from "./Components/Orchard/Health/Daunatori";
import Weather from "./Components/Weather/Weather";
import TreatmentSchedule from './Components/Orchard/TreatmentSchedule';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <div>
    <Router>
        <AuthProvider>
            <Switch>
              <Route path="/neauth-home" component={Home} />
              <PrivateRoute exact path="/" component={MainPage} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={SignUp} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/login" component={Login} />
              <Route path="/addprofile" component={AddProfile} />
              <Route path="/profile" component={TempProfile} />
              <Route path="/orchardinfo" component={OrchardInfo}/>
              <Route path="/receiptpagetabs" component={ReceiptPageTabs} />
              <Route path="/maininfobudget" component={MainInfoBudget} />
              <Route path="/daunatori" component={Daunatori} />
              <Route path="/weather" component={Weather} />
              <Route path="/treatment-schedule" component={TreatmentSchedule} />
            </Switch>
        </AuthProvider>
    </Router>
  </div>
  );
}

export default App;
