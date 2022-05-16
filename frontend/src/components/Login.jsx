import { Box, TextField, Button, Stack, Card } from '@mui/material';
import React, { useState } from 'react'
import { useAuthenticate, useNavigateAccount } from "../utility/CustomHooks";

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
 * @returns Sign In page (aka Login)
 */
const Login = () => {
    //STATES
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordFormContent, setPasswordFormContent] = useState("");
	const [usernameFormContent, setUsernameFormContent] = useState("");
    const [canAuthenticate, setCanAuthenticate] = useState(false);
    //HOOKS
    useNavigateAccount()
    var { isError } = useAuthenticate(username, password, canAuthenticate, true)
    //HANDLERS
    function handleUsername(e) {
        setUsernameFormContent(e.target.value)
    }
    function handlePassword(e) {
        setPasswordFormContent(e.target.value)
    }
    //upon clicking submit, allows authentication to begin
    function handleSubmit() {
        setUsername(usernameFormContent)
        setPassword(passwordFormContent)
        setCanAuthenticate(true)
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
                    Sign in
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
                    Login
                </Button>
                {isError ? "You have entered incorrect login credentials" : ""}
            </Stack>{/*container that stacks create account card contents as column*/}
        </Card>/*card container with shadow*/
    );
}

export default Login;