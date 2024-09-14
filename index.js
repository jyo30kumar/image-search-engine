// Variables
const form = document.getElementById("form");
const searchText = document.getElementById("searchText");
const searchButton = document.getElementById("searchButton");
const gallery = document.getElementById("gallery");
const showMoreButton = document.getElementById("showMore");
const accessKey = "OvD3DL27msP46Wt-BMe-btImEl6rZzon-Ism3zAq2x0";
let resultFound = true;
let page = 1;
let imageArr = [];
let lastSearchTerm = "";
let lastPage;


// event listener
searchButton.addEventListener("mouseenter", toggleFormStyle);
searchButton.addEventListener("mouseleave", toggleFormStyle);
form.addEventListener("submit",async (event)=>{
    event.preventDefault();
    page = 1;
    imageReset();
    lastSearchTerm = searchText.value;
    await generateImage(lastSearchTerm);
    if(resultFound){
        gallery.classList.add("gallery");
        createImageElement();
        showMoreButton.classList.remove("hide");
    }else{
            gallery.classList.remove("gallery");
            showMoreButton.classList.add("hide");
            alert("No Result Found!");
    }
});
showMoreButton.addEventListener("click", async () =>{
    if(resultFound){
        lastPage = page++;
        await generateImage(lastSearchTerm);
        createImageElement();
        if(!resultFound){
                showMoreButton.classList.add("hide");
            }
    }
});


//function for changing color of form border and search background color
function toggleFormStyle(event) {
    const form = document.getElementById("form");
    const searchButton = document.getElementById("searchButton");

    if (event.type === "mouseenter") {
        form.classList.add("form-border-color");
        searchButton.classList.add("button-background-color");
    } else if (event.type === "mouseleave") {
        form.classList.remove("form-border-color");
        searchButton.classList.remove("button-background-color");
    }
}

//function for fetching image from unsplash API
async function generateImage(queryText) {
    
    // const queryText = searchText.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${queryText}&per_page=12&client_id=${accessKey}`;
    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Response Status ${response.status}`);
        }
        const data = await response.json();
        const results = data.results;        
        if(results.length === 0){
            resultFound = false;
            page = lastPage;
        }else{
            resultFound = true;
            imageArr = results.map((result) =>{
                const image = document.createElement('img');
                image.src= result.urls.small;
                image.alt = result.alt_description;
                const imageLink = document.createElement('a');
                imageLink.href = result.links.html;
                imageLink.target = "_blank";
                const imgDesc = document.createElement('div');
                imgDesc.classList.add("desc");
                imgDesc.innerHTML = result.alt_description;                
                return {image : image,imageLink : imageLink, imgDesc : imgDesc};
            }); 
        }               
    } catch (error) {
        console.log("Error Message : ", error.message);
    }
}

// function for creating image element 
function createImageElement(){
    imageArr.map((img) =>{
        img.imageLink.appendChild(img.image);
        img.imageLink.appendChild(img.imgDesc);        
        gallery.appendChild(img.imageLink);
    });
}

// function for reset image result 
function imageReset(){
    imageArr = [];
    gallery.innerHTML = '';
};