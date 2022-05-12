import { Box, TextField, Button, Stack, Card } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
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
    //states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [canAuthenticate, setCanAuthenticate] = useState(false);
    //hooks
    useNavigateAccount()
    var { isError } = useAuthenticate(username, password, canAuthenticate, true)
    //handlers
    function handleUsername(e) {
        setUsername(e.target.value)
    }
    function handlePassword(e) {
        setPassword(e.target.value)
    }
    function handleSubmit() {
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