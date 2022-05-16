import { Box, TextField, Button, Tooltip, IconButton, Stack, Grid, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import { ClickAwayListener } from '@mui/base';
import { useEditAccount, useFetchUser, useAuthenticate } from "../utility/CustomHooks";

const headerStyle = {
	fontSize: 48,
	fontWeight: 'regular',
}
const sectionStyle = {
	fontSize: 32,
	fontWeight: 'light',
}
const imgStyle = {
	width: '100%',
	height: 'auto',
}

/**
 * @author Michael Maganini
 * @returns account info page
 */
const Account = () => {
	//STATES
	//states that change when user types to edit the field
	const [oldPassword, setOldPassword] = useState("");
	const [oldPasswordFieldContent, setOldPasswordFieldContent] = useState("");

	const [canAuthenticate, setCanAuthenticate] = useState(false);
	//states that change when user types to edit the field
	const [password, setPassword] = useState("");
	const [age, setAge] = useState(-1);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [email, setEmail] = useState("");
	//states that change to display forms a user wants to edit
	const [displayFormPassword, setDisplayFormPassword] = useState(false);
	const [displayFormAge, setDisplayFormAge] = useState(false);
	const [displayFormName, setDisplayFormName] = useState(false);
	const [displayFormBio, setDisplayFormBio] = useState(false);
	const [displayFormEmail, setDisplayFormEmail] = useState(false);
	//HOOKS
	//fetches user's info and JWT access token
	var fetchInfo = useFetchUser(true)
	var user = fetchInfo.user
	var access_token = fetchInfo.access_token
	//assigns state values after user fetched
	useEffect(() => {
		if (fetchInfo === null || fetchInfo.user === null) return;
		if (age === -1) setAge(fetchInfo.user.age);
		if (name === "") setName(fetchInfo.user.name);
		if (bio === "") setBio(fetchInfo.user.bio);
		if (email === "") setEmail(fetchInfo.user.email);
	}, [fetchInfo, age, name, bio, email]);
	//runs after user fetched, authenticates the user
	var { isAuthenticated } = useAuthenticate(user, oldPassword, canAuthenticate, false)
	//runs after authentication success, edits account with new info
	var userInfo = {
		username: user === null ? "" : user.username,
		password: password === "" ? oldPassword : password,
		email: email,
		age: age,
		bio: bio,
		name: name
	}
	useEditAccount(access_token, userInfo, oldPassword, isAuthenticated, "account")
	//HANDLERS
	/**
	 * handles which edit form displays after edit button clicked
	 * @param {String} type 
	 */
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
	/**
	 * handles displaying forms, only displays one form at a time
	 * @param {String} type 
	 */
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
	//handles closing of all input forms
	function closeDisplayForms() {
		setDisplayFormPassword(false)
		setDisplayFormAge(false)
		setDisplayFormName(false)
		setDisplayFormEmail(false)
		setDisplayFormBio(false)
	}
	/**
	 * handles changing state when user types in edit field
	 * @param {Object} event 
	 * @param {String} type 
	 */
	function handleTextField(event, type) {
		if (type === "password") {
			setPassword(event.target.value)
		} else if (type === "oldPassword") {
			setOldPasswordFieldContent(event.target.value)
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
	//handles closing forms and resetting states after user clicks out of account area of page
	function handleClickAway() {
		closeDisplayForms()
		setPassword("");
		setOldPasswordFieldContent("");
		setName(user.name)
		setEmail(user.email)
		setAge(user.age)
		setBio(user.bio)
	}
	//triggers useAuthenticate hook to authenticate with canAuthenticate state
	function authenticate() {
		setCanAuthenticate(true)
	}
	//handles closing edit forms and triggering authentication
	function handleSubmit() {
		closeDisplayForms()
		setOldPassword(oldPasswordFieldContent)
		authenticate()
	}
	/**
	 * handles whether an edit text field or user info field is displayed
	 * @param {String} type 
	 * @param {String} field 
	 * @param {boolean} displayForm 
	 * @returns HTML for either a form or field
	 */
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
				</>
			)
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
					id="helperText"
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
		<ClickAwayListener onClickAway={handleClickAway}>
			<Grid container
				spacing={2}
				direction="column"
				justifyContent="space-evenly"
				alignContent="stretch"
				width="850px"
				sx={{margin: 3, padding: 3, bgcolor: 'white'}}
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
					</Stack>{/*container for credentials and image*/}
				</Grid > {/*credentials section of grid*/}
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
					</Stack> {/*container for your info and image*/}
				</Grid> {/*your info section of grid*/}
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
					</Stack> {/*container for bio and image*/}
				</Grid> {/*Bio section of grid*/}
				<p></p>
				<Divider flexItem />
				{displayOldPasswordField ?
					<Stack direction="column" justifyContent='center' alignItems="center" alignContent="center">
						<TextField
							id="standard"
							label="Enter your current password."
							defaultValue=""
							variant="outlined"
							type="password"
							onChange={(event) => handleTextField(event, "oldPassword")}
						/>
						<Button size="small" onClick={() => handleSubmit()}>Submit Changes</Button>
					</Stack> /*password form field for editing account*/
					:
					""
				}
			</Grid>{/*grid container for credentials, info, bio sections*/}
		</ClickAwayListener> /*listens for clicks outside of account info area to close forms*/
	);
}

export default Account;