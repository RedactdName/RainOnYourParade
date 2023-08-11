//Variables required for seatGeek
const clientId = 'client_id=MzU1MTEzMTF8MTY5MTQ1ODY0Mi45OTk0NA'
const clientSecret = 'client_secret=8eab9cae7143c435b6897a8ee23b044cc8152e61df06a4568d536acb71b31a12`'
// const seatGeekSearchByCityURL = `https://api.seatgeek.com/2/events?venue.city=${city}&${clientId}&per_page=${perPage}&page=${page}&datetime_utc.gte=${startDate}&datetime_utc.lte=${endDate}`
// const seatGeek = `https://api.seatgeek.com/2/events?${clientId}&${clientSecret}`

//Variables required for Open Weather
const openWeatherAPIKey = '853c7e45dec1706d5f746a46f8d87cf8'
let cityName = ''
let lat = 0
let lon = 0
let weatherByCoords = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid='+ openWeatherAPIKey + '&units=imperial'
let weatherByCity = 'https://api.openweathermap.org/data/2.5/forecast?q='+ cityName +'&appid='+ openWeatherAPIKey

//variables to grab //recents changed
const startDateContainer = document.getElementById("start-date")
const endDateContainer = document.getElementById("end-date")
const cityContainer = document.getElementById("city")
const searchButton = document.getElementById("search-button")

//function to initiate fetch by city
function fetchEventsByCity(){
    let city = cityContainer.value
    let perPage = 30
    let page = 1
    let startDate = startDateContainer.value
    let endDate = endDateContainer.value 
    if(city == ''){
        city = 'Denver'
    }
    if(startDate == '')
    {
        startDate = '08-10-2023'
    }
    if(endDate == '')
    {
        endDate = '08-30-2023'
    }

fetch(`https://api.seatgeek.com/2/events?venue.city=${city}&${clientId}&per_page=${perPage}&page=${page}&datetime_utc.gte=${startDate}&datetime_utc.lte=${endDate}`)
.then(function(response){
   return response.json()
})
.then(function(data){
    // console.log(data)
    populateEvents(data)
})
}

// fetchEventsByCity(cityName) //recently changed
searchButton.addEventListener('click', function(event) {
    event.preventDefault()
    console.log('clicked')
    event.stopPropagation()//not right
    startDate = startDateContainer.value //all these are new
    endDate = endDateContainer.value
    city = cityContainer.value

    fetchEventsByCity()


    // console.log(fetchEventsByCity())
    
})
function populateEvents(data)
{

    //for loop
    //get the events name
    //get the events date
    //put it on the page in a ul
    //assign id using name of event
    //setAttribute("id", eventName + datetime_local) set class to bulma values for style
    console.log(data)
}

//need event listner
//need that event listener to get ID of item clicked
//when clicked we get that info from it, 

//gets coordinates from city name
function getCoords(cityName) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${openWeatherAPIKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let lat = data[0].lat;
            let lon = data[0].lon;
            getTodaysWeather(lat, lon);
            get5day(lat, lon);
        });
}
//gets todays weather
function getTodaysWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        populateWeather(data);
    });
}

//populates weather information
function populateWeather(data) {
    let currentTemp = data.main.temp;
    let humidity = data.main.humidity;
    let feelsLike = data.main.feels_like;
    let windspeed = data.wind.speed;
    let description = data.weather[0].description;
    let icon = data.weather[0].icon;

    const currentWeatherContainer = document.getElementById('current-weather-container')
    const pEl = document.createElement('p');
    const pEl2 = document.createElement('p');
    const ulEl = document.createElement('ul');
    const liEl1 = document.createElement('li');
    const liEl2 = document.createElement('li');
    const liEl3 = document.createElement('li');
    const liEl4 = document.createElement('li');

    pEl.textContent = currentTemp;
    pEl2.textContent = cityName;
    currentWeatherContainer.appendChild(pEl);
    currentWeatherContainer.appendChild(pEl2)

    liEl1.textContent = `Humidity: ${humidity}`;
    ulEl.appendChild(liEl1);

    liEl2.textContent = `Feels Like: ${feelsLike}`;
    ulEl.appendChild(liEl2);

    liEl3.textContent = `Wind Speed: ${windspeed}`;
    ulEl.appendChild(liEl3);

    liEl4.textContent = `Description: ${description}`;
    ulEl.appendChild(liEl4);

    ulEl.setAttribute("id", cityName )
    
    currentWeatherContainer.appendChild(ulEl);

    let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const imgEl = document.createElement('img');
    imgEl.setAttribute("src", iconUrl);
    currentWeatherContainer.appendChild(imgEl);
}

//gets 5 day forcast
function get5day(lat, lon, eventTime) {
    let urlByLatLon = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    fetch(urlByLatLon)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        const currentWeatherContainer = document.getElementById('current-weather-container')
        currentWeatherContainer.innerHTML = ''; 
        
            let forecastItem = data.list[eventTime];
            let forecastDateTime = new Date(forecastItem.dt * 1000);
            
            const forecastItemContainer = document.createElement('div');
            forecastItemContainer.classList.add('forecast-item');
            
            const pDateTime = document.createElement('p');
            pDateTime.textContent = forecastDateTime.toLocaleString() + ` ${cityName}`
            forecastItemContainer.appendChild(pDateTime);
            
            const ulEl = document.createElement('ul');
            
            const liEl1 = document.createElement('li');
            liEl1.textContent = `Temperature: ${forecastItem.main.temp}`;
            ulEl.appendChild(liEl1);

            const liEl2 = document.createElement('li');
            liEl2.textContent = `Humidity: ${forecastItem.main.humidity}`;
            ulEl.appendChild(liEl2);

            const liEl3 = document.createElement('li');
            liEl3.textContent = `Feels Like: ${forecastItem.main.feels_like}`;
            ulEl.appendChild(liEl3);

            const liEl4 = document.createElement('li');
            liEl4.textContent = `Wind Speed: ${forecastItem.wind.speed}`;
            ulEl.appendChild(liEl4);

            const liEl5 = document.createElement('li');
            liEl5.textContent = `Description: ${forecastItem.weather[0].description}`;
            ulEl.appendChild(liEl5);

            forecastItemContainer.appendChild(ulEl);

            const iconUrl = `https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@2x.png`;
            const imgEl = document.createElement('img');
            imgEl.setAttribute("src", iconUrl);
            forecastItemContainer.appendChild(imgEl);

            currentWeatherContainer.appendChild(forecastItemContainer);
        
    });
}
function getWeatherByDate(lat, lon, date){
    // Date in the `YYYY-MM-DD` format for which data is requested. Date available from 1979-01-02 up to the previous day before the current date.
    fetch(`https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=${date}&appid=${openWeatherAPIKey}`)
    .then(function(response){
       return response.json
    }).then(function(data){
        console.log(data)
     })

}



//To get weather info rightreturn date url datetime_local
