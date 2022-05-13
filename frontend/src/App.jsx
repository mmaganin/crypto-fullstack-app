import ResponsiveAppBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import Account from "./components/Account";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Portfolio from "./components/Portfolio";
import CryptoPrices from "./components/CryptoPrices";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from '@mui/material';

const sideBarStyle = {
    minWidth: "192px"
}

const globalStyle = {
    minHeight: "980px",
    bgcolor: '#888898'
}

/**
 * Function that generates the pages that are displayed
 * @returns page Router with ResponsiveAppBar navbar and a Footer
 */
function App() {
    return (
        <div>
            <Box sx={globalStyle}>
                <Router>
                    <ResponsiveAppBar />
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Box sx={sideBarStyle} />{/*right sidebar*/}
                        <Routes>
                            <Route exact path="/" element={<Welcome />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/createaccount" element={<CreateAccount />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/markets" element={<CryptoPrices />} />
                            <Route path="/portfolio" element={<Portfolio />} />
                        </Routes>
                        <Box sx={sideBarStyle} />{/*left sidebar*/}
                    </Box>{/*puts sidebars and routes in row*/}
                </Router>
            </Box>{/*container for router, minHeight puts footer at bottom of page*/}
            <Footer />
        </div>
    );
}

export default App;