//Variables required for seatGeek
let state = 'CO'
let city = 'denver'
let perPage = 30
let page = 1
let startDate = '2023-08-09'
let endDate = '2023-08-25'
const clientId = 'client_id=MzU1MTEzMTF8MTY5MTQ1ODY0Mi45OTk0NA'
const clientSecret = 'client_secret=8eab9cae7143c435b6897a8ee23b044cc8152e61df06a4568d536acb71b31a12`'
const seatGeekSearchByCityURL = `https://api.seatgeek.com/2/events?venue.city=${city}&${clientId}&per_page=${perPage}&page=${page}&datetime_utc.gte=${startDate}&datetime_utc.lte=${endDate}`
const seatGeek = `https://api.seatgeek.com/2/events?${clientId}&${clientSecret}`

//Variables required for Open Weather
const openWeatherAPIKey = '853c7e45dec1706d5f746a46f8d87cf8'
let cityName = ''
let lat = 0
let lon = 0
let weatherByCoords = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid='+ openWeatherAPIKey + '&units=imperial'
let weatherByCity = 'https://api.openweathermap.org/data/2.5/forecast?q='+ cityName +'&appid='+ openWeatherAPIKey


//function to initiate fetch by city
function fetchEventsByCity(){
//grabbing the city by URL
//get the data from the form that the user inputs
//change variables to equal that form input
fetch(seatGeekSearchByCityURL)
.then(function(response){
   return response.json()
})
.then(function(data){
    console.log(data)
})
}

fetchEventsByCity(cityName)
