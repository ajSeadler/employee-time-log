import React from "react";
import Sidebar from "./Sidebar";
import ProfilePage from "./ProfilePage";
import { Grid } from "@mui/material";

const Layout = () => {
  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid item xs={8}>
        <ProfilePage />
      </Grid>
    </Grid>
  );
};

export default Layout;
