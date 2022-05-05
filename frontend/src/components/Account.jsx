import { Box, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'

const Account = () => {
	const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleEmail(e){
		setEmail(e.target.value)
	}
	function handleUsername(e){
		setUsername(e.target.value)
	}
	function handlePassword(e){
		setPassword(e.target.value)
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
				<TextField
          required
          id="outlined-required"
          label="Email"
          defaultValue={email}
					onChange={(e) => handleEmail(e)}
        />
				<TextField
          required
          id="outlined-required"
          label="Username"
          defaultValue={username}
					onChange={(e) => handleUsername(e)}

        />
				<TextField
					required
          id="outlined-password-input"
          label="Password"
          type="password"
          defaultValue={password}
					onChange={(e) => handlePassword(e)}
        />

			</Box>
		</div>
	);
}

export default Account;