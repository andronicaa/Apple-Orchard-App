import SignUp from './Components/SignUp/SignUp';
import Login from './Components/SignUp/Login';
import MainPage from './Components/AuthHome/MainPage';
import AuthProvider from './Firebase/context/AuthContext';
import Grower from './Components/Routes/Grower';
import Employee from "./Components/Routes/Employee";
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
import TreatmentSchedule from "./Components/Orchard/TreatmentSchedule";
import Weather from "./Components/Weather/Weather";
import NotFoundPage from "./Components/Home/NotFoundPage";
import ProgramTreatment from './Components/Orchard/ProgramTreatment/ProgramTreatment';
import FunctionalProgramTreatment from "./Components/Orchard/ProgramTreatment/FunctionalProgramTreatment";
import Equipment from "./Components/Orchard/Equipment";
import TreeReceipts from './Components/Orchard/TreeReceipts';
import Task from './Components/Weather/Task/Task';
import AddJob from './Components/Job/AddJob';
import PostsTab from './Components/Job/PostsTab';
import SeePosts from './Components/Job/Employee/SeePosts';
import PostsPage from './Components/Job/Employee/PostsPage';
import Responses from './Components/Job/Employee/Responses';
import SavedPosts from './Components/Job/Employee/SavedPosts';
import Employer from './Components/Job/Employee/Employer';
import GrowerProfile from './Components/GrowerProfile/GrowerProfile';
import Statistics from './Components/Statistics/Statistics';
import { useAuth } from './Firebase/context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {

  return (
    <div>
    <Router>
        <AuthProvider>
            <Switch>
                <Route path="/neauth-home" component={Home} />
                <PrivateRoute exact path="/" component={MainPage} />
                <Route path="/update-profile" component={UpdateProfile} />
                <Route path="/signup" component={SignUp} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/login" component={Login} />
                <Route path="/addprofile" component={AddProfile} />
                <Route path="/profile" component={TempProfile} />
                <Route path="/orchardinfo" component={OrchardInfo}/>
                <Route path="/receiptpagetabs" component={ReceiptPageTabs} />
                <Route path="/maininfobudget" component={MainInfoBudget} />
                <Route path="/daunatori" component={Daunatori} />
                <Route path="/treatment-schedule" component={TreatmentSchedule} />
                <Grower path="/weather" component={Weather} />
                <Route path="/program-treatment" component={ProgramTreatment} />
                <Route path="/functional-program-treatment" component={FunctionalProgramTreatment} />
                <Route path="/equipment" component={Equipment} />
                <Route path="/trees" component={TreeReceipts} />
                <Route path="/task" component={Task} />
                <Route path="/posts-tab" component={PostsTab} />
                <Employee path="/see-posts" component={SeePosts} />
                <Employee path="/posts-page" component={PostsPage} />
                <Employee path="/responses" component={Responses} />
                <Employee path="/saved-posts" component={SavedPosts} />
                <Employee path="/employer" component={Employer} />
                <Grower path="/grower-profile" component={GrowerProfile} />
                <Grower path="/statistics" component={Statistics} />
                <Route component={NotFoundPage} />
            </Switch>
        </AuthProvider>
    </Router>
  </div>
  );
}

export default App;
