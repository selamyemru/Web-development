const cartTable = document.getElementById("cart--table");
let cartData = JSON.parse(localStorage.getItem("cart")) || [];

function mapper(cartData) {
    const mappedData = Array(...cartData).map(
        (product) => `<tr >
                        <td>${product.id}</td>
                        <td>${product.product_name}</td>
                        <td>${product.price}</td>
                        <td>${product.quantity}</td>
                        <td>${product.quantity * product.price}</td>
                        <td><div class="d-flex justify-content-between"><button class="btn w-100 btn-danger" onclick="removeProduct(${
                            product.id
                        })" >Remove</button> <button class="w-100 btn btn-warning" onclick="decrease(${
            product.id
        })">-</button><button class="w-100 btn btn-info" onclick="increase(${
            product.id
        })">+</button></div></td>
                        </tr>`
    );
    return `<table class="table table-striped mt-5 table-hover">
                                <thead>
                                    <tr class="table-dark">
                                        <th>Id</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="table-group-divider"
                                    id="product-body"
                                >${mappedData}</tbody>
                            </table> <button class="btn btn-primary" onclick="placeOrder()"> BUY </button>`;
}

cartTable.innerHTML = mapper(cartData);

function removeProduct(id) {
    const newData = cartData.filter((product) => product.id != id);
    console.log(newData);
    if (newData.length == 0) {
        localStorage.removeItem("cart");
    } else {
        localStorage.setItem("cart", newData);
    }

    cartData = newData;
    cartTable.innerHTML = mapper(newData);
}

function decrease(id) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const newArr = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].quantity -= 1;
            if (cart[i].quantity != 0) {
                newArr.push(cart[i]);
            }
        } else {
            newArr.push(cart[i]);
        }
    }
    localStorage.setItem("cart", JSON.stringify(newArr));
    cartTable.innerHTML = mapper(newArr);
}

function increase(id) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const newArr = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].quantity += 1;
        }
        newArr.push(cart[i]);
    }
    localStorage.setItem("cart", JSON.stringify(newArr));
    cartTable.innerHTML = mapper(newArr);
}

async function placeOrder(event) {
    await giveToken();
    const orders = [];
    let order = {};
    let access_token = localStorage.getItem("access_token");
    const userId = parseJwt(access_token).sub;
    const localOrders = JSON.parse(localStorage.getItem("cart"));
    for (let i = 0; i < localOrders.length; i++) {
        order["userId"] = userId;
        order["productId"] = localOrders[i].id;
        order["country"] = "ETHIOPIA";
        order["city"] = "ADDIS ABABA";
        order["postal"] = "0000";
        order["quantity"] = Number(localOrders[i].quantity);
        orders.push(order);
    }
    fetch("http://localhost:1756/orders/addManyOrder", {
        method: "POST",
        body: JSON.stringify(orders),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.count > 0) {
                document.getElementById("product-body").innerHTML =
                    "<tr>Order Placed Successfully</tr>";
                localStorage.removeItem("cart");
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function parseJwt(token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
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
    if (access_token && refresh_token) {
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
                if (
                    data.access_token != "undefined" &&
                    data.access_token != undefined
                ) {
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("refresh_token", data.access_token);
                }
            }
        }
    } else {
        document.getElementById("hidden--login").click();
    }
}
