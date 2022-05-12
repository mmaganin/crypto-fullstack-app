export function editAccount(access_token, userInfo, editType) {
	if (access_token === "" || access_token === "must login") return;
	var json;
	var fetchFrom;
	if (editType === "portfolio") {
		json = JSON.stringify({
			username: userInfo.username, password: userInfo.password, crypto_to_add: userInfo.crypto_to_add
		})
		fetchFrom = 'http://localhost:8080/portfolio'
	} else if (editType === "account") {
		json = JSON.stringify({
			username: userInfo.username, password: userInfo.password, email: userInfo.email,
			bio: userInfo.bio, name: userInfo.name, age: userInfo.age
		})
		fetchFrom = 'http://localhost:8080/account'
	} else {
		return;
	}
	const payload = {
		method: 'POST',
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

export function accessTokenLoad(access_token) {
	if (access_token === "" || access_token === "must login") return null
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/account',
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

export function fetchRefreshLoad() {
	var refresh_token = localStorage.getItem('refresh');
	var fetchLoad = {
		fetchFrom: 'http://localhost:8080/tokens/refresh',
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

export function marketsLoad() {
    var fetchLoad = {
      fetchFrom: 'http://localhost:8080/markets',
      payload: {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      }
    }
    return fetchLoad;
  }