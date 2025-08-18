import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { Grid } from "@mui/material";
import "./App.css";

import Header from "./share-view/header";
import Navbar from "./share-view/navbar";
import Footer from "./share-view/footer";
import RouterView from "./web-view/router-view";
import UserRouter from "./user-view/router-user";
import NavBarUser from "./user-view/components/navBarUser";
import RouterAdmin from "./admin-view/router-admin";
import GuardRoute from "./authentication/guardRoute";
import NavBarAdmin from "./admin-view/components/navBarAdmin";

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      autoHideDuration={2000}
    >
      <div className="App">
        <Router>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
            <Route
              path="/admin/*"
              element={<GuardRoute element={AdminLayout} />}
            />
            <Route path="/profile/*" element={<RouterUser />} />
          </Routes>
        </Router>
      </div>
    </SnackbarProvider>
  );
}

const MainLayout = () => (
  <>
    <Header />
    <Navbar />
    <Routes>
      <Route path="/*" element={<RouterView />} />
    </Routes>
    <Footer />
  </>
);

const RouterUser = () => (
  <>
    <Header />
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}>
        <NavBarUser />
      </Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<UserRouter />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

const AdminLayout = () => (
  <>
    {" "}
    <Header />
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}>
        <NavBarAdmin />
      </Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<RouterAdmin />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

export default App;
