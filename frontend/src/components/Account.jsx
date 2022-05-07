import { Box, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Account = () => {
	const [user, setUser] = useState(null);
	const [access_token, setAccess_token] = useState("");
	const [userFetched, setUserFetched] = useState(false);
	let navigate = useNavigate();

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
				window.alert("You must login again!")
				navigate("/login")
			})

	}, []);

	//fetches a user's info (if valid access token fetched)
	useEffect(() => {
		if (userFetched || access_token === "" || access_token === "must login") return;

		const fetchFrom = 'http://localhost:8080/account'
		const payload = {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + access_token
			}
		}
		fetch(fetchFrom, payload)
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




	var username = "";
	var password = "";
	if (user !== null) {
		username = user.username;
		password = user.password;
	}
	return (
		<div>
			<Box
				component="form"
				sx={{
					'& .MuiTextField-root': { m: 1, width: '25ch' },
				}}
				noValidate
				autoComplete="off"
			>



				<p>username: {username}</p>
				<p>password: {password}</p>


			</Box>
		</div>
	);
}

export function fetchRefreshLoad() {
	var refresh_token = localStorage.getItem('refresh');
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/tokens/refresh',
		payload: refresh_token === null ? "must login" : {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + refresh_token
			}
		}
	}
	return fetchLoad;
}

export default Account;