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

//puts events on page
function populateEvents(data) {
    const ulEl = document.createElement('ul');
    const weatherContainer = document.getElementById('weather-container');
    
    //still the same forloop Lisa worked on, didn't modify
    for (let i = 0; i < data.events.length; i++) {
        let eventName = data.events[i].title;
        let eventDate = data.events[i].datetime_local.split("T")[0]; // extracting the date from the datetime
        
        let liEl = document.createElement('li');
        liEl.textContent = eventName;
        ulEl.appendChild(liEl);

        // this is a proof of concept to make sure it works, it is listing out weather for every event
        //Should NOT be in for loop
        getCoords(data.events[i].venue.city, eventDate);
    }
    weatherContainer.appendChild(ulEl);
    console.log(data);
}


//gets coordinates from city name
function getCoords(cityName, eventDate) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${openWeatherAPIKey}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let lat = data[0].lat;
            let lon = data[0].lon;
            //Passing to get weather by date
            getWeatherByDate(lat, lon, eventDate);
        });
}

//handles weather info, a lot easier than doing it by date
function getWeatherByDate(lat, lon, date){
    fetch(`https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=${date}&appid=${openWeatherAPIKey}`)
    .then(function(response){
       return response.json();
    }).then(function(data){
        // weather logging
        console.log(data);
     });
}



