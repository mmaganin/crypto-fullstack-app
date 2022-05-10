import { Box, TextField, Button, Tooltip, IconButton, Stack, Grid, Divider, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { TextareaAutosize, ClickAwayListener } from '@mui/base';


const sideBarStyle = {
	maxWidth: '750px',
	minWidth: '500px',

}
const headerStyle = {
	fontSize: 48,
	fontWeight: 'regular',

}
const sectionStyle = {
	fontSize: 32,
	fontWeight: 'light'
}
const imgStyle = {
	width: '100%',
	height: 'auto',
}

const Account = () => {
	const [user, setUser] = useState(null);
	const [access_token, setAccess_token] = useState("");
	const [userFetched, setUserFetched] = useState(false);

	const [oldPassword, setOldPassword] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthError, setIsAuthError] = useState(false);

	const [password, setPassword] = useState("");
	const [age, setAge] = useState(-1);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [email, setEmail] = useState("");

	const [displayFormPassword, setDisplayFormPassword] = useState(false);
	const [displayFormAge, setDisplayFormAge] = useState(false);
	const [displayFormName, setDisplayFormName] = useState(false);
	const [displayFormBio, setDisplayFormBio] = useState(false);
	const [displayFormEmail, setDisplayFormEmail] = useState(false);


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
				setName(user.name)
				setEmail(user.email)
				setAge(user.age)
				setBio(user.bio)
			})
			.catch((error) => {
				console.log("User Fetch failed: " + error)
			})

	}, [access_token]);

	//runs after authentication complete
	useEffect(() => {
		if (oldPassword === "" || isAuthError || !isAuthenticated) return;

		var userInfo = {
			username: user.username,
			password: password === "" ? oldPassword : password,
			email: email,
			age: age,
			bio: bio,
			name: name
		}

		editAccount(access_token, userInfo, "account")

	}, [isAuthError, isAuthenticated]);

	function handleEdit(type) {
		if (type === "password") {
			displayForm("password")
		} else if (type === "name") {
			displayForm("name")
		} else if (type === "email") {
			displayForm("email")
		} else if (type === "age") {
			displayForm("age")
		} else if (type === "bio") {
			displayForm("bio")
		}
	}
	function displayForm(type) {
		closeDisplayForms()
		if (type === "password") {
			setDisplayFormPassword(true)
		} else if (type === "name") {
			setDisplayFormName(true)
		} else if (type === "email") {
			setDisplayFormEmail(true)
		} else if (type === "age") {
			setDisplayFormAge(true)
		} else if (type === "bio") {
			setDisplayFormBio(true)
		}
	}
	function closeDisplayForms() {
		setDisplayFormPassword(false)
		setDisplayFormAge(false)
		setDisplayFormName(false)
		setDisplayFormEmail(false)
		setDisplayFormBio(false)
	}
	function handleTextField(event, type) {
		if (type === "password") {
			setPassword(event.target.value)
		} else if (type === "oldPassword") {
			setOldPassword(event.target.value)
		} else if (type === "name") {
			setName(event.target.value)
		} else if (type === "email") {
			setEmail(event.target.value)
		} else if (type === "age") {
			setAge(event.target.value)
		} else if (type === "bio") {
			setBio(event.target.value)
		}
	}
	function handleClickAway() {
		closeDisplayForms()
		setPassword("");
		setOldPassword("");
		setName(user.name)
		setEmail(user.email)
		setAge(user.age)
		setBio(user.bio)
	}
	function authenticate() {
		const load = authLoad(user.username, oldPassword)
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
				window.alert("Your old password is incorrect!")
				setIsAuthenticated(false)
				setIsAuthError(true)
				handleClickAway();
			})
	}

	function handleSubmit() {
		closeDisplayForms()
		authenticate()


	}
	function displayFieldOrForm(type, field, displayForm) {
		const title = "Change " + type;
		const label = "Enter a new " + type;
		var displayField = field;
		if (type === "password") {
			displayField = "•••••"
		}

		if (!displayForm) {
			return (
				<>
					{displayField}
					<Tooltip title={title}>
						<IconButton onClick={() => handleEdit(type)} sx={{ p: 0 }}>
							<EditIcon />
						</IconButton>
					</Tooltip>
				</>)
		} else if (type === "bio") {
			return (
				<TextField
					multiline
					minRows={3}
					maxRows={10}
					label={label}
					defaultValue={field}
					style={{ width: 400 }}
					onChange={(event) => handleTextField(event, type)}
				/>
			)
		} else {
			return (
				<TextField
					id="standard-helperText"
					label={label}
					defaultValue={field}
					variant="outlined"
					onChange={(event) => handleTextField(event, type)}
				/>
			)
		}
	}

	var displayAge = age
	if (age === -1) {
		displayAge = ""
	}
	const displayOldPasswordField = displayFormAge || displayFormBio || displayFormEmail || displayFormName || displayFormPassword ?
		true : false
	return (
		< Stack direction="row" >
			<Box sx={sideBarStyle} />
			<ClickAwayListener onClickAway={handleClickAway}>
				<Grid container
					spacing={2}
					direction="column"
					justifyContent="space-evenly"
					alignContent="stretch"
				>
					<Divider flexItem />

					<Grid item xs>
						<Stack direction="row" alignItems="center" justifyContent='space-between'>
							<Box>
								<Box sx={headerStyle}>Credentials</Box>
								<Box sx={sectionStyle}>
									Username: {user === null ? "" : user.username}
								</Box>
								<Box sx={sectionStyle}>
									Password: {displayFieldOrForm("password", "", displayFormPassword)}
								</Box>
							</Box>
							<Box sx={{ width: '156px' }}>
								<img src="images/other/credentials.png" alt="" style={imgStyle} />
							</Box>
						</Stack>
					</Grid >
					<p></p>
					<Divider flexItem />

					<Grid item xs>
						<Stack direction="row" alignItems="center" justifyContent='space-between'>
							<Box>
								<Box sx={headerStyle}>Your Info</Box>
								<Box sx={sectionStyle}>
									Name: {displayFieldOrForm("name", name, displayFormName)}
								</Box>
								<Box sx={sectionStyle}>
									Email: {displayFieldOrForm("email", email, displayFormEmail)}
								</Box>
								<Box sx={sectionStyle}>
									Age: {displayFieldOrForm("age", displayAge, displayFormAge)}
								</Box>
							</Box>
							<Box sx={{ width: '156px' }}>
								<img src="images/other/info.png" alt="" style={imgStyle} />
							</Box>
						</Stack>
					</Grid>
					<p></p>
					<Divider flexItem />

					<Grid item xs>
						<Stack direction="row" alignItems="center" justifyContent='space-between'>
							<Box>
								<Box sx={headerStyle}>Bio</Box>
								<Box sx={{ fontSize: 16, fontWeight: 'light' }}>
									{displayFieldOrForm("bio", bio, displayFormBio)}
								</Box>
							</Box>
							<Box sx={{ width: '156px' }}>
								<img src="images/other/bio.png" alt="" style={imgStyle} />
							</Box>
						</Stack>
					</Grid>
					<p></p>
					<Divider flexItem />
					<p></p>


					{displayOldPasswordField ?

						<Stack direction="column" justifyContent='center' alignItems="center" alignContent="center">
							<TextField
								id="standard-helperText"
								label="Enter your current password."
								defaultValue=""
								variant="outlined"
								type="password"
								onChange={(event) => handleTextField(event, "oldPassword")}
							/>
							<Button size="small" onClick={() => handleSubmit()}>Submit Changes</Button>
						</Stack>
						:
						""
					}

				</Grid>
			</ClickAwayListener>
			<Box sx={sideBarStyle} />
		</Stack >
	);
}

export function editAccount(access_token, userInfo, editType) {
	if (access_token === "" || access_token === "must login") return;

	var json;
	var fetchFrom;
	if (editType === "portfolio") {
		json = JSON.stringify({
			username: userInfo.username, password: userInfo.password, crypto_to_add: userInfo.crypto_to_add
		})
		fetchFrom = 'http://localhost:8080/portfolio'
	} else if (editType === "account") {
		json = JSON.stringify({
			username: userInfo.username, password: userInfo.password, email: userInfo.email,
			bio: userInfo.bio, name: userInfo.name, age: userInfo.age
		})
		fetchFrom = 'http://localhost:8080/account'
	} else {
		return;
	}

	const payload = {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + access_token
		},
		body: json
	}
	fetch(fetchFrom, payload)
		.then(response => {
			if (!response.ok) throw new Error(response.status);
			else return response.json();
		})
		.then((userDetails) => {
			console.log("User profile update Success");
			window.alert("User profile update success!")
			window.location.reload();
		})
		.catch((error) => {
			window.alert("User profile update failed!")
			console.log("User profile update failed: " + error)
		})
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

export function authLoad(username, password) {
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/login?username=' + username + '&password=' + password,
		payload: {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			}
		}
	}

	return fetchLoad;
}

export function accessTokenLoad(access_token) {
	if (access_token === "" || access_token === "must login") return null

	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/account',
		payload: {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + access_token
			}
		}
	}

	return fetchLoad;
}

export default Account;