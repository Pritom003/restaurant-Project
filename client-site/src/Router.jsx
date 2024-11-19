import { createBrowserRouter } from "react-router-dom";
import Layout from "./Component/Layouts/Layout";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound";
import DashboardLayout from "./Component/Layouts/DashboardLayout";
import AdminProfile from "./DASHBOARD/Admin/AdminRoutes/AdminProfile";
import Addmenu from "./DASHBOARD/Admin/AdminRoutes/Addmenu";
// import AllMenulist from "./DASHBOARD/Admin/AdminRoutes/AllMenulist";
import OrderLlist from "./DASHBOARD/Admin/AdminRoutes/OrderLlist";
import SignUp from "./Component/SignUp/SignUp";
import Login from "./Component/LogIn/LogIn";
import UserList from "./DASHBOARD/Admin/AdminRoutes/UserList";
import PrivateRoute from "./providers/PrivateRoute";
import LandingPage from "./Pages/LandingPage/LandingPage";
import MyOrders from "./DASHBOARD/My Orders/MyOrders";
import AllMenuList from "./DASHBOARD/Admin/AdminRoutes/AllMenulist";
import Profile from "./Component/Common/Profile";
import AdminRoute from "./routes/AdminRoute";

// import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/menus", element: <Home /> },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute />, // Protect the dashboard route
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout role="admin" />,
        children: [
          {
            path: "",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <AdminProfile />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "add-menu",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <Addmenu />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "dishes",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <AllMenuList />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "orderList",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <OrderLlist />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "user-list",
            element: (
              <PrivateRoute>
                <AdminRoute>
                  <UserList />
                </AdminRoute>
              </PrivateRoute>
            ),
          },
          {
            path: "my-orders",
            element: (
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            ),
          },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  { path: "signup", element: <SignUp /> },
  { path: "login", element: <Login /> },
]);

export default router;
