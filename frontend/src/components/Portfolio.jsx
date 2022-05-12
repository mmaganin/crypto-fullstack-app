import { ContentPasteOffSharp } from '@mui/icons-material';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchRefreshLoad, accessTokenLoad } from "./Account";
import { marketsLoad } from "./CryptoPrices";

const sideBarStyle = {
	width: '196px',
}
const imgStyle = {
	width: '100%',
	height: 'auto',
}

const headerStyle = {
	fontSize: 48,
	fontWeight: 'regular',

}

const Portfolio = () => {
	let navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [access_token, setAccess_token] = useState("");
	const [userFetched, setUserFetched] = useState(false);
	const [data, setData] = useState(null);
	const [fetchData, setFetch] = useState(true);
	const [totalValue, setTotalValue] = useState(0);
	const [infoToDisplay, setInfoToDisplay] = useState(null);

	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	useEffect(() => {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token === null) {
			navigate("/login")
		}
	}, []);

	useEffect(() => {
		if (!fetchData) return;
		const fetchLoad = marketsLoad();

		fetch(fetchLoad.fetchFrom, fetchLoad.payload)
			.then(response => response.json())
			.then(data => setData(data))

	}, [fetchData]);

	//fetches access token from refresh token in local storage
	useEffect(() => {
		const refreshLoad = fetchRefreshLoad();
		if (refreshLoad.payload === "must login") {
			navigate("/login");
			return;
		}

		fetch(refreshLoad.fetchFrom, refreshLoad.payload)
			.then(response => {
				if (!response.ok) throw new Error(response.status);
				else return response.json();
			})
			.then(tokens => {
				localStorage.setItem('refresh', tokens.refresh_token);
				setAccess_token(tokens.access_token)
				console.log("successful access token fetch: ")
			})
			.catch((error) => {
				setAccess_token("")
				console.log("Fetch failed: " + error)
				localStorage.removeItem('refresh')
				window.alert("You must login again!")
				navigate("/login")
			})
	}, []);

	//fetches a user's info (if valid access token fetched)
	useEffect(() => {
		if (userFetched || access_token === "" || access_token === "must login") return;
		const accessLoad = accessTokenLoad(access_token)

		fetch(accessLoad.fetchFrom, accessLoad.payload)
			.then(response => {
				if (!response.ok) throw new Error(response.status);
				else return response.json();
			})
			.then(user => {
				console.log("successful user info fetch: ")
				setUserFetched(true)
				setUser(user)
			})
			.catch((error) => {
				console.log("User Fetch failed: " + error)
			})

	}, [access_token]);

	//calculates total portfolio value
	useEffect(() => {
		if (user === null || data === null) return;
		var output = getPortfolioValues(user.crypto_in_portfolio, data)
		setInfoToDisplay(output[0])
		setTotalValue(output[1])

	}, [user, data]);

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

	return [infoToDisplay, totalValue]
}
export default Portfolio;