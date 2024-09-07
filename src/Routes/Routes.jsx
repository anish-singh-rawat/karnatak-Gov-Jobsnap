import Login from '../pages/labour/Login';
import PrivateRoute from './PrivateRoutes';
import Register from '../pages/labour/Register';
import Bank from '../pages/labour/registration/Bank';
import BoardsHome from '../pages/HomePage/BoardsHome';
import Family from '../pages/labour/registration/Family';
import Review from '../pages/labour/registration/Review';
import DashboardMigrant from '../profile/dashBoardMigrant';
import Address from '../pages/labour/registration/Address';
import Personal from '../pages/labour/registration/Personal';
import NintyDays from '../pages/labour/registration/NintyDays';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registration from '../pages/labour/registration/Registration';
import SchemesHomePage from '../pages/labour/registration/schemesHomePage';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BoardsHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/boardsHome" element={<BoardsHome />} />
                <Route path="/schemeshomepage" element={<SchemesHomePage />} />
                

                <Route path="/dashboardMigrant" element={
                        <PrivateRoute>
                            <DashboardMigrant />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/registration"
                    element={
                        <PrivateRoute>
                            <Registration />
                        </PrivateRoute>
                    }
                />
                <Route
                path="/registration/:labourUserID/:id"
                element={
                    <PrivateRoute>
                        <Registration />
                    </PrivateRoute>
                }
             />

                <Route
                    path="/registration/family/:labourUserID/:isEdited?"
                    element={
                        <PrivateRoute>
                            <Family />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/address"
                    element={
                        <PrivateRoute>
                            <Address />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/personal"
                    element={
                        <PrivateRoute>
                            <Personal />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/bank"
                    element={
                        <PrivateRoute>
                            <Bank />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/ninetyDays"
                    element={
                        <PrivateRoute>
                            <NintyDays />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/review"
                    element={
                        <PrivateRoute>
                            <Review />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;