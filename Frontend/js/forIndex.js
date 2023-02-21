
async function fetchData(link) {
    const response = await fetch(link);
    const data = await response.json();
    return data;
}

async function storeDataInArray() {
    console.log("loading products")
    const data = await fetchData("http://localhost:1756/products/getProducts");
    const dataArray = Array.from(data);
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
                                    src='http://localhost:1756/products/product-photo/${
                                        product.Photopath
                                    }'
                                    alt="Samsung Galaxy M13 "
                                    style="
                                        height: 150px;
                                        object-fit:contain;
                                    "
                                />
                            </a>

                            <div class="card-body px-2 mx-0 my-0 mt-1 pt-0">
                                <h6 class="fs-6 fw-normal mb-1" style="height : 39px">
                                    ${product.name.slice(0, 42)}
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
                                        onclick='addToCart("${product.id}", "${
            product.name
        }","${product.price}", "${product.Photopath}")'
                                    >
                                        🛒 Add to Cart
                                    </button>
                                </div>
                            </div>
                        </section>`
    );
    const products = document.getElementById("products");
    products.innerHTML = mappedData.join(" ");
}

storeDataInArray();