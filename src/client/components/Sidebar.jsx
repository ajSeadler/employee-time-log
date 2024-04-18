import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from '@mui/material/Avatar'; // Import Avatar from MUI

const Sidebar = () => {
  return (
    <div className="sidebar">
     <div className="avatar"> {/* Center the Avatar */}
        <Avatar
          alt="J"
          src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2021/03/06092652/Pembroke-Welsh-Corgi-head-portrait-in-a-field.jpg"
          sx={{ width: 100, height: 100, marginTop:'15px' }} // Increase size of Avatar
        />
      </div>
      <ul className="sidebar__list">
        <Link to="/me" className="sidebar__link">
          <li className="sidebar__item">
            <HomeIcon className="sidebar__icon" />
            <span className="sidebar__text">Dashboard</span>
          </li>
        </Link>
        <Link to="/addhours" className="sidebar__link">
          <li className="sidebar__item">
            <AddCircleOutlineIcon className="sidebar__icon" />
            <span className="sidebar__text">Add Hours</span>
          </li>
        </Link>
        <Link to="/trackpay" className="sidebar__link">
          <li className="sidebar__item">
            <AssignmentIcon className="sidebar__icon" />
            <span className="sidebar__text">Timesheet</span>
          </li>
        </Link>
        <Link to="/settings" className="sidebar__link">
          <li className="sidebar__item">
            <SettingsIcon className="sidebar__icon" />
            <span className="sidebar__text">Settings</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
