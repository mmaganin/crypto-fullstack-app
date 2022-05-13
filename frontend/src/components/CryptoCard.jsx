import React, { useState } from 'react'
import { Card, CardActions, CardContent, Button, Typography, Box, Stack, Grid, TextField, Divider } from '@mui/material'
import { useNavigate } from "react-router-dom";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useEditAccount, useFetchUser, useAuthenticate } from "../utility/CustomHooks";

const imgStyle = {
	width: '100%',
	height: 'auto',
}

/**
 * @author Michael Maganini
 * @param {{circulating_supply: string, cmc_rank: string, last_updated: string, market_cap: string, 
 * 		name: string, percent_change_1h: string, percent_change_7d: string, percent_change_24h: string, 
 * 		percent_change_30d: string, price: string, slug: string, symbol: string, total_supply: string}} dataIdx 
 * @returns Single crypto card on trading homepage
 */

const CryptoCard = (dataIdx) => {
	//VARIABLES
	const imageSrc = "images/cryptocurrency/" + dataIdx.slug + ".png"
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	const price = formatter.format(dataIdx.price)
	const market_cap = formatter.format(dataIdx.market_cap)
	var textFieldLabel = "";
	var textFieldHelper = "Then Enter Your Password";
	//STATES
	const [buyClicked, setBuyClicked] = useState(false);
	const [sellClicked, setSellClicked] = useState(false);
	const [passwordFieldContent, setPasswordFieldContent] = useState("");
	const [quantityFieldContent, setQuantityFieldContent] = useState("");
	//parsed float of quantityFieldContent when submitting order
	const [quantity, setQuantity] = useState(0);
	//allows hook to fetch user data when true
	const [canFetchUser, setCanFetchUser] = useState(false);
	//set equal to passwordFieldContent when submitting order
	const [password, setPassword] = useState("");
	//HOOKS
	const navigate = useNavigate()
	//fetches user after submitting valid order
	var fetchInfo;
	fetchInfo = useFetchUser(canFetchUser);
	var user = fetchInfo.user
	var access_token = fetchInfo.access_token
	//authenticates the user before submitting order
	var { isAuthenticated } = useAuthenticate(user, password, true, false)
	//adds crypto to user portfolio
	var userInfo = {
		username: user === null ? "" : user.username,
		password: password,
		crypto_to_add: {
			id: 0,
			slug: dataIdx.slug,
			quantity: quantity
		}
	}
	useEditAccount(access_token, userInfo, password, isAuthenticated, "portfolio")
	//HANDLERS
	function submitOrder() {
		setCanFetchUser(true)
	}
	//navigates to log in page if buy or sell clicked and refresh token not in localStorage
	function checkLoggedIn() {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token === null) {
			navigate("/login")
			return;
		}
	}
	//opens forms and submits orders if form not empty
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
	//closes forms if clicked outside of card action area
	function clickAway() {
		if (quantityFieldContent === "") {
			setSellClicked(false)
			setBuyClicked(false)
		}
	}
	//handle changing state when typing in forms 
	function handleQuantityField(event) {
		setQuantityFieldContent(event.target.value)
	}
	function handlePasswordField(event) {
		setPasswordFieldContent(event.target.value)
	}
	//sets quantity and password to submit and submits order
	function submitBuyOrSell(isBuy) {
		if (isBuy) {
			setQuantity(parseFloat(quantityFieldContent))
			setPassword(passwordFieldContent)
		} else {
			setQuantity(parseFloat(quantityFieldContent) * -1)
			setPassword(passwordFieldContent)
		}
		submitOrder();
		setSellClicked(false)
		setBuyClicked(false)
	}
	function displayPasswordField() {
		return (
			<TextField
				id="helperText"
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
					</CardContent>{/*contains crypto info next to image*/}
				</Stack>{/*orients crypto info and image in row*/}
				<Divider />
				<ClickAwayListener onClickAway={clickAway}>
					<CardActions>
						<Button size="small" onClick={() => clickBuyButton()}>Buy</Button>
						<Button size="small" onClick={() => clickSellButton()}>Sell</Button>
						{buyClicked ?
							<Stack direction="column" justifyContent='center' alignItems="center" alignContent="center">
								<TextField
									id="standard"
									label={textFieldLabel}
									size="small"
									defaultValue={quantityFieldContent}
									helperText={textFieldHelper}
									variant="standard"
									onChange={(event) => handleQuantityField(event)}
								/>
								{displayPasswordField()}
							</Stack> : ""}{/*if Buy clicked: stacks quantity and password forms*/}
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
							</Stack> : ""}{/*if Sell clicked: stacks quantity and password forms*/}
					</CardActions>{/*contains Buy/Sell buttons, password and quantity forms for orders, below divider on card*/}
				</ClickAwayListener>{/*container, clicking outside of CardActions below divider closes forms*/}
			</Card>{/*card containing info on a cryptocurrency*/}
		</Grid >/*grid item containing single card on homepage*/
	)
}


export default CryptoCard;