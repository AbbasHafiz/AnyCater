import React, { useMemo, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { SettingsProvider } from "./shared/context/SettingContext";

import Auth from "./user/pages/Auth";
import AdminDashboard from "./user/components/admin/AdminDashboard";
import UserDashboard from "./user/components/user/UserDashboard";
import OwnerDashboard from "./user/components/owner/OwnerDashboard";
import ProtectedRoute from "./user/components/ProtectedRoute";
import MainNavigation from "./shared/components/navigation/MainNavigation";
import useAuth from "./shared/hooks/useAuth";
import Unauthorized from "./user/components/Unauthorized";
import NotFound from "./shared/components/navigation/NotFound";
import Home from "./shared/components/navigation/Home";
const App = () => {
  const { isLoggedIn, role } = useAuth();

  let routes;

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route>
          <Route
            path="user-dashboard/*"
            element={
              isLoggedIn ? (
                <>
                  <UserDashboard />
                  <ProtectedRoute requiredRole="User" />
                </>
              ) : (
                <Unauthorized />
              )
            }
          />
          
          <Route
            path="owner-dashboard/*"
            element={
              isLoggedIn ? (
                <>
                  <OwnerDashboard />
                  <ProtectedRoute requiredRole="Owner" />
                </>
              ) : (
                <Unauthorized />
              )
            }
          />
          <Route
            path="admin-dashboard/*"
            element={
              isLoggedIn ? (
                <>
                  <AdminDashboard />
                  <ProtectedRoute requiredRole="Admin" />
                </>
              ) : (
                <Unauthorized />
              )
            }
          />
          {/* Add a wildcard route for unmatched routes */}
          {/* Add a route for the root path */}
          <Route path="*" element={<NotFound/>} />
          <Route path="/" element={<Home/>} />

          {/* Add a wildcard route for unmatched routes */}
          
        </Route>
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route path="/" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <SettingsProvider>
    <BrowserRouter>
      <MainNavigation />
      <main>{routes}</main>
    </BrowserRouter></SettingsProvider>
  );
};

export default App;
