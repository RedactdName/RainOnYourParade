//Variables required for seatGeek
const clientId = 'client_id=MzU1MTEzMTF8MTY5MTQ1ODY0Mi45OTk0NA'
const clientSecret = 'client_secret=8eab9cae7143c435b6897a8ee23b044cc8152e61df06a4568d536acb71b31a12`'

//Variables required for Open Weather
const openWeatherAPIKey = '853c7e45dec1706d5f746a46f8d87cf8'

//variables to grab
const eventContainerSectionEl = document.createElement('section');
const weatherContainerSectionEl = document.createElement('section');
const weatherContainer = document.getElementById('weather-container')
const eventContainer = document.getElementById('event-container');
const startDateContainer = document.getElementById("start-date")
const endDateContainer = document.getElementById("end-date")
const cityContainer = document.getElementById("city")
const searchButton = document.getElementById("search-button")
let page = 1

//function to initiate fetch by city
function fetchEventsByCity() {

    //getting values from containers
    let city = cityContainer.value
    let perPage = 5
    let startDate = startDateContainer.value
    let endDate = endDateContainer.value
    //setting null check
    if (city == '') {
        city = 'Denver'
    }
    if (startDate == '') {
        startDate = '08-10-2023'
    }
    if (endDate == '') {
        endDate = '08-30-2023'
    }
    //fetching the events listing
    fetch(`https://api.seatgeek.com/2/events?venue.city=${city}&${clientId}&per_page=${perPage}&page=${page}&datetime_utc.gte=${startDate}&datetime_utc.lte=${endDate}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // calling populate events function with the jsoned data
            populateEvents(data)
        })


}
// the event listner for the search button
searchButton.addEventListener('click', function (event) {
    event.preventDefault()
    console.log('clicked')
    startDate = startDateContainer.value
    endDate = endDateContainer.value
    city = cityContainer.value
    historyHandler()
    //removes events that are in there
    while (eventContainerSectionEl.firstChild) {
        eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
    }

    fetchEventsByCity()
})

//puts events on page
function populateEvents(data) {

    eventContainerSectionEl.setAttribute('class', 'event-holder')
    //getting all needed info from the events
    for (let i = 0; i < data.events.length; i++) {
        //setting name and time
        let eventName = data.events[i].title;
        let eventDateTime = data.events[i].datetime_local
        let eventData = data.events[i]

        //creating the list item and adding text content
        let h1El = document.createElement('ul');
        let h2El = document.createElement('li');
        h1El.textContent = eventName;
        h1El.setAttribute('class', 'event-name')
        h2El.textContent = eventDateTime.split('T')
        h2El.setAttribute('class', 'event-date-time')
        h1El.setAttribute('class', 'searched-events')
        //adding the list item to the unordered list, we may change this later to be a section of its own instead of list item
        h1El.appendChild(h2El)
        eventContainerSectionEl.appendChild(h1El);

        // adding event listner to each of the li's.
        h1El.addEventListener('click', function () {
            //calling getcoords function for each event potentially we could simplify to only city, or expand to exact venue but IDK how to do that
            while (weatherContainerSectionEl.firstChild) {
                weatherContainerSectionEl.removeChild(weatherContainerSectionEl.firstChild);
            }
            return getCoords(data.events[i].venue.city, eventDateTime, eventData)

        })
        //just throwing it in the console to make sure it works
        console.log(data.events[i].datetime_local);
    }
    //appending the unoredered list to the weather container, need britanny to help me make it look good
    eventContainer.appendChild(eventContainerSectionEl);
}
//gets coordinates from city name
function getCoords(cityName, eventDateTime, eventData) {
    //fetching the coords, passing eventDateTime to push through in a seperate function
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${openWeatherAPIKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //only calling most popular option, maybe play with later to get multiple city options
            let lat = data[0].lat;
            let lon = data[0].lon;
            //calling function now that I am getting the data I need
            getWeatherByDate(lat, lon, eventDateTime, eventData);
        });
}
// Updated function to get weather by date and time
function getWeatherByDate(lat, lon, eventDateTime, eventData) {
    //fetching by coords
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${openWeatherAPIKey}&units=imperial`)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            // getting hours from event by calling function
            const eventHour = extractHours(eventDateTime);

            // setting function to null so it doesnt store data
            let weatherForEventHour = null;

            // Loop through each hour's data to find a match
            for (let hourData of data.hourly) {

                // formats the time right
                const hourDataTime = new Date(hourData.dt * 1000);

                // if it matches the events hour
                if (hourDataTime.getHours() === eventHour) {
                    //save weather data
                    weatherForEventHour = hourData;
                }
            }
            //logging what we got
            if (weatherForEventHour) {
                populateWeather(weatherForEventHour, eventData)
            } else {
                //if there isnt any data
                console.log("Couldn't find weather data for the specified event hour.");
            }
        });
}
//getting hours out of the date
function extractHours(dateTime) {
    //gets time passed to it and sets time
    const dt = new Date(dateTime);

    //returning the hours of the dt
    return dt.getHours();
}

//Event Listners for next page button
const paginationNext = document.querySelector(".pagination-next")
const pageNumber = document.getElementById("page-number")
const paginationPrevious = document.querySelector(".pagination-previous")
paginationNext.addEventListener("click", function (event) {
    page++
    pageNumber.textContent = page
    console.log(eventContainerSectionEl)
    while (eventContainerSectionEl.firstChild) {
        eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
    }
    console.log(page)
    fetchEventsByCity()
})
//event listner for previous button
paginationPrevious.addEventListener('click', function (event) {
    if (page > 1) {
        page--;
        pageNumber.textContent = page
        while (eventContainerSectionEl.firstChild) {
            eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
        }
        console.log(page)
        fetchEventsByCity();
    } else {
        console.log("You're on the first page, can't go back further!");
    }
});

//function called to populate weather, holds data for events to populate
function populateWeather(weatherForEventHour, eventData) {
    //variables for function
    let weatherDescription = weatherForEventHour.weather[0].description
    let weatherTemp = weatherForEventHour.temp
    let windSpeed = weatherForEventHour.wind_speed
    let eventName = eventData.title
    let eventTime = eventData.datetime_local.split('T')
    let eventURL = eventData.url
    let icon = weatherForEventHour.weather[0].icon
    let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    //creating the elements I will need on the page
    const eventEl1 = document.createElement('li')
    const eventEl2 = document.createElement('li')
    const eventEl3 = document.createElement('li')
    const imgEl = document.createElement('img');
    const weatherEl1 = document.createElement('li')
    const weatherEl2 = document.createElement('li')
    const weatherEl3 = document.createElement('li')


    //console.log delete on full launch
    console.log(weatherForEventHour)
    console.log(eventData)
    console.log(eventURL)

    //setting classes to make the formating easier
    weatherContainerSectionEl.setAttribute('class', 'weather-for-event')
    eventEl1.setAttribute('id', 'event-name-popup')
    eventEl2.setAttribute('id', 'element-time-popup')
    eventEl3.setAttribute('id', 'element-url-popup')
    imgEl.setAttribute("src", iconUrl);
    weatherEl1.setAttribute('id', 'weather-description')
    weatherEl2.setAttribute('id', 'weather-temp')
    weatherEl3.setAttribute('id', 'wind-speed')

    //setting text content
    eventEl1.textContent = eventName
    eventEl2.textContent = eventTime
    eventEl3.textContent = eventURL
    weatherEl1.textContent = weatherDescription
    weatherEl2.textContent = weatherTemp
    weatherEl3.textContent = windSpeed

    //appending
    weatherContainerSectionEl.appendChild(eventEl1)
    weatherContainerSectionEl.appendChild(eventEl2)
    weatherContainerSectionEl.appendChild(eventEl3)
    weatherContainerSectionEl.appendChild(eventEl3)
    weatherContainerSectionEl.appendChild(imgEl)
    weatherContainerSectionEl.appendChild(weatherEl1)
    weatherContainerSectionEl.appendChild(weatherEl2)
    weatherContainerSectionEl.appendChild(weatherEl3)
    weatherContainer.appendChild(weatherContainerSectionEl)
}

//handles the local storage stuff
function localStorageHandler() {
    var currentCity = cityContainer.value;
    if (currentCity == '') {
        currentCity = 'Denver';
    }

    // Get item from local storage
    var storedData = localStorage.getItem('city');
    var localStorageArray;

    // Check if storedData is not null and calls function to make sure data is valid
    if (storedData && isValidJSON(storedData)) {
        localStorageArray = JSON.parse(storedData);
    } else {
        // If not valid or not set, default to an empty array
        localStorageArray = [];
    }

    // If there are already 5 cities, remove the first
    if (localStorageArray.length >= 5) {
        localStorageArray.shift();
    }

    // Push the current city to the array
    localStorageArray.push(currentCity);

    // Convert array to string and save back to localStorage
    localStorage.setItem('city', JSON.stringify(localStorageArray));

    return localStorageArray;
}

//function to check if a string is valid JSON
function isValidJSON(str) {
    //how this works I have no clue
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

//this is where we should append citys
function historyHandler() {
    var cities = localStorageHandler();
    console.log(cities);
    var listItem1 = document.getElementById('list-item-1');
    var listItem2 = document.getElementById('list-item-2')
    var listItem3 = document.getElementById('list-item-3')
    var listItem4 = document.getElementById('list-item-4')
    var listItem5 = document.getElementById('list-item-5')

    listItem1.textContent = cities[0]
    listItem2.textContent = cities[1]
    listItem3.textContent = cities[2]
    listItem4.textContent = cities[3]
    listItem5.textContent = cities[4]
    listItem1.addEventListener("click",function(){
        cityContainer.value = listItem1.textContent
        console.log(cityContainer.value)
        while (eventContainerSectionEl.firstChild) {
            eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
        }
        fetchEventsByCity()
        
        
    })
    listItem2.addEventListener("click",function(){
        cityContainer.value = listItem2.textContent
        while (eventContainerSectionEl.firstChild) {
            eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
        }
        fetchEventsByCity()
        
    })
    listItem3.addEventListener("click",function(){
        cityContainer.value = listItem3.textContent
        while (eventContainerSectionEl.firstChild) {
            eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
        }
        fetchEventsByCity()
        
    })
    listItem4.addEventListener("click",function(){
        cityContainer.value = listItem4.textContent
        while (eventContainerSectionEl.firstChild) {
            eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
        }
        fetchEventsByCity()
        
    })
    listItem5.addEventListener("click",function(){
        cityContainer.value = listItem5.textContent
        while (eventContainerSectionEl.firstChild) {
            eventContainerSectionEl.removeChild(eventContainerSectionEl.firstChild);
        }
        fetchEventsByCity()
        
    })
}

document.addEventListener("DOMContentLoaded", historyHandler);

