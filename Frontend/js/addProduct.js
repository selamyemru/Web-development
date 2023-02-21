const prev = localStorage.getItem("editTime");
const now = Number(Date.now()) / 1000;
if (prev != null) {
    const diff = now - Number(prev) / 1000;
    if (diff < 3) {
        storeDataInArray();
    }
}
async function fetchData(link) {
    const response = await fetch(link);
    const data = await response.json();
    return data;
}

async function storeDataInArray() {
    const id = localStorage.getItem("editItem");
    const data = await fetchData(
        `http://localhost:1756/products/getProductById/${id}`
    );
    document.getElementById("name").value = data.name;
    document.getElementById("quantity").value = Number(data.quantity);
    document.getElementById("price").value = Number(data.price);
    document.getElementById("size").value = data.size;
    document.getElementById("brand").value = data.brand;
    document.getElementById("description").value = data.description;
    document.getElementById("category").value = data.Category;
    document.getElementById(
        "for--image"
    ).innerHTML = `<img class="w-100"  src=${`http://localhost:1756/products/product-photo/${data.Photopath}`} alt=${
        data.name
    } />`;
    document.getElementById("button--name").innerText = "Update";
}
async function addProduct(event) {
    event.preventDefault();
    giveToken();
    let form = document.querySelector("form");
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
        form = document.getElementById("form");
        const formData = new FormData(form);
        const name = formData.get("name");
        const quantity = formData.get("quantity");
        const price = formData.get("price");
        const size = formData.get("size");
        const brand = formData.get("brand");
        const category = formData.get("category");
        const image = formData.get("image");
        const description = formData.get("description");
        const id = formData.append("id", localStorage.getItem("editItem"));
        let method = "POST";
        console.log(method);
        let link = "http://localhost:1756/products/addProduct";
        if (document.getElementById("button--name").innerText == "Update") {
            method = "PUT";
            link = "http://localhost:1756/products/editProduct";
        }
        fetch(link, {
            method,
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "refresh_token"
                )}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
            alert("Product added successfully");
            document.location.reload();
    }
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
