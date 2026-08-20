/* =================================
  DOM Elements
================================= */

// Error
const showErrorSection = document.querySelector(".show-error-section");
const showErrorMessage = document.querySelector("#showErrorMessage");

// Loader spinner
const loaderParent = document.querySelector("#loaderParent");

/* =================================
  Global Variables
================================= */

let isLoading = false;
let products = [];

/* =================================
  Event Listeners
================================= */

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
    products = await request("https://dummyjson.com/products");
  } catch (error) {
    showError(error);
  }
}

/* =================================
  Functions
================================= */



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