import { BrowserRouter as Router, Routes, Route, redirect, Navigate } from "react-router-dom";

import Home from "./home/page";
import Login from "./auth/login";


import Register from "./customer/register";
import Ground from "./dashboard/ground/ground";
import Booking from "./dashboard/booking/booking";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route path="" element={<Home />} />
          <Route path="admin/dashboard">
            <Route path="" element={<Navigate to="ground" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="ground" element={<Ground />} />
            <Route path="booking" element={<Booking />} />
          </Route>
          <Route path="customer">
            <Route path="register" element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
