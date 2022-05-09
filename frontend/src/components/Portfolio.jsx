import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { fetchRefreshLoad, accessTokenLoad } from "./Account";


const Portfolio = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState(null);
	const [access_token, setAccess_token] = useState("");
	const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
		const refresh_token = localStorage.getItem('refresh')
		if (refresh_token === null) {
			navigate("/login")
		}
	}, []);

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
			})
			.catch((error) => {
				console.log("User Fetch failed: " + error)
			})

	}, [access_token]);

    return (
      <div>
        {user === null ? "" : user.username}'s portfolio page
      </div>
    );
  }
  
  export default Portfolio;