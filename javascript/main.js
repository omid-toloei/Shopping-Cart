/* =================================
  DOM Elements
================================= */



/* =================================
  Global Variables
================================= */



/* =================================
  Event Listeners
================================= */



/* =================================
  API
================================= */

async function request(url, options) {
  try {
    let response = await fetch(url, options);

    if(!response.ok) {
      throw response.status;
    }

    let dataJson = await response.json();
    return await dataJson;
    
  } catch(errorStatus) {
    
  } finally {

  }
}

/* =================================
  Functions
================================= */


