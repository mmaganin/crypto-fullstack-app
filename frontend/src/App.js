import ResponsiveAppBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import Account from "./components/Account";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Portfolio from "./components/Portfolio";
import CryptoPrices from "./components/CryptoPrices";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Stack, Box } from '@mui/material';

const sideBarStyle = {
  // maxWidth: '500px',
  // minWidth: '250px',
  minWidth: "192px"
}

function App() {
  return (
    <div>
      <div style={{ minHeight: "880px" }}>
        <Router>
          <ResponsiveAppBar />
          < Stack direction={"row"} justifyContent="space-between">
            <Box sx={sideBarStyle} />{/*right sidebar*/}
            <Routes>
              <Route exact path="/" element={<Welcome />} />
              <Route path="/account" element={<Account />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/markets" element={<CryptoPrices />} />
              <Route path="/portfolio" element={<Portfolio />} />
            </Routes>
            <Box sx={sideBarStyle}/>{/*left sidebar*/}
          </Stack>{/*puts sidebars and routes in row*/}
        </Router>
      </div>{/*puts footer at bottom of page*/}
      <Footer />
    </div>
  );
}

export default App;
