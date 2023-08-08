//curl https://api.seatgeek.com/2/events?client_id=MzU1MTEzMTF8MTY5MTQ1ODY0Mi45OTk0NA

const seatGeek = `https://api.seatgeek.com/2/events?client_id=MzU1MTEzMTF8MTY5MTQ1ODY0Mi45OTk0NA&client_secret=8eab9cae7143c435b6897a8ee23b044cc8152e61df06a4568d536acb71b31a12`

function tempname(){
fetch(seatGeek)
.then(function(response){
   return response.json()
})
.then(function(data){
    console.log(data)
})
}

tempname()
