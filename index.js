
// const API_key='e9de60007bb59f4ad835951f718491c6';
// async function fetchWeatherInformation(){
//    try{
//     let city="karad";
//      const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`)
//      const data= await response.json();
//     console.log("weather data:->",data);
//    }
//    catch(e){ 
//     console.log("error occured",e);
//    }
// }
// async function getCustomWeather(){
//     try{
//         let latitude=17.77;
//     let longitude=74.1844;
//     let results= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`);
//      let data= await results.json();
//      console.log(data);
//     }
//     catch(e){

//     }
// }



//weather app starting

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const userContainer = document.querySelector(".weather-container");
const searchForm= document.querySelector("[data-searchForm]");
const lodingScreen = document.querySelector(".loding-container");
const userInfo = document.querySelector(".user-info-container");


let currentTab =userTab;
const API_key='e9de60007bb59f4ad835951f718491c6';

currentTab.classList.add("current-tab");
getFromSessionStorage();
//adding event listner to youe weather and search weather
userTab.addEventListener('click',()=>{
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})

//tab switching ,to switch a tab we should know on which tab we had clicked
// for that add event listner on both tabs ,
function switchTab(clickedTab){
   if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active"))
    {
        //ie i am on the your weather tab and i had clicked on search weather
        // so we need to add the search tab and remove grantAccess and weather info
        grantAccessContainer.classList.remove("active");
        userInfo.classList.remove("active");
        searchForm.classList.add("active");
    }else{
       //i am on search weather tab ie i have to remove the search tab and add user weather
       userInfo.classList.remove("active");
       searchForm.classList.remove("active");
       noCity.classList.remove("active");
       //now we at your weather
       getFromSessionStorage();
    }
   }
}



function getFromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates")

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        console.log(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lan}=coordinates;
    lodingScreen.classList.add("active");
    try{
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lan}&appid=${API_key}`);
        const data = await response.json();

        console.log(data);
        lodingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        lodingScreen.classList.remove("active");
    }
}

function  renderWeatherInfo(data){
    const cityName =document.querySelector("[data-cityName]")
    const countryIcon=document.querySelector("[data-countryIcon]")
    const desc =document.querySelector("[data-weatherDesc]")
    const weatherIcon =document.querySelector("[data-weatherIcon]")
    const temp =document.querySelector("[data-temp]")
    const windspeed =document.querySelector("[data-windSpeed]")
    const humidity =document.querySelector("[data-humidity]")
    const cloudness =document.querySelector("[data-cloudyness]")
    const countryName=document.querySelector("[data-country]")

    //fetch the weather information from the DATA object
        
    cityName.innerText= data?.name
   countryIcon.src =`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
   desc.innerText =data?.weather?.[0]?.description;
   weatherIcon.src =`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
   temp.innerText= `${Math.floor((data?.main?.temp)/10)}°C`;
   windspeed.innerText=`${data?.wind?.speed}m/s`;
   humidity.innerText= `${data?.main?.humidity}%`;
   cloudness.innerText=`${data?.clouds?.all}%`;
   countryName.innerText =data?.sys?.country;

   console.log(countryIcon.src);
    
}

const grantAccessButton =document.querySelector("[data-grantAccess]")

grantAccessButton.addEventListener('click',getLocation);
 
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        //show an error that geolocation does not support
    }
}

function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lan: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    grantAccessContainer.classList.remove("active")
    fetchUserWeatherInfo(userCoordinates);
}


const searchInput =document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName =searchInput.value;
    console.log(cityName);

    if(cityName==="")
     {
        return;
      }else{
        fetchSearchWeatherInfo(cityName);
     }
})

async function fetchSearchWeatherInfo(city){
         lodingScreen.classList.add("active");
         userInfo.classList.remove("active");
         grantAccessContainer.classList.remove("active");
    console.log(city);
         try{
            noCity.classList.remove("active");
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`)
             const data = await response.json();
             console.log(response.status);
           
             if(response.status===404)
             {
                // alert('city not found');
                lodingScreen.classList.remove("active")
                ///tu he kdun taknar ahe
                noCity.classList.add("active");
    

             }else{
               
                console.log(data);
             lodingScreen.classList.remove("active");
             userInfo.classList.add("active");
             renderWeatherInfo(data);
             }
             

         }catch(e){
           console.log('error found',e);
         }
}


const noCity =document.querySelector("[city-not-found]");


