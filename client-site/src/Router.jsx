import { createBrowserRouter } from "react-router-dom";
import Layout from "./Component/Layouts/Layout";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound";


import DashboardLayout from "./Component/Layouts/DashboardLayout";
import AdminProfile from "./DASHBOARD/Admin/AdminRoutes/AdminProfile";
import Addmenu from "./DASHBOARD/Admin/AdminRoutes/Addmenu";
import AllMenulist from "./DASHBOARD/Admin/AdminRoutes/AllMenulist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout role="admin" />, // Temporary hardcoded role
    children: [
      { path: "profile", element: <AdminProfile/> },
      { path: "add-menu", element: <Addmenu /> },
      { path: "menus", element: <AllMenulist /> },
      // { path: "add-notice", element: <AddNotice /> },
      // { path: "user-list", element: <UserList /> },
      // { path: "employee-list", element: <EmployeeList /> },
      // { path: "payment-history", element: <PaymentHistory /> },
    ],
  },
]);

export default router;
