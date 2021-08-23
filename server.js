const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const pgp = require('pg-promise')()
const connectionString = 'postgres://localhost:5432/trip'
const db = pgp(connectionString)


const app = express()

const users = [{ usersname: 'jonedoe', password: 'password' }]

let trips = [{
    taskID: 1,
    title: 'Duluth',
    dateOfDeparture: '16/08/2021',
    dateOfReturn: '16/09/2021',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'

}]


app.set('views', './views')
app.use(express.urlencoded())

app.use(session({
    secret: 'THISISSECRERKEY',
    saveUninitalized: true,
    resave: true
}))
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')

function logMiddleware(req, res, next) {
    console.log('Logged')
    next()
}

app.use(logMiddleware)

app.get('/trips', (req, res) => {

    res.render('index', { allTrips: trips })
})

app.post('/add-trip', (req, res) => {

    const tripTitle = req.body.tripTitle
    const tripimageUrl = req.body.tripimageUrl
    const tripdateOfDeparture = req.body.tripdateOfDeparture
    const tripdateOfReturn = req.body.tripdateOfReturn

    let trip = { title: tripTitle, imageUrl: tripimageUrl, dateOfDeparture: tripdateOfDeparture, dateOfReturn: tripdateOfReturn }

    trips.push(trip)
    res.redirect('/trips')
})


app.get('/', (req, res) => {
    res.render('index.mustache')
})

// app.post('/login', (req, res) => {
//     const username = req.body.username
//     const password = req.body.password
//     const registerdUser = users.find(user => {
//         return user.username == username && user.password == password
//     })
//     if (registedUser) {
//         req.session.username = registedUser.username
//     }
//     res.redirect('/login')
// } else {
//     res.render('login', { errorMessage: 'username or password incorrect' })
// })



app.get('/register', (req, res) => {
    res.render('register')

})





app.post('/login', (req, res) => {

})

app.post('/register', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password
})

app.get('/', (req, res) => {
    db.any('SELECT trip_title, date_of_departure, date_of_return, trip_image_url  FROM trps')
        .then(trips => {
            res.render('index', { alltrips: trips })
        })
})

app.post('/add-trip', (req, res) => {

    console.log(req.body)


    const tripTitle = req.body.tripTitle
    const tripimageUrl = req.body.tripimageUrl
    const tripdateOfDeparture = req.body.tripdateOfDeparture
    const tripdateOfReturn = req.body.tripdateOfReturn

    db.none('INSERT INTO  trips(trip_title, date_of_departure, date_of_return, trip_image_url) VALUES($1, $2, $3,$4, )', [tripTitle, tripimageUrl, tripdateOfDeparture, tripdateOfReturn])
        .then(() => {
            res.redirect('/')
        })
})











app.listen(3000)