import { Box } from '@mui/material';
import React from 'react';

/**
 * @author Michael Maganini
 * @returns Footer at the bottom of every page
 */
const Footer = () => {
	return (
		<Box
			bgcolor="#1B1B3A"
			px={{ xs: 1, sm: 1 }}
			py={{ xs: 1, sm: 1 }}
			sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
		>
			<Box sx={{ my: 2, color: 'white', display: 'block' }}>
				© 2022 Copyright: Michael Maganini
			</Box>
		</Box>/*container for footer creates dark theme*/
	);

}

export default Footer;