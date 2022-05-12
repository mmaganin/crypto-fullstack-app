import { Box, TextField, Button, Stack, Card } from '@mui/material';
import React, { useState } from 'react'
import { useNavigateAccount, useAuthenticate } from "../utility/CustomHooks";

const titleStyle = {
	fontSize: 32,
	fontWeight: 'light'
}

const cardStyle = { 
	boxShadow: 10, 
	margin: 5 
}

/**
 * @author Michael Maganini
 * @returns create account page
 */
const CreateAccount = () => {
	//STATES
	//states that change when user types in forms
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	//changes when user is fetched
	const [createdUser, setCreatedUser] = useState(null)
	//changes when create account is clicked
	const [canAuthenticate, setCanAuthenticate] = useState(false);
	//HOOKS
	useNavigateAccount();
	useAuthenticate(createdUser === null ? "" : createdUser.username, password, canAuthenticate, true)
	//HANDLERS
	//handles changing state when user types in form
	function handleUsername(e) {
		setUsername(e.target.value)
	}
	function handlePassword(e) {
		setPassword(e.target.value)
	}
	//runs when user clicks create account 
	//POST request, saves new account in database if username doesnt already exist
	function handleSubmit() {
		const json = JSON.stringify({ username: username, password: password })
		const fetchFrom = 'http://localhost:8080/createaccount'
		const payload = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: json
		}
		fetch(fetchFrom, payload)
			.then(response => {
				if (!response.ok) throw new Error(response.status);
				else return response.json();
			})
			.then((userDetails) => {
				setCreatedUser(userDetails);
				setCanAuthenticate(true)
				console.log("Create account Fetch Success");
			})
			.catch((error) => {
				setCreatedUser(null);
				window.alert("User already exists!")
				console.log("Create account Fetch failed: " + error)
			})
	}

	return (
		<Card sx={cardStyle}>
			<Stack direction="column"
				width='400px'
				margin='25px'
				justifyContent='center'
				alignItems="center"
				alignContent="center"
				spacing={2}>
				<Box sx={titleStyle}>
					Create Account
				</Box>
				<TextField
					required
					id="outlined-required"
					fullWidth
					label="Username"
					defaultValue={username}
					onChange={(e) => handleUsername(e)}
				/>{/*username field*/}
				<TextField
					required
					id="outlined-password-input"
					fullWidth
					label="Password"
					type="password"
					defaultValue={password}
					onChange={(e) => handlePassword(e)}
				/>{/*password field*/}
				<Button variant="outlined" onClick={handleSubmit}>
					Create Account
				</Button>
			</Stack>{/*container that stacks create account card contents as column*/}
		</Card>/*card container with shadow*/
	);
}

export default CreateAccount;