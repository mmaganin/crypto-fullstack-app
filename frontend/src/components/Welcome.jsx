import React, { useEffect, useState, useNavigate } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Stack, Grid, Divider } from '@mui/material'
import CryptoCard from "./CryptoCard";
import { fetchRefreshLoad, accessTokenLoad } from "./Account";
import { marketsLoad } from "./CryptoPrices";


const sideBarStyle = {
	maxWidth: '500px',
	minWidth: '250px',

}
const imgStyle = {
	width: '100%',
	height: 'auto',
}

const Welcome = () => {
	const [data, setData] = useState(null);
	const [fetchData, setFetch] = useState(true);



	//let navigate = useNavigate();

	//mounts market data
	useEffect(() => {
		if (!fetchData) return;
		const fetchLoad = marketsLoad();

		fetch(fetchLoad.fetchFrom, fetchLoad.payload)
			.then(response => response.json())
			.then(data => setData(data))

	}, [fetchData]);




	return (
		<Stack direction="row" >
			<Box sx={sideBarStyle} />
			<Grid container
				spacing={2}
				direction="row"
				justifyContent="center"
				alignItems="center" >
				{data === null ? "loading" : data
					.sort((a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap))
					.map((dataIdx) => <CryptoCard {...dataIdx}/>)}
			</Grid>
			<Box sx={sideBarStyle} />
		</Stack>
	);
}



export default Welcome;