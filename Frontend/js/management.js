async function fetchData(link, data) {
    const response = await fetch(link, data);
    data = await response.json();
    return data;
}

async function manageProduct() {
    await giveToken();
    console.log("managing");
    let data = await fetchData(
        "http://localhost:1756/products/getProducts",
        {}
    );
    let dataArray = Array.from(data);
    let mappedData = dataArray.map(
        (product) => `<tr >
                          <td>${product.id}</td>
                          <td>${product.name}</td>
                          <td>${product.description}</td>
                          <td>${product.Category}</td>
                          <td>${product.price}</td>
                          <td>${product.createdAt.slice(0, 10)}</td>
                          <td>${product.brand}</td>
                          <td>${product.quantity}</td>
                          <td>${product.size}</td>
                          <td><div><button class="btn w-100 btn-outline-danger" onclick="deleteProduct(${
                              product.id
                          })" >Delete</button></div> <div> <button class="w-100 btn btn-outline-warning" onclick="editProduct(${
            product.id
        })">Edit</button></div></td>
                        </tr>`
    );
    const productBody = document.getElementById("product-body--products");
    productBody.innerHTML = mappedData.join(" ");

    data = await fetchData("http://localhost:1756/auth/getusers", {
        headers: {
            
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    dataArray = Array.from(data);
    mappedData = dataArray.map(
        (user) => `<tr class="height--limit">
                          <td>${user.id}</td>
                          <td>${user.firstName}</td>
                          <td>${user.lastName}</td>
                          <td>${user.email}</td>
                          <td>${user.createdAt.slice(0, 10)}</td>
                          <td>${user.role}</td>
                          <td><div><button class="btn w-100 ${
                              user.role == "admin" ? "btn-info" : "btn-warning"
                          } " onclick="makeAdmin('${user.id}','${
            user.role
        }')">${
            user.role == "admin" ? "Customer" : "Admin"
        }</button> </div> <div> <button onclick='deleteUser(${
            user.id
        })' class="btn btn-danger w-100 my-1">Delete</button></div> </td>
                        </tr>`
    );
    const userdBody = document.getElementById("product-body--users");
    userdBody.innerHTML = mappedData.join(" ");

    data = await fetchData("http://localhost:1756/orders/getorders", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    dataArray = Array.from(data);

    mappedData = dataArray.map(
        (order) => `<tr >
                          <td>${order.id}</td>
                          <td>${order.productId}</td>
                          <td>${order.Quantity}</td>
                          <td>${order.TotalPrice}</td>
                          <td>${order.Country}</td>
                          <td>${order.City}</td>
                          <td>${order.Postal}</td>
                          <td>${order.userId}</td>
                          <td>${order.createdAt.slice(0, 10)}</td>
                          
                        </tr>`
    );
    const orderBody = document.getElementById("product-body--orders");
    orderBody.innerHTML = mappedData.join(" ");
}









async function makeAdmin(id, role) {
    const requestedRole = role == "admin" ? "customer" : "admin";
    const requestedId = Number(id);
    await giveToken();
    const response = await fetch("http://localhost:1756/auth/addtorole", {
        method: "POST",
        body: JSON.stringify({ roleName: requestedRole, userId: requestedId }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("refresh_token")}`,
        },
    });
    const data = await response.json();
    manageProduct();
}


async function deleteUser(id) {
    const requestedId = Number(id);
    await giveToken();
    const response = await fetch(`http://localhost:1756/auth/deleteuser/${requestedId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
    });
    const data = await response.json();
    console.log(data)
    manageProduct();
}












manageProduct();










async function deleteProduct(id) {
    let access_token = localStorage.getItem("access_token");
    let refresh_token = localStorage.getItem("refresh_token");
    if (access_token) {
        let currentTime = Date.now() / 1000;
        console.log(parseJwt(access_token));
        let accessTime = Number(parseJwt(access_token).exp);
        console.log(accessTime - currentTime);
        if (accessTime - currentTime > 1) {
            const response = await fetch(
                `http://localhost:1756/products/deleteProduct/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            const data = await response.json();
            document.location.reload();
        } else {
            let refreshTime = Number(parseJwt(refresh_token).exp);
            if (refreshTime - currentTime < 1) {
                document.getElementById("hidden--login").click();
            } else {
                const response = await fetch(
                    "http://localhost:1756/auth/refresh",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${refresh_token}`,
                        },
                    }
                );
                const data = await response.json();
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.access_token);
                const responses = await fetch(
                    `http://localhost:1756/products/deleteProduct/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                const datas = await responses.json();

                document.location.reload();
            }
        }
    } else {
        document.getElementById("hidden--login").click();
        document.location.pathname = "/adminstration.html"
    }
    manageProduct();
}

function editProduct(id) {
    localStorage.setItem("editItem", id);
    localStorage.setItem("editTime", Date.now().toString());
    console.log(Date.now());
    document.location.pathname = "/addProduct.html";
}

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}



async function giveToken() {
    let access_token = localStorage.getItem("access_token");
    let refresh_token = localStorage.getItem("refresh_token");
    console.log(access_token)
    if (access_token && refresh_token && access_token != "undefined") {
        let currentTime = Date.now() / 1000;
        let accessTime = Number(parseJwt(access_token).exp);
        if (accessTime - currentTime < 1) {
            return;
        } else {
            let refreshTime = Number(parseJwt(refresh_token).exp);
            if (refreshTime - currentTime < 1) {
                document.getElementById("hidden--login").click();
            } else {
                const response = await fetch(
                    "http://localhost:1756/auth/refresh",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${refresh_token}`,
                        },
                        body: JSON.stringify({ refresh_token }),
                    }
                );

                const data = await response.json();
                if(data.access_token!= "undefined" && data.access_token != undefined){
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("refresh_token", data.access_token);
                }
                
            }
        }
    } else {
        document.getElementById("hidden--login").click();
    }
}
