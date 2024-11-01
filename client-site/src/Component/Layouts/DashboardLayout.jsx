// DashboardLayout.js
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = ({ role }) => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">
        {role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
      </h2>
      <nav>
        <ul>
          {role === 'admin' ? (
            <>   
              <li><Link to="profile">Profile</Link></li>
              <li><Link to="add-menu">Add Menu</Link></li>
              <li><Link to="menus">Delete Menu</Link></li>
        
            </>
          ) : (
            <>
              <li><Link to="profile">Profile</Link></li>
              {/* Add other user-specific links here */}
            </>
          )}
        </ul>
      </nav>
      <Outlet /> {/* Child routes will render here */}
    </div>
  );
};

export default DashboardLayout;
