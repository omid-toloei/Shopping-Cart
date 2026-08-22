/* =================================
  DOM Elements
================================= */

// Error
const showErrorSection = document.querySelector(".show-error-section");
const showErrorMessage = document.querySelector("#showErrorMessage");

// Loader spinner
const loaderParent = document.querySelector("#loaderParent");

// Products
const productsSection = document.querySelector(".products-section");
const productCard = document.querySelector(".product-card");
const quantityControlValue = document.querySelector(".quantity-control__value");

/* =================================
  Global Variables
================================= */

let isLoading = false;
let products = [];

/* =================================
  Event Listeners
================================= */

productsSection.addEventListener("click", (event) => {
  const buttonTarget = event.target.closest("button");
  if (!buttonTarget) return;

  const productCardTarget = event.target.closest(".product-card");
  if (!productCardTarget) return;

  if (buttonTarget.classList.contains("quantity-plus")) {
    plusProductQuantity(productCardTarget.dataset.productId);
  }

  if (buttonTarget.classList.contains("quantity-minus")) {
    // minusProductQuantity(productCardTarget.dataset.productId);
  }
});

/* =================================
  API
================================= */

async function request(url, options) {
  if (isLoading) return;
  isLoading = true;
  showLoading(isLoading);

  try {
    let response = await fetch(url, options);

    if (!response.ok) {
      throw response.status;
    }

    let dataJson = await response.json();
    return await dataJson;
  } catch (error) {
    if (error instanceof TypeError) {
      throw "NETWORK_ERROR";
    } else {
      throw error;
    }
  } finally {
    isLoading = false;
    showLoading(isLoading);
  }
}

async function getProducts() {
  try {
    const productsWithoutQuantity = await request(
      "https://fakestoreapi.com/products",
    );
    products = setQuantity(productsWithoutQuantity);
  } catch (error) {
    showError(error);
  }
}

/* =================================
  Functions
================================= */

function setQuantity(array) {
  const getLocalStorageData =
    JSON.parse(localStorage.getItem("shoppingCart")) || [];

  let newProducts = array.map((object) => {
    if (getLocalStorageData.some((element) => element.id === object.id)) {
      let localStorageElement = getLocalStorageData.filter(
        (element) => element.id === object.id,
      );
      object.quantity = localStorageElement[0].quantity;
      return object;
    } else {
      object.quantity = 0;
      return object;
    }
  });

  return newProducts;
}

function plusProductQuantity(productIdString) {
  const productId = Number(productIdString);

  // Change "products" array
  let productIndex = products.findIndex((object) => object.id === productId);
  products[productIndex].quantity++;

  // Change local storage
  let getLocalStorageData = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  if (getLocalStorageData.some((element) => element.id === productId)) {
    let localStorageElement = getLocalStorageData.filter(element => element.id === productId);
    localStorageElement.quantity = products[productIndex].quantity;

  } else {

    let localStorageElement = {
      id: productId,
      quantity: products[productIndex].quantity
    }
    getLocalStorageData.push(localStorageElement);
  }

  localStorage.setItem("shoppingCart", JSON.stringify(getLocalStorageData));

  // Change UI
  showProducts(products);
}

async function run() {
  await getProducts();
  showProducts(products);
}

run();

/* =================================
  Render Functions
================================= */

function showError(errorType) {
  let errorMessage = "";

  switch (errorType) {
    case "NETWORK_ERROR":
      errorMessage = "Please check your network connection";
      break;
    case 404:
      errorMessage = "404 Data not found";
      break;
    case 500:
      errorMessage = "500 Please try again later(Server-side problem)";
      break;
    case 503:
      errorMessage = "503 The server is temporarily unavailable";
      break;
    default:
      errorMessage = "Something went wrong";
      console.log(errorType);
  }

  showErrorSection.style.display = "flex";
  showErrorMessage.textContent = errorMessage;
}

function showLoading(status) {
  if (status) {
    loaderParent.style.display = "flex";
  } else {
    loaderParent.style.display = "none";
  }
}

function showProducts(array) {
  let allProductsStructure = "";

  array.forEach((object) => {
    allProductsStructure += `<article class="product-card" data-product-id="${object.id}">
          <img src="${object.image}" alt="${object.title}" class="product-card__image">
          <div class="product-info-card">
            <h2 class="product-card__title">${object.title}</h2>
            <p class="product-card__description">${object.description}</p>
            <div class="product-card__footer">
              <span class="product-card__price">$${object.price}</span>
              <div class="quantity-control">
                <button class="quantity-control__btn quantity-minus"> - </button>
                <span class="quantity-control__value"> ${object.quantity} </span>
                <button class="quantity-control__btn quantity-plus"> + </button>
              </div>
            </div>
          </div>
        </article>`;
  });

  productsSection.innerHTML = allProductsStructure;
}
