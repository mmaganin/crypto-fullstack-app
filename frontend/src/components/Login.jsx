import { Box, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { authLoad } from "./Account";


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

                <Button variant="outlined" onClick={handleSubmit}>
                    Login
                </Button>
                {isError ? "You have entered incorrect login credentials" : ""}

            </Box>
        </div>
    );
}

export default Login;