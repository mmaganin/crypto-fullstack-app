/**
 * Edits a users account on backend for changing portfolio or editing account
 * @param {String} access_token 
 * @param {{username: String, password: String, email: String, 
 * 		age: Number, bio: String, name: String}} userInfo (if editType="account")userInfo 
 * 		  {{username: String, password: String, 
 * 		crypto_to_add: { id: Number, slug: String, quantity: Number }}}userInfo 
 * @param {String} editType ("portfolio" or "account") userInfo (if editType="portfolio")userInfo 
 * @returns nothing if editType is neither "account" nor "portfolio"
 */
export function editAccount(access_token, userInfo, editType) {
	if (access_token === "" || access_token === "must login") return;
	var json;
	var fetchFrom;
	if (editType === "portfolio") {
		json = JSON.stringify({
			username: userInfo.username, password: userInfo.password, crypto_to_add: userInfo.crypto_to_add
		})
		fetchFrom = 'http://localhost:8080/api/user/portfolio'
	} else if (editType === "account") {
		json = JSON.stringify({
			username: userInfo.username, password: userInfo.password, email: userInfo.email,
			bio: userInfo.bio, name: userInfo.name, age: userInfo.age
		})
		fetchFrom = 'http://localhost:8080/api/user/account'
	} else {
		return;
	}
	const payload = {
		method: 'PUT',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + access_token
		},
		body: json
	}
	fetch(fetchFrom, payload)
		.then(response => {
			if (!response.ok) throw new Error(response.status);
			else return response.json();
		})
		.then((userDetails) => {
			console.log("User profile update Success");
			window.alert("User profile update success!")
			window.location.reload();
		})
		.catch((error) => {
			window.alert("User profile update failed!")
			console.log("User profile update failed: " + error)
		})
}
/**
 * Returns the necessary REST load for authenticating a user
 * @param {String} username 
 * @param {String} password 
 * @returns {{fetchFrom: String, payload: { method: String, headers: { String: String, } } }} 
 * URI to fetch from and the REST payload
 */
export function authLoad(username, password) {
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/login?username=' + username + '&password=' + password,
		payload: {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			}
		}
	}
	return fetchLoad;
}
/**
 * Returns the necessary REST load for getting account info from backend, includes authorization header requiring access token
 * @param {String} access_token 
 * @returns {{fetchFrom: String, payload: { method: String, headers: { String: String, } } }} 
 * URI to fetch from and the REST payload
 */
export function accessTokenLoad(access_token) {
	if (access_token === "" || access_token === "must login") return null
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/api/user/account',
		payload: {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + access_token
			}
		}
	}
	return fetchLoad;
}
/**
 * Returns the necessary REST load for getting access token, includes authorization header requiring refresh token
 * @returns {{fetchFrom: String, payload: { method: String, headers: { String: String, String: String } } }} 
 * URI to fetch from and the REST payload
 */
export function fetchRefreshLoad() {
	var refresh_token = localStorage.getItem('refresh');
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/api/noroles/tokens/refresh',
		payload: refresh_token === null ? "must login" : {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + refresh_token
			}
		}
	}
	return fetchLoad;
}
/**
 * Returns the necessary REST load for getting market data
 * @returns {{fetchFrom: String, payload: { method: String, headers: { String: String, } } }} 
 * URI to fetch from and the REST payload
 */
export function marketsLoad() {
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/api/noroles/markets',
		payload: {
			method: 'GET',
			headers: {
				"Content-Type": "application/json"
			}
		}
	}
	return fetchLoad;
}
/**
 * Returns the necessary REST load for refreshing market data
 * @returns {{fetchFrom: String, payload: { method: String, headers: { String: String, } } }} 
 * URI to fetch from and the REST payload
 */
 export function refreshMarketsLoad() {
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/api/noroles/markets',
		payload: {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json"
			}
		}
	}
	return fetchLoad;
}
/**
 * Returns the necessary REST load for create account
 * @returns {{fetchFrom: String, payload: { method: String, headers: { String: String, }, body: String } }} 
 * URI to fetch from and the REST payload
 */
export function createAccountLoad(username, password) {
	const json = JSON.stringify({ username: username, password: password })
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/api/noroles/createaccount',
		payload: {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: json
		}
	}
	return fetchLoad;
}