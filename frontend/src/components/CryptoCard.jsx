import React, { useEffect, useState, useRef } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Stack, Grid, TextField, Divider } from '@mui/material'
import { useNavigate } from "react-router-dom";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { editAccount, authLoad, fetchRefreshLoad, accessTokenLoad } from "./Account";

const sideBarStyle = {
	maxWidth: '500px',
	minWidth: '250px',
	backgroundColor: 'white',

}
const imgStyle = {
	width: '100%',
	height: 'auto',
}

const CryptoCard = (dataIdx) => {
	const imageSrc = "images/cryptocurrency/" + dataIdx.slug + ".png"
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	const price = formatter.format(dataIdx.price)
	const market_cap = formatter.format(dataIdx.market_cap)
	var textFieldLabel = "";
	var textFieldHelper = "Then Enter Your Password";
	const [buyClicked, setBuyClicked] = useState(false);
	const [sellClicked, setSellClicked] = useState(false);
	const [passwordFieldContent, setPasswordFieldContent] = useState("");
	const [quantityFieldContent, setQuantityFieldContent] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [user, setUser] = useState(null);
	const [access_token, setAccess_token] = useState("");
	const [userFetched, setUserFetched] = useState(false);

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthError, setIsAuthError] = useState(false);
	const [password, setPassword] = useState("");

	const navigate = useNavigate()

	// console.log(username)
	// console.log(access_token)
	//console.log(username)


	//fetches access token from refresh token in local storage
	function getAccessToken() {
		const refreshLoad = fetchRefreshLoad();
		if (refreshLoad.payload === "must login") return;

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
			})
	}

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

	//authenticates the user before submitting order
	useEffect(() => {
		if(user === null) return;


		const load = authLoad(user.username, password)
		fetch(load.fetchFrom, load.payload)
			.then(response => {
				if (!response.ok) throw new Error(response.status);
				else {
					return response.json();
				}
			})
			.then(loginTokens => {
				localStorage.setItem('refresh', loginTokens.refresh_token)
				console.log("SUCCESSFUL AUTHENTICATION")
				//window.alert("Authentication Successful!")
				setIsAuthenticated(true)
				setIsAuthError(false)
			})
			.catch((error) => {
				console.log("Fetch failed: " + error)
				window.alert("Your password is incorrect!")
				setIsAuthenticated(false)
				setIsAuthError(true)
			})
	}, [user]);

	//adds crypto to user portfolio
	useEffect(() => {
		if (password === "" || isAuthError || !isAuthenticated) return;

		var userInfo = {
			username: user.username,
			password: password,
			crypto_to_add: {
				id: 0,
				slug: dataIdx.slug,
				quantity: quantity
			}
		}

		setPasswordFieldContent("")
		setQuantityFieldContent("")
		editAccount(access_token, userInfo, "portfolio")
	}, [isAuthError, isAuthenticated]);


	function checkLoggedIn() {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token === null) {
			navigate("/login")
			return;
		}
	}
	function clickBuyButton() {
		checkLoggedIn()
		if (quantityFieldContent !== "" && !isNaN(+quantityFieldContent)) {
			if (buyClicked) {
				submitBuyOrSell(true)
			} else {
				setPasswordFieldContent("")
				setQuantityFieldContent("")
			}
		}
		setSellClicked(false)
		setBuyClicked(true)
	}
	function clickSellButton() {
		checkLoggedIn()
		if (quantityFieldContent !== "" && !isNaN(+quantityFieldContent)) {
			if (sellClicked) {
				submitBuyOrSell(false)
			} else {
				setPasswordFieldContent("")
				setQuantityFieldContent("")
			}
		}
		setSellClicked(true)
		setBuyClicked(false)

	}
	function clickAway() {
		if (quantityFieldContent === "") {
			setSellClicked(false)
			setBuyClicked(false)
		}

	}
	function handleQuantityField(event) {
		setQuantityFieldContent(event.target.value)
	}
	function handlePasswordField(event) {
		setPasswordFieldContent(event.target.value)
	}
	function submitBuyOrSell(isBuy) {
		if (isBuy) {
			setQuantity(parseInt(quantityFieldContent))
			setPassword(passwordFieldContent)
		} else {
			setQuantity(parseInt(quantityFieldContent) * -1)
			setPassword(passwordFieldContent)
		}
		console.log(quantity)
		console.log(password)
		getAccessToken();
		setSellClicked(false)
		setBuyClicked(false)
	}

	function displayPasswordField() {
		return (
			<TextField
				id="standard-helperText"
				label="Enter Your Password"
				helperText="Enter Before Submission"
				size="small"
				defaultValue=""
				variant="standard"
				type="password"
				onChange={(event) => handlePasswordField(event)}
			/>
		)
	}

	if (buyClicked) {
		textFieldLabel = "Enter Quantity to Buy"
	} else if (sellClicked) {
		textFieldLabel = "Enter Quantity to Sell"
	}
	if (isNaN(+quantityFieldContent)) {
		textFieldLabel = "Please Enter Numbers Only"
	}
	return (

		<Grid item xs="auto">

			<Card sx={{ minWidth: 400, boxShadow: 10 }}>
				<Stack direction="row" justifyContent="center" alignItems="center">
					<Box sx={{ width: '96px' }}>
						<img src={imageSrc} alt="" style={imgStyle} />
					</Box>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{dataIdx.name} ({dataIdx.symbol})
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Price: {price}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Market Cap: {market_cap}
						</Typography>
					</CardContent>
				</Stack>
				<Divider />
				<ClickAwayListener onClickAway={clickAway}>

					<CardActions>

						<Button size="small" onClick={() => clickBuyButton()}>Buy</Button>

						<Button size="small" onClick={() => clickSellButton()}>Sell</Button>

						{buyClicked ?
							<Stack direction="column" justifyContent='center' alignItems="center" alignContent="center">
								<TextField
									id="standard-helperText"
									label={textFieldLabel}
									size="small"
									defaultValue={quantityFieldContent}
									helperText={textFieldHelper}
									variant="standard"
									onChange={(event) => handleQuantityField(event)}
								/>
								{displayPasswordField()}
							</Stack> : ""}
						{sellClicked ?
							<Stack direction="column" justifyContent='center' alignItems="center" alignContent="center">
								<TextField
									id="standard-helperText"
									label={textFieldLabel}
									size="small"
									defaultValue={quantityFieldContent}
									helperText={textFieldHelper}
									variant="standard"
									onChange={(event) => handleQuantityField(event)}
								/>
								{displayPasswordField()}
							</Stack> : ""}
					</CardActions>
				</ClickAwayListener>

			</Card>

		</Grid >
	)
}


export default CryptoCard;