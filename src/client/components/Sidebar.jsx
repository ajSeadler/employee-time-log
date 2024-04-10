import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar__list">
        <li className="sidebar__item">
          <HomeIcon className="sidebar__icon" />
          <span className="sidebar__text">Home</span>
        </li>
        <li className="sidebar__item">
          <ScheduleIcon className="sidebar__icon" />
          <span className="sidebar__text">Add Hours</span>
        </li>
        <li className="sidebar__item">
          <PaymentIcon className="sidebar__icon" />
          <span className="sidebar__text">Track PayStub</span>
        </li>
        <li className="sidebar__item">
          <SettingsIcon className="sidebar__icon" />
          <span className="sidebar__text">Settings</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
