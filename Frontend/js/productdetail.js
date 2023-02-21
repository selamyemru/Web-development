const postProduct = () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", (evt) => {
        evt.preventDefault();
        if (form.checkValidity()) {
        }
    });
};

async function fetchData(link) {
    const response = await fetch(link);
    const data = await response.json();
    return data;
}

async function storeDataInArray() {
    const id = localStorage.getItem("id") ?? 0;
    const data = await fetchData(
        `http://localhost:1756/products/getProductById/${id}`
    );
    document.getElementById("price").innerText = data.price;
    document.getElementById("price_tax").innerText = data.price;
    document.getElementById("total_price").innerText = Number(data.price) + 197;
    document.getElementById("category").innerText = data.category;
    document.getElementById("title").innerText = data.name;
    document.getElementById("description").innerHTML = `<ul>${data.description
        .split(".")
        .map((item) => `<li style="max-width=300px">${item}</li>`)
        .join("")}</ul>`;
    document.getElementById(
        "product__title"
    ).innerHTML = `<h1 id="product__title">${data.name}</h1>`;

    document.getElementById(
        "product__image"
    ).innerHTML = `<img class="w-100"  src=${`http://localhost:1756/products/product-photo/${data.Photopath}`} alt=${
        data.name
    } />`;
    document.getElementById(
        "add-to-cart"
    ).innerHTML = `<button class="btn w-100 my-1 btn-outline-success" onclick='addToCart("${data.id}", "${data.name}","${data.price}", "${data.Photopath}")'>Add to Cart</button>`;

    const relatedProducts = await fetchData(
        `http://localhost:1756/products/getProductsbycategory?category=${data.Category}`
    );
    const dataArray = Array.from(relatedProducts).slice(0, 10);
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
                                <h6 class="fs-6 fw-normal mb-1" >
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
    const products = document.getElementById("related-products");
    products.innerHTML = `<div class="upper--elevated <div class="d-flex flex-nowrap">
</div>${mappedData.join(" ")}</div>`;
}
storeDataInArray();
