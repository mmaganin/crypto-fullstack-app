import React, { useState } from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem } from '@mui/material';

const imgStyle = {
    width: '100%',
    height: 'auto',
}

const pages = ['Cryptocurrency Markets', 'My Portfolio'];
/**
 * @author Michael Maganini
 * @returns Nav Bar at top of page with links to other pages
 */
const ResponsiveAppBar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate()
    //opens account settings menu, right side of navbar
    function handleOpenUserMenu(event) {
        setAnchorElUser(event.currentTarget);
    };
    //navigates to markets or portfolio pages by clicking options on left side of navbar
    function handleRedirect(page) {
        if (page === 'Cryptocurrency Markets') {
            navigate('/markets')
        } else {
            navigate('/portfolio')
        }
    };
    //navigates to trading homepage by clicking site logo
    function handleNavHome() {
        navigate('/')
    }
    //navigates to markets or portfolio pages by clicking options on left side of navbar
    function handleCloseUserMenu(navLocation) {
        setAnchorElUser(null);
        navigate(navLocation)
    };
    //logs out by removing refresh JWT token from localStorage, in account settings menu
    function handleLogout() {
        setAnchorElUser(null);
        localStorage.removeItem('refresh');
        window.location.reload();
    };

    return (
        <AppBar position="static" sx={{ bgcolor: "#1B1B3A" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Tooltip title="Navigate to Homepage">
                        <Button
                            onClick={handleNavHome}
                            sx={{ width: '80px' }}
                        >
                            <img src="images/other/nav-bar-logo.jpg" alt="" style={imgStyle} />
                        </Button>
                    </Tooltip>{/*contains site logo that navigates to trading homepage, provides tip popup*/}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => handleRedirect(page)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>/*navigates to either markets or portfolio pages upon click*/
                        ))}
                    </Box>{/*contains navigation options left side of navbar, right side of image*/}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Account Settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, bgcolor: 'white' }}>
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>{/*Profile IconButton that drops down menu for account settings pages*/}
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {localStorage.getItem('refresh') === null ?
                                <div>
                                    <MenuItem key="Create Account" onClick={() => handleCloseUserMenu("/createaccount")}>
                                        <Typography textAlign="center">Create Account</Typography>
                                    </MenuItem>
                                    <MenuItem key="Login" onClick={() => handleCloseUserMenu("/login")}>
                                        <Typography textAlign="center">Sign in</Typography>
                                    </MenuItem>
                                </div>/*displayed if user is logged out*/
                                :
                                <div>
                                    <MenuItem key="Account Info" onClick={() => handleCloseUserMenu("/account")}>
                                        <Typography textAlign="center">Account Info</Typography>
                                    </MenuItem>
                                    <MenuItem key="Logout" onClick={handleLogout}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </div>/*displayed if user is logged in*/
                            }
                        </Menu>{/*dropdown menu of options displayed when IconButton clicked, options navigate to account settings pages*/}
                    </Box>{/*contains elements providing functionality to IconButton on right side of navbar*/}
                </Toolbar>{/*contains navbar elements and provides Toolbar functionality*/}
            </Container>{/*contains navbar elements and sets a size*/}
        </AppBar> /*navbar at top of every page, contains navbar elements*/
    );
};
export default ResponsiveAppBar;