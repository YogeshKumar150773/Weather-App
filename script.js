const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessButton = document.querySelector("[data-grantAccess]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


//initially variables needed ????

let oldTab = userTab;
const API_KEY = "insert your api key here";
oldTab.classList.add("current-tab")
getFromSessionStorage();



function switchTab(newTab) {

    if (newTab != oldTab) {

        oldTab.classList.remove("current-tab");
        
        oldTab = newTab;

        oldTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")) {           // ! => This is symbol of not (negation), search form does not contains active

            // If search form container is invisible, if yes then make it visible

            userInfoContainer.classList.remove("active");

            grantAccessContainer.classList.remove("active");

            searchForm.classList.add("active");

        }

        else {

            // We were on search tab before now we want to go to your weather tab

            searchForm.classList.remove("active");

            userInfoContainer.classList.remove("active");

            //NOw we are on your weather tab , so we must display weather also. So let's check local storage first
            // for coordinates

            getFromSessionStorage ();

        }

    }

}

userTab.addEventListener('click', () => {

    //pass clicked tab as input parameter

    switchTab(userTab);

});

searchTab.addEventListener('click', () => {

    //pass clicked tab as input parameter

    switchTab(searchTab);

});


//check if coordinates are already present in session storage

function getFromSessionStorage() {

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates) {

        //if we dont have local coordinates

        grantAccessContainer.classList.add("active");

    }

    else {

        const coordinates = JSON.parse(localCoordinates);

        fetchUserWeatehrInfo(coordinates);

    }

}

async function fetchUserWeatehrInfo(coordinates) {

    const {lat, lon} = coordinates;

    //make grant container invisible

    grantAccessContainer.classList.remove("active");

    //make loader visible

    loadingScreen.classList.add("active");

    // API CALL

    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");


        renderWeatherInfo(data);

    }

    catch (err) {

        loadingScreen.classList.remove("active");

        

    }

}

function renderWeatherInfo(weatherInfo) {

    //firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");

    const countryIcon = document.querySelector("[data-countryIcon]");

    const desc = document.querySelector("[data-weatherDesc]");

    const weatherIcon = document.querySelector("[data-weatherIcon]");

    const temp = document.querySelector("[data-temp]");

    const windspeed = document.querySelector("[data-windspeed]");

    const humidity = document.querySelector("[data-humidity]");

    const cloudiness = document.querySelector("[data-cloudiness]");



    // fetch values from weather info object and put in UI elements

    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    
    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp} °C`;

    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

    humidity.innerText = `${weatherInfo?.main?.humidity} %`;

    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);

    }

    else {

        alert ("No Geolocation Support Available");

    }

}

function showPosition (position) {

    const userCoordinates = {

        lat: position.coords.latitude,

        lon: position.coords.longitude

    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatehrInfo(userCoordinates);

}

grantAccessButton.addEventListener('click', getLocation);



const searchInput = document.querySelector("[data-searchInput]")

searchForm.addEventListener('submit', (e) => {

    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "") {

        return;

    }

    else {

        fetchSearchWeatherInfo(cityName);

    }

});

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");

    grantAccessContainer.classList.remove("active");


    try {
       
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    } 
    
    catch (err) {
       
        console.log(err)

    }

}
