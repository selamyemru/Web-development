function Login(event) {
    event.preventDefault();
	
    const form = document.getElementById("loginForm");
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    fetch("http://localhost:1756/auth/signin", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.statusCode == 403) {
				console.log("login");
                document.getElementById("loginError").innerText =
                    data.message;
            }else{
				localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
			}
			
        })
        .catch((error) => {
            console.error(error);
        });
		document.location.reload();
}

function Register(event) {
    event.preventDefault();
    const form = document.getElementById("registerForm");
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
	const firstName = formData.get("firstName");
	const lastName = formData.get("lastName");
    fetch("http://localhost:1756/auth/signup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
			firstName,
			lastName
        }),
    })
        .then((res) => res.json())
        .then((data) => {
			
			if(data.response){
				if (data.response.statusCode == 403){
					document.getElementById("registerError").innerText =
                        data.response.message;
				}
                    
			}else{
				localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
			}
			
            
        })
        .catch((error) => {
            console.log(error) 
        });
		document.location.reload();
}
