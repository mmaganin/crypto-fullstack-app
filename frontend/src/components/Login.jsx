import { Box, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginTokens, setLoginTokens] = useState(null);
    const [access_token, setAccess_token] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        const refresh_token = localStorage.getItem('refresh')
        if(refresh_token !== null){
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
        const fetchFrom = 'http://localhost:8080/login?username=' + username + '&password=' + password
        const payload = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
        }
        fetch(fetchFrom, payload)
            .then(response => {
                if(!response.ok) throw new Error(response.status);
                else{
                    setIsLoading(true);
                    setErrorMsg(null);
                    return response.json();
                }
            })
            .then(loginTokens => {
                setAccess_token(loginTokens.access_token)
                localStorage.setItem('refresh', loginTokens.refresh_token)
                console.log("SUCCESSFUL LOGIN")
                window.alert("Login Successful!")
                setIsLoading(false)
                setLoginTokens(loginTokens)
                navigate("/account")
            })
            .catch((error) => {
                setErrorMsg(error)
                setIsLoading(false);
                console.log("Fetch failed: " + error)
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
                <p>{isLoading ? "Loading" : ""} {errorMsg !== null ? "You have entered incorrect login credentials" : "" }</p>
                

            </Box>
        </div>
    );
}

export default Login;