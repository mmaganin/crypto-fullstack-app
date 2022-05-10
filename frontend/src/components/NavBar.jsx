import * as React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";

import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const pages = ['Cryptocurrency Markets', 'My Portfolio'];

const linkStyle = {
  textDecoration: "none",
  color: 'black'
};
const accountLinkStyle = {
  textDecoration: "none",
  color: 'white'
};

const imgStyle = {
  width: '100%',
  height: 'auto',
}
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    localStorage.removeItem('refresh');
    window.location.reload();
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              <Tooltip title="Navigate to Homepage">
                <Box sx={{ width: '65px' }}>
                  <Link to="/" >
                    <img src="images/other/nav-bar-logo.jpg" alt="" style={imgStyle} />
                  </Link>
                </Box>
              </Tooltip>

            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link to={page === "Cryptocurrency Markets" ? "/markets" : "/portfolio"} style={linkStyle}>
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
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
                    <Link to="/createaccount" style={accountLinkStyle}>
                      <MenuItem key="Create Account" onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Create Account</Typography>
                      </MenuItem>
                    </Link>

                    <Link to="/login" style={accountLinkStyle}>
                      <MenuItem key="Login" onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Sign in</Typography>
                      </MenuItem>
                    </Link>
                  </div>
                  :
                  <div>
                    <Link to="/account" style={accountLinkStyle}>
                      <MenuItem key="Account Info" onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Account Info</Typography>
                      </MenuItem>
                    </Link>

                    <MenuItem key="Logout" onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </div>
                }


              </Menu>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider >
  );
};
export default ResponsiveAppBar;