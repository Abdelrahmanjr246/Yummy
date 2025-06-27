let rowData = $('#rowData');
let searchBar =$('#searchBar');
let fullLoader = $('.loading');
let loader = $('.inner-loading');
$(document).ready(() => {
    fullLoader.fadeOut(300);
});


const sideNavContentWidth = $('.nav-content').outerWidth();
$('.side-nav').animate({left: -sideNavContentWidth},400)
$('.nav-content li').animate({top:500}, 500)

$('.side-nav i.open-close-icon').on('click',()=>{

    if ($('.side-nav').css('left') == '0px') {
        $('.side-nav').animate({left: -sideNavContentWidth},1000)
        $('.open-close-icon').addClass('fa-bars')
        $('.open-close-icon').removeClass('fa-x')

        let len = $('.nav-content li').length;
        for (let i = len -1 ; i >= 0 ; i--) {
            $('.nav-content li').eq(i).stop(true).animate({ top: 500 }, (len - i) * 300);
        } 
    }
    else{
        $('.side-nav').animate({left: 0},1000)
        $('.open-close-icon').removeClass('fa-bars')
        $('.open-close-icon').addClass('fa-x')

        for (let i = 0; i < $('.nav-content li').length; i++) {
            $('.nav-content li').eq(i).stop(true).animate({top:0}, (i+1)* 400)
        }   
    }
})

// homeee

async function searchByName(term){
    loader.fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    response = await response.json();
    response.meals ? displayMeals(response.meals) : displayMeals([]); ;
    loader.fadeOut(300);
}
function displayMeals(arr){
    let cartona = '';
    if (!arr || arr.length === 0) {
        cartona = `<div class="text-center text-danger fs-4">No meals found.</div>`;
    }else{
            for(let i =0; i < arr.length; i++){
                cartona +=`
                    <div class="col-md-3">
                        <div onclick='getMealDetails("${arr[i].idMeal}")' class="meal position-relative overflow-hidden rounded-2">
                            <img src="${arr[i].strMealThumb}" class="w-100" alt="">
                            <div class="layer text-black d-flex justify-content-center align-items-center position-absolute">
                                <h3>${arr[i].strMeal}</h3>
                            </div>
                        </div>       
                    </div>
                `
            }
        }
    
    rowData.html(cartona);
}
searchByName('')


// getCategories
async function getCategories() {
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    searchBar.html('');
    loader.fadeIn(300);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    response = await response.json();
    displayCategories(response.categories);
    loader.fadeOut(300);
}
function displayCategories(arr){
    let cartona ='';
    for(let i =0; i < arr.length; i++){
        cartona +=`
            <div class="col-md-3">
                <div onclick='getSpecificCategoryMeals("${arr[i].strCategory}")' class="meal position-relative overflow-hidden rounded-2">
                    <img src="${arr[i].strCategoryThumb}" class="w-100" alt="">
                    <div class="layer text-black d-flex flex-column text-center position-absolute p-1">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>       
            </div>
        `
    }
    rowData.html(cartona);
}


// getArea
async function getArea(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    searchBar.html('');
    loader.fadeIn(300);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    response = await response.json();
    displayArea(response.meals);
    loader.fadeOut(300);
}
function displayArea(arr){
    let cartona = '';
    for(let i =0; i < arr.length; i++){
        cartona +=`
            <div class="col-md-3 mt-4">
                <div onclick= 'getSpecificAreaMeals("${arr[i].strArea}")' class="meal position-relative overflow-hidden rounded-2 d-flex flex-column justify-content-between align-items-center">
                    <i class="fa-solid fa-kitchen-set fa-4x"></i>
                    <h3>${arr[i].strArea}</h3>
                </div>       
            </div>
        `
    }
    rowData.html(cartona);
}


// getIngredients
async function getIngredients() {
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    searchBar.html('');
    loader.fadeIn(300);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    response = await response.json();
    displayIngredients(response.meals.slice(0,20));
    loader.fadeOut(300);
}
function displayIngredients(arr){
    let cartona = '';
    for(let i =0; i < arr.length; i++){
        let desc = arr[i].strDescription;
        let shortDesc = desc ? desc.split(" ").slice(0, 15).join(" ") + "..." : "No description available.";
        cartona +=`
            <div class="col-md-3 mt-4">
                <div onclick ='getSpecificIngredientMeals("${arr[i].strIngredient}")'class="meal position-relative overflow-hidden rounded-2 d-flex flex-column justify-content-between align-items-center text-center">
                    <i class="fa-solid fa-bowl-food fa-4x"></i>
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${shortDesc}</p>
                </div>       
            </div>
        `
    }
    rowData.html(cartona);
}

// getSpecificCategoryMeals
async function getSpecificCategoryMeals(categoryName) {
    loader.fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
    response = await response.json();
    displayMeals(response.meals);
    loader.fadeOut(300);
}
// getSpecificAreaMeals
async function getSpecificAreaMeals(areaName) {    
    loader.fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
    response = await response.json();
    displayMeals(response.meals);
    loader.fadeOut(300);
}
// getSpecificIngredientMeals
async function getSpecificIngredientMeals(ingredientName) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
    response = await response.json();
    displayMeals(response.meals);
}

// getMealDetails
async function getMealDetails(mealId) {
    searchBar.html('');
    loader.fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    response = await response.json();
    displayMealDetails(response.meals[0]);
    loader.fadeOut(300);
}
function displayMealDetails(meal){

    let ingredients = [];
    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`] && meal[`strIngredient${i}`] !== ""){
            ingredients +=`<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal?.strTags?.split(",");
    if(!tags) tags = [];
    let tagsStr = '';
    for(let i = 0; i < tags.length; i++){
        tagsStr += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }

    let cartona =`
        <div class="col-md-4">
            <img src="${meal.strMealThumb}" class="w-100">
            <h3 class='text-center'>${meal.strMeal}</h3>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h4><span class='fw-bolder'>Area :</span> ${meal.strArea}</h4>
            <h4><span class='fw-bolder'>Category :</span> ${meal.strCategory}</h4>
            <h4>Recipes :</h4>
            <p>
                <ul class="list-unstyled d-flex flex-wrap gap-1">
                    ${ingredients}
                </ul>
            </p>
            <h4>Tags :</h4>
            <p>
                <ul class="list-unstyled d-flex flex-wrap gap-1">
                    ${tagsStr}
                </ul>
            </p>
            <p class="d-flex flex-wrap gap-2 mt-4">
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </p>
        </div>
    `
    rowData.html(cartona);
}

// search
async function searchPage(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    rowData.html('');
    search = `
        <div class="row p-4 justify-content-center">
            <div class="col-md-5">
                <input onkeyup='searchByName(this.value)' type="text" class="form-control search-input bg-custom text-white" placeholder="Search By Name">
            </div>
            <div class="col-md-5">
                <input onkeyup='searchByFirstLetter(this.value)' maxlength="1" type="text" class="form-control search-input bg-custom text-white" placeholder="Search By First Letter">
            </div>
        </div>
    `
    searchBar.html(search);
}

async function searchByFirstLetter(term){
    term ==''? term = 'a':'';
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    response = await response.json();
    response.meals ? displayMeals(response.meals) : displayMeals([]); ;
}


// contact
function contactPage() {
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    searchBar.html('');
    rowData.html(`
        <div class="container text-center pt-5">
        <h2 class="text-center py-5">Contact Us</h2>
        <div class="row pt-5 px-5 justify-content-center">
            <div class="col-md-5">
                <input onkeyup="inputsValidation()" id='nameInput' type="text" class="form-control mb-3" placeholder="Enter Your Name">
                <p id='nameMsg' class="text-danger d-none">Special characters and numbers not allowed</p>
            </div>
            <div class="col-md-5">
                <input onkeyup="inputsValidation()" id='emailInput' type="email" class="form-control mb-3" placeholder="Enter Your Email">
                <p id='emailMsg' class="text-danger d-none">Please enter a valid Emai "exemple@yyy.zzz"</p>
            </div>
            <div class="col-md-5">
                <input onkeyup="inputsValidation()" id='phoneInput' type="text" class="form-control mb-3" placeholder="Enter Your Phone">
                <p id='phoneMsg' class="text-danger d-none">Please enter a valid phone number</p>
            </div>
            <div class="col-md-5">
                <input onkeyup="inputsValidation()" id='ageInput' type="number" class="form-control mb-3" placeholder="Enter Your Age">
                <p id='ageMsg' class="text-danger d-none">Please enter a valid age</p>
            </div>
            <div class="col-md-5">
                <input onkeyup="inputsValidation()" id='passwordInput' type="password" class="form-control mb-3" placeholder="Enter Your Password">
                <p id='passwordMsg' class="text-danger d-none">Password must be at least 8 characters & at least 1 letter & 1 number</p>    
            </div>
            <div class="col-md-5">
                <input onkeyup="inputsValidation()" id='repasswordInput' type="password" class="form-control mb-3" placeholder="Confirm Your Password">
                <p id='repasswordMsg' class="text-danger d-none">Please enter a valid password</p>
            </div>
        </div>
            <button id="submitBtn" disabled='' class="btn btn-outline-danger px-2 mt-3 ">Submit</button>
    </div>    
    `)    
}

function inputsValidation() {

    if( nameValidation()&&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
            $('#submitBtn').removeAttr('disabled');
    }
    else {
        $('#submitBtn').attr('disabled', true);
    }
}
function nameValidation() {
    const nameRegex = /^[A-Za-z]{2,}(?: [A-Za-z]{2,})*$/;
    if(nameRegex.test($('#nameInput').val())){
        $('#nameInput').removeClass('is-invalid').addClass('is-valid');
        $('#nameMsg').addClass('d-none');
        return true;
    }else{
        $('#nameInput').removeClass('is-valid').addClass('is-invalid');
        $('#nameMsg').removeClass('d-none');
        return false;
    }
}
function emailValidation() {
    const nameRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    if(nameRegex.test($('#emailInput').val())){
        $('#emailInput').removeClass('is-invalid').addClass('is-valid');
        $('#emailMsg').addClass('d-none');
        return true;
    }else{
        $('#emailInput').removeClass('is-valid').addClass('is-invalid');
        $('#emailMsg').removeClass('d-none');
        return false;
    }
}
function phoneValidation() {
    const nameRegex = /^\+?[0-9]{10,15}$/;
    if(nameRegex.test($('#phoneInput').val())){
        $('#phoneInput').removeClass('is-invalid').addClass('is-valid');
        $('#phoneMsg').addClass('d-none');
        return true;
    }else{
        $('#phoneInput').removeClass('is-valid').addClass('is-invalid');
        $('#phoneMsg').removeClass('d-none');
        return false;
    }
}
function ageValidation() {
    const nameRegex = /^[1-9][0-9]?$/;
    if(nameRegex.test($('#ageInput').val())){
        $('#ageInput').removeClass('is-invalid').addClass('is-valid');
        $('#ageMsg').addClass('d-none');
        return true;
    }else{
        $('#ageInput').removeClass('is-valid').addClass('is-invalid');
        $('#ageMsg').removeClass('d-none');
        return false;
    }
}
function passwordValidation() {
    const nameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if(nameRegex.test($('#passwordInput').val())){
        $('#passwordInput').removeClass('is-invalid').addClass('is-valid');
        $('#passwordMsg').addClass('d-none');
        return true;
    }else{
        $('#passwordInput').removeClass('is-valid').addClass('is-invalid');
        $('#passwordMsg').removeClass('d-none');
        return false;
    }
}
function repasswordValidation() {
    const password = $('#passwordInput').val();
    const repassword = $('#repasswordInput').val();

    if (password === repassword) {
        $('#repasswordInput').removeClass('is-invalid').addClass('is-valid');
        $('#repasswordMsg').addClass('d-none');
        return true;
    } else {
        $('#repasswordInput').removeClass('is-valid').addClass('is-invalid');
        $('#repasswordMsg').removeClass('d-none');
        return false;
    }
}
