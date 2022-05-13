import React from 'react'
import {  Stack, Grid, Paper } from '@mui/material'
import CryptoCard from "./CryptoCard";
import { useGetMarkets } from "../utility/CustomHooks";

const titleStyle = {
	fontSize: 48,
	fontWeight: 'regular',
	padding: 2,
}

/**
 * @author Michael Maganini
 * @returns Trading Desk page 
 */
const Welcome = () => {
	var data = useGetMarkets();
	return (
		<Stack
			direction="column"
			justifyContent='center'
			alignItems="center"
			sx={{ margin: 3 }}>
			<Paper elevation={5} sx={titleStyle}>
				Trading Desk
			</Paper>
			<Grid container
				spacing={2}
				direction="row"
				justifyContent="center"
				alignItems="center"
				sx={{ margin: 3 }}
			>
				{data === null ? "loading" : data
					.sort((a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap))
					.map((dataIdx) => <CryptoCard key={dataIdx.slug} {...dataIdx} />)}
			</Grid>{/*Grid that maps out CryptoCards containing functionality to Buy/Sell*/}
		</Stack>/*container that Stacks Title of the page and the Grid of Cards*/
	);
}

export default Welcome;