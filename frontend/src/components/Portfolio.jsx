import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { useNavigateLogin, useGetMarkets, useFetchUser } from "../utility/CustomHooks";

const imgStyle = {
	width: '100%',
	height: 'auto',
}

const headerStyle = {
	fontSize: 48,
	fontWeight: 'regular',

}

/**
 * @author Michael Maganini
 * @returns My Portfolio page
 */
const Portfolio = () => {
	//states
	const [user, setUser] = useState(null);
	const [access_token, setAccess_token] = useState("");
	const [totalValue, setTotalValue] = useState(0);
	const [infoToDisplay, setInfoToDisplay] = useState(null);
	//hooks
	useNavigateLogin()
	var data = useGetMarkets();
	var fetchInfo = useFetchUser(true)
	useEffect(() => {
		if(fetchInfo === null) return;
		if(user === null) setUser(fetchInfo.user);
		if(access_token === "") setAccess_token(fetchInfo.access_token);
	},[fetchInfo]);	
	//calculates total portfolio value and individual crypto values and details
	useEffect(() => {
		if (user === null || data === null) return;
		var output = getPortfolioValues(user.crypto_in_portfolio, data)
		setInfoToDisplay(output.infoToDisplay)
		setTotalValue(output.totalValue)
	}, [user, data]);
	//variables
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	const rows = infoToDisplay === null ? null :
		Array.from(infoToDisplay
			.sort((a, b) => parseFloat(b.dollarValue) - parseFloat(a.dollarValue)))
			.map((infoToDisplayIdx) => createData(infoToDisplayIdx.name, infoToDisplayIdx.symbol,
				infoToDisplayIdx.quantity, infoToDisplayIdx.dollarValue, infoToDisplayIdx.price, infoToDisplayIdx.slug))

	return (
		<Card sx={{ boxShadow: 10, margin: 5 }} >
			<Stack
				direction="column"
				justifyContent='center'
				alignItems="center"
				margin='25px'
			>
				<Box sx={headerStyle}>My Portfolio</Box>
				<TableContainer component={Paper} >
					<Table sx={{ minWidth: 960 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Name (Symbol)</TableCell>
								<TableCell align="right">Quantity</TableCell>
								<TableCell align="right">Price&nbsp;($)</TableCell>
								<TableCell align="right">Dollar Value&nbsp;($)</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{infoToDisplay === null ? "" :
								rows.map((row) => {
									return getTableRow(row)
								})}
							{infoToDisplay === null ? "" :
								<TableRow
									key={"totalValue"}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell />
									<TableCell component="th" scope="row" />
									<TableCell align="right" />
									<TableCell align="right" />
									<TableCell align="right">Portfolio Value = {formatter.format(totalValue)}</TableCell>
								</TableRow>
							}
						</TableBody>
					</Table>
				</TableContainer>
			</Stack>
		</Card>
	);
}

function getTableRow(row) {
	var imgSource = "images/cryptocurrency/" + row.slug + ".png"
	return (
		<TableRow
			key={row.nameAndSymbol}
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
		>
			<TableCell>
				<Box sx={{ width: '32px' }}>
					<img src={imgSource} alt="" style={imgStyle} />
				</Box>
			</TableCell>
			<TableCell component="th" scope="row">
				{row.nameAndSymbol}
			</TableCell>
			<TableCell align="right">{row.quantity}</TableCell>
			<TableCell align="right">{row.price}</TableCell>
			<TableCell align="right">{row.dollarValue}</TableCell>
		</TableRow>
	)
}

function createData(name, symbol, quantity, dollarValue, price, slug) {
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	const displayPrice = formatter.format(price)
	const displayDollarValue = formatter.format(dollarValue)
	const displayNameAndSymbol = name + " (" + symbol + ")";

	return {
		nameAndSymbol: displayNameAndSymbol,
		quantity: quantity,
		dollarValue: displayDollarValue,
		price: displayPrice,
		slug: slug
	};
}


function getPortfolioValues(cryptos, marketData) {
	var totalValue = 0;
	var infoToDisplay = [];
	var infoToDisplayIdx;
	var dollarValue;
	var k = 0;

	for (let i = 0; i < marketData.length; i++) {
		for (let j = 0; j < cryptos.length; j++) {
			if (cryptos[j].slug === marketData[i].slug && parseFloat(cryptos[j].quantity) !== 0) {
				dollarValue = parseFloat(cryptos[j].quantity) * parseFloat(marketData[i].price)
				infoToDisplayIdx = {
					name: marketData[i].name,
					symbol: marketData[i].symbol,
					price: marketData[i].price,
					slug: marketData[i].slug,
					quantity: cryptos[j].quantity,
					dollarValue: dollarValue
				}
				infoToDisplay[k] = infoToDisplayIdx
				totalValue += dollarValue;
				k++;
			}
		}
	}

	return {infoToDisplay, totalValue}
}
export default Portfolio;