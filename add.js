


/*
    this chunk of the code handles the form.
    the form is the thing that lets the user add 
    new listings to the website
*/
function showForm() {

    // Get the form element
    var form = document.getElementById('formElement');

    // making a very transparent thing to 
    // pretend the site is fading out
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.className = 'overlay';

    // Add the overlay to the page
    document.body.appendChild(overlay);

    // adding the form on top of the overlay created
    form.style.position = 'fixed';
    form.style.top = '50%';
    form.style.left = '50%';
    form.style.transform = 'translate(-50%, -50%)';
    form.style.zIndex = '999'; // ensures form is on top
    form.style.display = 'block';
}



/*
    this will post the contents
    of the form
*/
async function submitForm(event) {

    //stops the post from being submitted twice in a row
    event.preventdefault();

    // grabbing form ddata
    const formData = new FormData(event.target);

    // sending the form data to the server.js file
    const response = await fetch('/add-item', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.success) {
        // grabbing the updated data from data.json....
        const updatedData = await fetch('/data.json');
        const data = await updatedData.json();

        // and updatting the page tiles
        updateItemsOnPage(data);

        // calling closeForm function
        // function closes the form (wow)
        // and removes the light transparency filter
        closeForm();

    // otherwise.... print error
    } 
    else {
        alert('error: listing couldnt be added');
    }
}





/*
    this chunk actually adds the form content
    to a div (which is like a html tile)
    and then adds it to the home.html page
*/
async function updateItemsOnPage(items) {
    let cards = '';

    //looping through to add the details into each section
    items.forEach((item) => {
        cards += `
          <div class="box">
              <img src="${item.image}">
              <h4>${item.name}</h4>
              <h5>${item.price}</h5>
              <h6>${"Seller: " + item.author}</h6>
          </div>
        `;
    });

    //selects container in home.html file to add contents to it.
    const container = document.querySelector('.container');
    container.innerHTML = cards;
}





/*
    closing up the form submission screen
*/
function closeForm() {
    // hide it again when submit is pressed
    const form = document.getElementById('formElement');
    form.style.display = 'none';

    // removing the transparency that appears
    const overlay = document.querySelector('.overlay');
    document.body.removeChild(overlay);
}





//looking at the search bar. starts every time something is "input" in the search bar
document.getElementById('search').addEventListener('input', searchItems);

//function that searches for what has been typed in
//async because its waiting for "response" and "data"
async function searchItems(event) {

    //the text that the user has typed into the search bar
    const searchTerm = event.target.value.toLowerCase();

    //grabbing data from data.json
    const response = await fetch('/data.json');
    const data = await response.json();

    //filtering array
    //only showing contents that contains what the user has searched
    const filteredItems = data.filter(item => item.name.toLowerCase().includes(searchTerm));

    //update the contents based on what filteredItems shows
    updateItemsOnPage(filteredItems);
}

