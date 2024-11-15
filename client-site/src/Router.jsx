import { createBrowserRouter } from "react-router-dom";
import Layout from "./Component/Layouts/Layout";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound";
import DashboardLayout from "./Component/Layouts/DashboardLayout";
import AdminProfile from "./DASHBOARD/Admin/AdminRoutes/AdminProfile";
import Addmenu from "./DASHBOARD/Admin/AdminRoutes/Addmenu";
import AllMenulist from "./DASHBOARD/Admin/AdminRoutes/AllMenulist";
import OrderLlist from "./DASHBOARD/Admin/AdminRoutes/OrderLlist";
import SignUp from "./Component/SignUp/SignUp";
import Login from "./Component/LogIn/LogIn";
import UserList from "./DASHBOARD/Admin/AdminRoutes/UserList";
import PrivateRoute from "./providers/PrivateRoute";
// import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
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
          { path: "", element: <AdminProfile/> },
          { path: "add-menu", element: <Addmenu /> },
          { path: "menus", element: <AllMenulist /> },
          { path: "orderList", element: <OrderLlist /> },
          { path: "user-list", element: <UserList /> },
        ],
      },
    ],
  },
  { path: "signup", element: <SignUp /> },
  { path: "login", element: <Login /> },
]);

export default router;
