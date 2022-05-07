import ResponsiveAppBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import Account from "./components/Account";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Jumbotron from "./components/Jumbotron";
import Portfolio from "./components/Portfolio";
import CryptoPrices from "./components/CryptoPrices";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
      <div style={{ minHeight: "880px" }}>
        <Router>
          <ResponsiveAppBar />
          <Routes>
            <Route exact path="/" element={<Welcome />} />
            <Route path="/account" element={<Account />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/markets" element={<CryptoPrices />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Router>
      </div>
      <Footer />

    </div>
  );
}

export default App;
