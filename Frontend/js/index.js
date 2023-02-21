

var addToCart = (id, product_name, price, photopath) => {
    if (localStorage.getItem("cart") == null) {
        localStorage.setItem(
            "cart",
            JSON.stringify([
                { id, product_name, price, photopath, quantity: 1 },
            ])
        );
    } else {
        const new_cart = JSON.parse(localStorage.getItem("cart"));
        let flag = false;
        let quantity = 0;
        let obje = {};
        const neww = new_cart.map((product) => {
            if (product.id === id) {
                quantity = Number(product.quantity) + 1;
                flag = true;
                obje = {
                    ...product,
                    quantity,
                };
                return obje;
            } else {
                return product;
            }
        });

        console.log(flag);

        if (!flag) {
            neww.push({
                id,
                product_name,
                price,
                photopath,
                quantity: 1,
            });
        }
        localStorage.setItem("cart", JSON.stringify(neww));
    }
    const cart = JSON.parse(localStorage.getItem("cart"));
    let count = 0;
    for (let item of cart) {
        count += Number(item.quantity);
        console.log(count);
    }
    document.getElementById("cart__items-number").innerText = count;
};
if(localStorage.getItem("access_token")){
    document.getElementById("logout").innerHTML = `<button onclick="logout()" class="btn btn-danger">Logout</button>`
    
}else{
    document.getElementById("logout").innerHTML = `<button
                                                class="btn btn-primary p-0 mx-1 border-0 px-1  "
                                                data-bs-toggle="modal"
                                                style="height: 30px"
                                                data-bs-target="#registermodal"
                                            >
                                                Signup
                                            </button> <button
                                                class="btn px-1 btn-info  p-0 mx-1 border-0 px-1  "
                                                data-bs-toggle="modal"
                                                 style="height: 30px"
                                                data-bs-target="#loginmodal"
                                            >
                                                Signin
                                            </button>`
}

function logout(){
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    document.getElementById("logout").innerHTML = `<button
                                                class="btn btn-primary p-0 mx-1 border-0 px-1  "
                                                data-bs-toggle="modal"
                                                style="height: 30px"
                                                data-bs-target="#registermodal"
                                            >
                                                Signup
                                            </button> <button
                                                class="btn px-1 btn-info  p-0 mx-1 border-0 px-1  "
                                                data-bs-toggle="modal"
                                                 style="height: 30px"
                                                data-bs-target="#loginmodal"
                                            >
                                                Signin
                                            </button>`
}
function ValidateEmail(mail) {
    if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
            subscription.emailAddr.value
        )
    ) {
        return true;
    }
    alert("You have entered an invalid email address!");
    return false;
}

async function fetchData(link) {
    const response = await fetch(link);
    const data = await response.json();
    return data;
}



function viewDetailOfProduct(id) {
    localStorage.setItem("id", id);
}


async function searchByCategory(category){
    if(document.location.pathname == "/index.html"){
        await searcher(category);
    }else{
        document.location.pathname = "/index.html";
        
    }
    
}

async function searcher(category){
    const data = await fetchData(
        `http://localhost:1756/products/getProductsbycategory?category=${category}`
    );
    const dataArray = Array.from(data);
    if (dataArray.length > 0) {
        const mappedData = dataArray.map(
            (product) => `<section
                            class="card col mx-2 mt-4 px-0"
                            style="max-width: 180px"
                        >
                            <a
                                href="/productDetail.html"
                                max-height="200px"
                                max-width="180px"
                                onclick="viewDetailOfProduct(${product.id})"
                            >
                                <img
                                    class="card-img-top object-fit-cover w-100 rounded mt-1"
                                    src='http://localhost:1756/products/product-photo/${product.Photopath}'
                                    alt="Samsung Galaxy M13 "
                                    style="
                                        height: 150px;
                                        object-fit:contain;
                                    "
                                />
                            </a>

                            <div class="card-body px-2 mx-0 my-0 mt-1 pt-0">
                                <h6 class="fs-6 fw-normal mb-1" style="height: 39px">
                                    ${product.name.slice(0,42)}
                                </h6>
                                <div class=" mt-0 py-0 m-0">
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                </div>

                                <div>
                                    <p class="my-0">
                                        <b
                                            >$
                                            <span 
                                                >${product.price}</span
                                            >
                                            <sup>.99</sup>
                                        </b>
                                    </p>
                                </div>

                                <div class="d-flex justify-content-center">
                                    <button
                                        class="btn btn-warning btn-sm mt-1 addtocart"
                                        onclick='addToCart("${product.id}", "${product.name}","${product.price}", "${product.Photopath}")'
                                    >
                                        🛒 Add to Cart
                                    </button>
                                </div>
                            </div>
                        </section>`
        );
        const products = document.getElementById("products");
        products.innerHTML = mappedData.join(" ");
    } else {
        const products = document.getElementById("products");
        products.innerHTML =
            "<div style='text-align: center'><h1>No product to show</h1></div>";
    }
    
    
}






async function searchProduct(evt) {
    evt.preventDefault();
    if (document.location.pathname == "/index.html") {
        searcherByNameAndCategory();
    } else {
        document.location.pathname = "/index.html";
    }
    
}


async function searcherByNameAndCategory(){
    let inputProduct = document.getElementById("searchbar").value;
    let catagory = document.getElementById("category").value;

    const relatedProducts = await fetchData(
        `http://localhost:1756/products/getProductByNameandCategory?category=${catagory.toUpperCase()}&name=${inputProduct.toLowerCase()}`
    );
    const dataArray = Array.from(relatedProducts);
    const mappedData = dataArray.map(
        (product) => `<section
                            class="card col mx-2 mt-4 px-0"
                            style="max-width: 180px"
                        >
                            <a
                                href="/productDetail.html"
                                max-height="200px"
                                max-width="180px"
                                onclick="viewDetailOfProduct(${product.id})"
                            >
                                <img
                                    class="card-img-top object-fit-cover w-100 rounded mt-1"
                                    src='http://localhost:1756/products/product-photo/${product.Photopath}'
                                    alt="Samsung Galaxy M13 "
                                    style="
                                        height: 150px;
                                        object-fit:contain;
                                    "
                                />
                            </a>

                            <div class="card-body px-2 mx-0 my-0 mt-1 pt-0">
                                <h6 class="fs-6 fw-normal mb-1" style="height: 39px">
                                    ${product.name.slice(0,42)}
                                </h6>
                                <div class=" mt-0 py-0 m-0">
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                    <span class="text-warning"
                                        ><i
                                            class="fa-solid text-warning fa-star"
                                        ></i
                                    ></span>
                                </div>

                                <div>
                                    <p class="my-0">
                                        <b
                                            >$
                                            <span 
                                                >${product.price}</span
                                            >
                                            <sup>.99</sup>
                                        </b>
                                    </p>
                                </div>

                                <div class="d-flex justify-content-center">
                                    <button
                                        class="btn btn-warning btn-sm mt-1 addtocart"
                                        onclick='addToCart("${product.id}", "${product.name}","${product.price}", "${product.Photopath}")'
                                    >
                                        🛒 Add to Cart
                                    </button>
                                </div>
                            </div>
                        </section>`
    );
    const products = document.getElementById("products");
    products.innerHTML = mappedData.join(" ");
    if (products.length == 0) {
        const products = document.getElementById("products");
        products.innerHTML =
            "<div style='text-align: center'><h1>No product to show</h1></div>";
    }
}
console.log("index home")


async function enterManagement() {
    if (
        localStorage.getItem("access_token") == "undefined" ||
        localStorage.getItem("access_token")
     == null) {
        const result = await giveToken();
    } else {
        
        if(parseJwt(localStorage.getItem("access_token")).role != "admin"){
            alert("Only for adminstrators")
        }else{
            document.location.pathname = "./adminstration.html";
        }
    }
    
    
}

    function Login(event) {
        event.preventDefault();
        console.log("login called");
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
                console.log(data);
                if (data.statusCode == 403) {
                    console.log("login");
                    document.getElementById("loginError").innerText =
                        data.message;
                } else {
                    if(data.access_token != "undefined"){
                        localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("refresh_token", data.refresh_token);
                    document.querySelector(".btn-close-black").click();
                    document.getElementById("logout").innerHTML = `<button onclick="logout()" class="btn btn-danger">Logout</button>`
                    if(parseJwt(data.access_token).role == "admin"){
                        document.location.pathname = "./adminstration.html";
                    }else{
                        document.getElementById("loginError") = "Only adminstrator can access";
                    }
                    }
                    
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function Register(event) {
        console.log("login called");
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
                lastName,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.response) {
                    if (data.response.statusCode == 403) {
                        document.getElementById("registerError").innerText =
                            data.response.message;
                    }
                } else {
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("refresh_token", data.refresh_token);
                    document.getElementById("close-register").click()
                    document.getElementById("logout").innerHTML = `<button onclick="logout()" class="btn btn-danger">Logout</button>`
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
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );

        return JSON.parse(jsonPayload);
    }

    async function giveToken() {
        let access_token = localStorage.getItem("access_token");
        let refresh_token = localStorage.getItem("refresh_token");
        if (access_token && refresh_token && access_token != "undefined" && access_token != undefined) {
            let currentTime = Date.now() / 1000;
            let accessTime = Number(parseJwt(access_token).exp);
            if (accessTime - currentTime < 1) {
                return true;
            } else {
                let refreshTime = Number(parseJwt(refresh_token).exp);
                if (refreshTime - currentTime < 1) {
                    document.getElementById("hidden--login").click();
                    return true;
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
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("refresh_token", data.access_token);
                    return true;
                }
            }
        } else {
            document.getElementById("hidden--login").click();
            return true;
        }
    }
