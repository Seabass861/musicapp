const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require("helmet");
const app = express();
const fileHandler = require('fs');
const bodyParser = require('body-parser');

require('isomorphic-fetch');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3001', 'https://intense-retreat-63877.herokuapp.com/'];
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))

// GET SEARCH RESULTS
app.get('/api/search/:term/:media', function (req, res) {

    var searchResults = {};

    fetch(`https://itunes.apple.com/search?term=${req.params.term}&media=${req.params.media}`)
        .then(res => res.json())
        .then(
            (result) => {
                searchResults = result;
                console.log(result);
                res.send(searchResults);
            },
            (error) => {
                console.log(error);
            }

        );

})

//GET SEARCH RESULTS - ONLY IF SEARCH IS EMPTY
app.get('/api/search/', function (req, res) {

    res.send({
        "resultCount": 0,
        "results": []
    })

})

// GET FAVOURITES
app.get('/api/favourites', function (req, res) {
    fileHandler.readFile('favourites.json', (err, data) => {
        if (err) res.send("No Web Projects Found.");
        else
            res.send(data);
    })
})

// ADD TO FAVOURITES
app.post('/api/favourites/', function (req, res) {


    fileHandler.readFile('favourites.json', (err, data) => {
        if (err) res.send("No Favourites Found.");
        else
            var allFavourites = {};
        allFavourites = JSON.parse(data);

        console.log(req.body);

        allFavourites.favourites.unshift(req.body);

        fileHandler.writeFile('favourites.json', JSON.stringify(allFavourites), (err) => {
            if (err) throw err;
            res.send(allFavourites);
        })
    })

})

// REMOVE TRACK FROM FAVOURITES LIST
app.delete('/api/favourites/:trackId', function (req, res) {

    fileHandler.readFile('favourites.json', (err, data) => {
        if (err) res.send("No Track with that ID was Found.");
        else
            var favouritesList = {};
        favouritesList = JSON.parse(data);



        for (i = 0; i < favouritesList.favourites.length; i++) {

            if (favouritesList.favourites[i].trackId == req.params.trackId) {
                favouritesList.favourites.splice(i, 1);
            }
        }

        fileHandler.writeFile('favourites.json', JSON.stringify(favouritesList), (err) => {
            if (err) throw err;
            res.send("Project removed");
        })
        res.json(favouritesList);
    })

})


app.use(function (err, req, res, next) {
    console.log(err.stack)
    res.status(500).send('Something broke!')
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});