import { Box, Container, Grid, Item, Typography } from '@mui/material';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const imgStyle = {
  width: '100%',
  height: 'auto',
}

/**
 * @author Michael Maganini
 * @returns Footer at the bottom of every page
 */
const Footer = () => {
	return (
		<Box
			color="black"
			bgcolor="#343434"
			px={{ xs: 1, sm: 1 }}
			py={{ xs: 1, sm: 1 }}
			sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
		>
			<Box sx={{ my: 2, color: 'white', display: 'block' }}>
				© 2022 Copyright: Michael Maganini
			</Box>
		</Box>
	);
}

export default Footer;