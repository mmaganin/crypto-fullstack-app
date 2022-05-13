import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
	//STATES
	const [user, setUser] = useState(null);
	const [access_token, setAccess_token] = useState("");
	//total dollar value of portfolio
	const [totalValue, setTotalValue] = useState(0);
	const [infoToDisplay, setInfoToDisplay] = useState(null);
	//HOOKS
	useNavigateLogin()
	var data = useGetMarkets();
	var fetchInfo = useFetchUser(true)
	//assigns state values after user fetched successfully
	useEffect(() => {
		if (fetchInfo === null) return;
		if (user === null) setUser(fetchInfo.user);
		if (access_token === "") setAccess_token(fetchInfo.access_token);
	}, [fetchInfo, user, access_token]);
	//calculates total portfolio value and individual crypto values and details
	useEffect(() => {
		if (user === null || data === null) return;
		var output = getPortfolioValues(user.crypto_in_portfolio, data)
		setInfoToDisplay(output.infoToDisplay)
		setTotalValue(output.totalValue)
	}, [user, data]);
	//VARIABLES
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	//puts portfolio data into a rows array to be mapped into the Table
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
						</TableHead>{/*contains the title of each column in table*/}
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
						</TableBody>{/*Rows of the table with total portfolio value as last row*/}
					</Table>{/*table containing user portfolio and market data*/}
				</TableContainer>{/*container for the Table*/}
			</Stack>{/*container that Stacks and aligns the Title and the Table*/}
		</Card>/*Card element container for Portfolio Page with shadow*/
	);
}
/**
 * creates TableRow element representing one row of the Table element
 * @param {{nameAndSymbol: String, 
 * 		quantity: Number, 
 * 		dollarValue: String, 
 * 		price: String, 
 * 		slug: Strong}} row 
 * @returns TableRow HTML for one row of the Table
 */
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
		</TableRow>/*Single row of the Table*/
	)
}
/**
 * creates object that can be injected into a TableRow
 * @param {String} name 
 * @param {String} symbol 
 * @param {Number} quantity 
 * @param {String} dollarValue 
 * @param {String} price 
 * @param {String} slug 
 * @returns Object with data to insert into a table row
 */
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
/**
 * generates an array with indices containing objects with data corresponding to cryptos that the user has >0 quantity, 
 * and calculates total value of portfolio
 * @param {Array<{id: Number, slug: String, quantity, Float}>} cryptos 
 * @param {Array<{circulating_supply: string, cmc_rank: string, last_updated: string, market_cap: string, 
 * 		name: string, percent_change_1h: string, percent_change_7d: string, percent_change_24h: string, 
 * 		percent_change_30d: string, price: string, slug: string, symbol: string, total_supply: string}>} marketData 
 * @returns infoToDisplay: array of crypto data of cryptos in portfolio, totalValue: total $ value of portfolio
 */
function getPortfolioValues(cryptos, marketData) {
	var totalValue = 0;
	var infoToDisplay = [];
	var infoToDisplayIdx;
	//total dollar value of individual cryptos in portfolio
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
	return { infoToDisplay, totalValue }
}
export default Portfolio;