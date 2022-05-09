import React, { useEffect, useState, useRef } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Stack, Grid, TextField, Divider } from '@mui/material'
import { useNavigate } from "react-router-dom";
import ClickAwayListener from '@mui/base/ClickAwayListener';

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
	var textFieldHelper = "";

	const [buyClicked, setBuyClicked] = useState(false);
	const [sellClicked, setSellClicked] = useState(false);
	const [textFieldContent, setTextFieldContent] = useState("");
	const navigate = useNavigate()


	function checkLoggedIn() {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token === null) {
			navigate("/login")
		}
	}
	function clickBuyButton() {
		checkLoggedIn()
		if (textFieldContent !== "" && !isNaN(+textFieldContent)) {
			submitBuyOrSell(true)
		}
		setSellClicked(false)
		setBuyClicked(true)
	}
	function clickSellButton() {
		checkLoggedIn()
		if (textFieldContent !== "" && !isNaN(+textFieldContent)) {
			submitBuyOrSell(false)
		}
		setSellClicked(true)
		setBuyClicked(false)

	}
	function clickAway() {
		if (textFieldContent === "") {
			setSellClicked(false)
			setBuyClicked(false)
		}

	}
	function handleTextField(event) {
		setTextFieldContent(event.target.value)
	}
	function submitBuyOrSell(isBuy) {
		if (isBuy) {
			window.alert("You have bought " + textFieldContent + " " + dataIdx.name + "!")
		} else {
			window.alert("You have sold " + textFieldContent + " " + dataIdx.name + "!")
		}
		setTextFieldContent("")
		setSellClicked(false)
		setBuyClicked(false)
	}


	if (buyClicked) {
		textFieldLabel = "Enter Quantity to Buy"
		textFieldHelper = "Then Click Buy to Place Order"
	} else if (sellClicked) {
		textFieldLabel = "Enter Quantity to Sell"
		textFieldHelper = "Then Click Sell to Place Order"
	}
	if (isNaN(+textFieldContent)) {
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

						<Button size="small" onClick={() => clickBuyButton(dataIdx.slug)}>Buy</Button>

						<Button size="small" onClick={() => clickSellButton(dataIdx.slug)}>Sell</Button>
						{/* <div
						onBlur={() => clickAway()}
					> */}
						{buyClicked ?
							<TextField
								id="standard-helperText"
								label={textFieldLabel}
								defaultValue={textFieldContent}
								helperText={textFieldHelper}
								variant="standard"
								onChange={(event) => handleTextField(event)}
							/> : ""}
						{sellClicked ?
							<TextField
								id="standard-helperText"
								label={textFieldLabel}
								defaultValue={textFieldContent}
								helperText={textFieldHelper}
								variant="standard"
								onChange={(event) => handleTextField(event)}
							/> : ""}
						{/* </div> */}
					</CardActions>
				</ClickAwayListener>

			</Card>

		</Grid >
	)
}


export default CryptoCard;