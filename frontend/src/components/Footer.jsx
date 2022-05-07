import { Box, Container, Grid, Item, Typography } from '@mui/material';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const imgStyle = {
  width: '100%',
  height: 'auto',
}
const Footer = () => {
	return (
		<Box
			color="black"
			bgcolor="#343434"
			px={{ xs: 1, sm: 1 }}
			py={{ xs: 1, sm: 1 }}
			sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
		>
			{/* <div style={{ width: '65px' }}>
				<img src="images/nav-bar-logo2.jpg" alt="" style={imgStyle} />
			</div> */}
			<Box sx={{ my: 2, color: 'white', display: 'block' }}>
				© 2020 Copyright: Michael Maganini
			</Box>
			{/* <div style={{ width: '65px' }}>
				<img src="images/nav-bar-logo2.jpg" alt="" style={imgStyle} />
			</div> */}
		</Box>
	);
}

export default Footer;