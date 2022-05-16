import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { editAccount, fetchRefreshLoad, accessTokenLoad, authLoad, marketsLoad } from "./HelpfulMethods";
/**
 * fetches JWT access token with refresh token stored in localStorage
 * @param {boolean} canFetch 
 * @returns JWT access token to authenticate with backend security config
 */
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
    }, [canFetch, navigate]);

    return access_token;
}
/**
 * Retrieves an access token, and gets the current logged in user's info with the token 
 * upon successful access token retrieval or canFetchUser is changes to true
 * @param {boolean} canFetchUser 
 * @returns {{access_token: String, 
 *      user: {age: Number, bio: String, crypto_in_portfolio: Object, email: String, id: Number, 
 *          name: String, password: String, roles: Array<Object>, username: String }, 
 *      name: String, email: String, age: Number, bio: String}}
 *      user, a user's info, and JWT access token
 */
export const useFetchUser = (canFetchUser) => {
    const [user, setUser] = useState(null);
    var access_token = useFetchAccessToken(canFetchUser)
    useEffect(() => {
        if (!canFetchUser || access_token === "" || access_token === "must login") return;
        const accessLoad = accessTokenLoad(access_token)
        
        fetch(accessLoad.fetchFrom, accessLoad.payload)
            .then(response => {
                if (!response.ok) throw new Error(response.status);
                else return response.json();
            })
            .then(user => {
                console.log("successful user info fetch: ")
                setUser(user)
            })
            .catch((error) => {
                console.log("User Fetch failed: " + error)
            })
    }, [access_token, canFetchUser]);

    return { access_token, user }
}
/**
 * Edits a user's account once a user reauthenticates upon isAuthenticated state change to true
 * @param {String} access_token 
 * @param {Object} userInfo 
 * @param {String} password 
 * @param {boolean} isAuthenticated 
 * @param {String} editType 
 */
export const useEditAccount = (access_token, userInfo, password, isAuthenticated, editType) => {
    useEffect(() => {
        if (password === "" || !isAuthenticated) return;
        editAccount(access_token, userInfo, editType)
    }, [isAuthenticated, access_token, userInfo, password, editType]);
}
/**
 * authenticates the user to login, create account, or edit account 
 * @param {String or Object} user //username inputted as string when logging in or creating account
 * @param {String} password 
 * @param {boolean} canAuthenticate 
 * @param {boolean} isLoginOrCreate 
 * @returns {{isAuthenticated: boolean, isError: boolean}}
 */
export const useAuthenticate = (user, password, canAuthenticate, isLoginOrCreate) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isError, setIsError] = useState(false);
    let navigate = useNavigate();
    var username = user;
    if (!isLoginOrCreate) username = user === null ? "" : user.username;

    useEffect(() => {
        if (username === null || !canAuthenticate || username === "") return;
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
    }, [user, canAuthenticate, isLoginOrCreate, navigate, password, username]);

    return {isAuthenticated, isError}
}
/**
 * retrieves crypto market data from backend 
 * @returns {{circulating_supply: string, cmc_rank: string, last_updated: string, market_cap: string, 
 * 		name: string, percent_change_1h: string, percent_change_7d: string, percent_change_24h: string, 
 * 		percent_change_30d: string, price: string, slug: string, symbol: string, total_supply: string}} data
 */
export const useGetMarkets = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        if (data !== null) return;
        const fetchLoad = marketsLoad();
        fetch(fetchLoad.fetchFrom, fetchLoad.payload)
            .then(response => response.json())
            .then(data => setData(data))
    }, [data]);

    return data
}
/**
 * navigates to account page if user is logged in (refresh token present in localStorage)
 */
export const useNavigateAccount = () => {
    let navigate = useNavigate();
    useEffect(() => {
        const refresh_token = localStorage.getItem('refresh')
        if (refresh_token !== null) {
            navigate("/account")
        }
    }, [navigate]);
}
/**
 * navigates to login page if user is not logged in (refresh token not present in localStorage)
 */
export const useNavigateLogin = () => {
    let navigate = useNavigate();
    useEffect(() => {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token === null) {
			navigate("/login")
		}
	}, [navigate]);
}