import React, { useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Stack, Grid, TextField } from '@mui/material'

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
	const imageSrc = "images/" + dataIdx.slug + ".png"
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	const price = formatter.format(dataIdx.price)
	const market_cap = formatter.format(dataIdx.market_cap)

	const [buyClicked, setBuyClicked] = useState(false);
	const [sellClicked, setSellClicked] = useState(false);
	const [textFieldContent, setTextFieldContent] = useState("");

	function clickBuyButton() {
		setSellClicked(false)
		setBuyClicked(true)
		if (textFieldContent !== "") {
			submitBuyOrSell()
		}
	}
	function clickSellButton() {
		setSellClicked(true)
		setBuyClicked(false)
		if (textFieldContent !== "") {
			submitBuyOrSell()
		}
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
	function submitBuyOrSell() {
		window.alert("You have bought or sold crypto!")
		setTextFieldContent("")
		setSellClicked(false)
		setBuyClicked(false)
	}

	return (
		<Grid item>

			<Card sx={{ minWidth: 400 }}>
				<Stack direction="row" >
					<div style={{ width: '96px' }}>
						<img src={imageSrc} alt="" style={imgStyle} />
					</div>
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

				<CardActions>
					<div
						onFocus={() => clickBuyButton()}
					>
						<Button size="small">Buy</Button>
					</div>
					<div
						onFocus={() => clickSellButton()}
					>
						<Button size="small">Sell</Button>
					</div>
					<div
						onBlur={() => clickAway()}
					>
						{buyClicked || sellClicked ?
							<TextField
								id="standard-helperText"
								label="test"
								defaultValue=""
								helperText="helper"
								variant="standard"
								onChange={(event) => handleTextField(event)}
							/> : ""}
					</div>
				</CardActions>
			</Card>

		</Grid >
	)
}

export default CryptoCard;