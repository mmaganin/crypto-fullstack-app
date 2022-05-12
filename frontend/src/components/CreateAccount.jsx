import { Box, TextField, Button, Stack, Card } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const titleStyle = {
	fontSize: 32,
	fontWeight: 'light'
}

const cardStyle = { 
	boxShadow: 10, 
	margin: 5 
}

const CreateAccount = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [createdUser, setCreatedUser] = useState(null)
	let navigate = useNavigate();

	useEffect(() => {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token !== null) {
			navigate("/account")
		}
	}, []);

	useEffect(() => {
		if (createdUser === null) return;

		console.log(createdUser)
		const fetchFrom = 'http://localhost:8080/login?username=' + username + '&password=' + password
		const payload = {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
		}
		fetch(fetchFrom, payload)
			.then(response => {
				if (!response.ok) throw new Error(response.status);
				else return response.json();
			})
			.then(tokens => {
				localStorage.setItem('refresh', tokens.refresh_token)
				window.alert("Account creation Successful! You have been logged in.")
				console.log("Create account and login success!")

				navigate("/account")
			})
			.catch((error) => {
				console.log("Create account login Fetch failed: " + error)
			})
	}, [createdUser]);


	function handleUsername(e) {
		setUsername(e.target.value)
	}
	function handlePassword(e) {
		setPassword(e.target.value)
	}

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