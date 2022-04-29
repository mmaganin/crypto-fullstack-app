import ResponsiveAppBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import Account from "./components/Account";
import Jumbotron from "./components/Jumbotron";
import Portfolio from "./components/Portfolio";
import CryptoPrices from "./components/CryptoPrices";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      <Jumbotron />
      <ResponsiveAppBar />
      <Routes>
        <Route exact path="/" element={<Welcome />}  />
        <Route path="/account" element={<Account />}  />
        <Route path="/markets" element={<CryptoPrices />}  />
        <Route path="/portfolio" element={<Portfolio />}  />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
