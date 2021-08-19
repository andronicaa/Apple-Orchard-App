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
import OrchardInfo from "./Components/Orchard/OrchardInfo";
import ReceiptPageTabs from "./Components/Orchard/ReceiptPageTabs";
import MainInfoBudget from "./Components/Orchard/Budget/MainInfoBudget.js";
import Daunatori from "./Components/Orchard/Health/Daunatori";
import TreatmentSchedule from "./Components/Orchard/TreatmentSchedule";
import Weather from "./Components/Weather/Weather";
import NotFoundPage from "./Components/Home/NotFoundPage";
import ProgramTreatment from './Components/Orchard/ProgramTreatment/ProgramTreatment';
import Equipment from "./Components/Orchard/Equipment";
import TreeReceipts from './Components/Orchard/TreeReceipts';
import Task from './Components/Weather/Task/Task';
import PostsTab from './Components/Job/PostsTab';
import SeePosts from './Components/Job/Employee/SeePosts';
import Responses from './Components/Job/Employee/Responses';
import SavedPosts from './Components/Job/Employee/SavedPosts';
import Employer from './Components/Job/Employee/Employer';
import GrowerProfile from './Components/GrowerProfile/GrowerProfile';
import Statistics from './Components/Statistics/Statistics';
import ForumMainPage from './Components/Forum/ForumMainPage';
import DetailedTopic from './Components/Forum/DetailedTopic';
import EmployeeTask from './Components/Job/Employee/EmployeeTask';
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
                {/* Rutele pentru utilizatorii de tip cultivatori */}
                <Grower path="/orchardinfo" component={OrchardInfo}/>
                <Grower path="/receiptpagetabs" component={ReceiptPageTabs} />
                <Grower path="/maininfobudget" component={MainInfoBudget} />
                <Grower path="/daunatori" component={Daunatori} />
                <Grower path="/treatment-schedule" component={TreatmentSchedule} />
                <Grower path="/weather" component={Weather} />
                <Grower path="/program-treatment" component={ProgramTreatment} />
                <Grower path="/equipment" component={Equipment} />
                <Grower path="/trees" component={TreeReceipts} />
                <Grower path="/task" component={Task} />
                <Grower path="/posts-tab" component={PostsTab} />
                <Grower path="/grower-profile" component={GrowerProfile} />
                <Grower path="/statistics" component={Statistics} />
                <Grower path="/forum" component={ForumMainPage} />
                <Grower path="/detailed-topic" component={DetailedTopic} />

                {/* Rutele pentru utilizatorii de tip angajati */}

                <Employee path="/see-posts" component={SeePosts} />
                <Employee path="/responses" component={Responses} />
                <Employee path="/saved-posts" component={SavedPosts} />
                <Employee path="/employer" component={Employer} />
                <Employee path="/employee-task" component={EmployeeTask} />
                <Route component={NotFoundPage} />
            </Switch>
        </AuthProvider>
    </Router>
  </div>
  );
}

export default App;
