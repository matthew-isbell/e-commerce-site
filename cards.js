/*
    this file displays the cards (the cards are just the listings)
*/

//when the file is completely loaded...
document.addEventListener('DOMContentLoaded', async () => {
    try {
        //grabbing the data in the json file
        const response = await fetch('/data.json');
        const data = await response.json();

        //adding the data to the updateItems function
        //essentially posting the data
        updateItemsOnPage(data);
    }
    //if it can't add the content, throw an error 
    catch (error) {
        console.error(error);
    }
});

