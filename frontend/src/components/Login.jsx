import { Box, TextField, Button, Stack, Card } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { authLoad } from "./Account";

const sideBarStyle = {
    minWidth: '100px',

}

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isError, setIsError] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        const refresh_token = localStorage.getItem('refresh')
        if (refresh_token !== null) {
            navigate("/account")
        }
    }, []);

    function handleUsername(e) {
        setUsername(e.target.value)
    }
    function handlePassword(e) {
        setPassword(e.target.value)
    }
    function handleSubmit() {
        const load = authLoad(username, password)
        fetch(load.fetchFrom, load.payload)
            .then(response => {
                if (!response.ok) throw new Error(response.status);
                else {
                    return response.json();
                }
            })
            .then(loginTokens => {
                localStorage.setItem('refresh', loginTokens.refresh_token)
                console.log("SUCCESSFUL LOGIN")
                window.alert("Authentication Successful!")
                setIsError(false)
                navigate("/account")
            })
            .catch((error) => {
                console.log("Fetch failed: " + error)
                setIsError(true)
            })
    }

    return (
        <Stack direction="row" justifyContent='center'  >
            <Box sx={sideBarStyle} />
            <Card sx={{ boxShadow: 10 }}>
                <Stack direction="column"
                    width='400px'
                    margin='25px'
                    justifyContent='center'
                    alignItems="center"
                    alignContent="center"
                    spacing={2}>
                    <Box sx={{
                        fontSize: 32,
                        fontWeight: 'light'
                    }}>
                        Sign in
                    </Box>

                    <TextField
                        required
                        id="outlined-required"
                        fullWidth
                        label="Username"
                        defaultValue={username}
                        onChange={(e) => handleUsername(e)}

                    />
                    <TextField
                        required
                        id="outlined-password-input"
                        fullWidth
                        label="Password"
                        type="password"
                        defaultValue={password}
                        onChange={(e) => handlePassword(e)}
                    />

                    <Button variant="outlined" onClick={handleSubmit}>
                        Login
                    </Button>
                    {isError ? "You have entered incorrect login credentials" : ""}

                </Stack>
            </Card>
            <Box sx={sideBarStyle} />
        </Stack>
    );
}

export default Login;