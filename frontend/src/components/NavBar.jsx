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
                <div style={{ width: '65px' }}>
                  <Link to="/" >
                    <img src="images/nav-bar-logo2.jpg" alt="" style={imgStyle} />
                  </Link>
                </div>
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
              <Tooltip title="Navigate to Account page">
                <Link to="/account" style={linkStyle}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <AccountCircle />
                  </IconButton>
                </Link>
              </Tooltip>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider >
  );
};
export default ResponsiveAppBar;