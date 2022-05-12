import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { editAccount, fetchRefreshLoad, accessTokenLoad, authLoad, marketsLoad } from "./HelpfulMethods";

export const useFetchAccessToken = (canFetch) => {
    const [access_token, setAccess_token] = useState("");
    let navigate = useNavigate();
    useEffect(() => {
        if (!canFetch) return;
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
    }, [canFetch]);

    return access_token;
}

export const useFetchUser = (canFetchUser) => {
    const [userFetched, setUserFetched] = useState(false);
    const [user, setUser] = useState(null);
    const [age, setAge] = useState(-1);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");

    var access_token = useFetchAccessToken(canFetchUser)

    useEffect(() => {
        if (!canFetchUser || userFetched || access_token === "" || access_token === "must login") return;
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
    }, [access_token, canFetchUser]);

    return { access_token, user, name, email, age, bio }
}

export const useEditAccount = (access_token, userInfo, password, isAuthenticated, editType) => {
    useEffect(() => {
        if (password === "" || !isAuthenticated) return;

        console.log(userInfo)
        editAccount(access_token, userInfo, editType)

    }, [isAuthenticated]);
}


export const useAuthenticate = (user, password, canAuthenticate, isLoginOrCreate) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isError, setIsError] = useState(false);
    let navigate = useNavigate();
    var username = user;

    useEffect(() => {
        if (username === null || !canAuthenticate || username === "") return;
        if (!isLoginOrCreate) username = user.username
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
                console.log("SUCCESSFUL AUTHENTICATION")
                //window.alert("Authentication Successful!")
                setIsAuthenticated(true)
                if (isLoginOrCreate){
                    window.alert("Authentication Successful!")
                    navigate("/account");
                } 
            })
            .catch((error) => {
                console.log("Fetch failed: " + error)
                setIsError(true)
                window.alert("Your password is incorrect!")
                setIsAuthenticated(false)
            })
    }, [user, canAuthenticate]);

    return {isAuthenticated, isError}
}

export const useGetMarkets = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (data !== null) return;
        const fetchLoad = marketsLoad();

        fetch(fetchLoad.fetchFrom, fetchLoad.payload)
            .then(response => response.json())
            .then(data => setData(data))

    }, []);

    return data
}

export const useNavigateAccount = () => {
    let navigate = useNavigate();
    useEffect(() => {
        const refresh_token = localStorage.getItem('refresh')
        if (refresh_token !== null) {
            navigate("/account")
        }
    }, []);
}

export const useNavigateLogin = () => {
    let navigate = useNavigate();
    useEffect(() => {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token === null) {
			navigate("/login")
		}
	}, []);
}