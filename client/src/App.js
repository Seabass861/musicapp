import React, { Component } from 'react';
import './App.css';
import logo from './musicapplogo.svg';

import Favourites from './components/Favourites';
import SearchResults from './components/SearchResults';



// Show Search Results
function showSearchResults() {
    var searchResultsContainer = document.getElementById("search-results-container");
    searchResultsContainer.style.display = "block";
}
// Change Button To Added
function addedButton(pressedButton) {
    pressedButton.classList.add('added');
    pressedButton.innerHTML = 'Added';
    pressedButton.disabled = true;
}


class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.removeFavouriteHandler = this.removeFavouriteHandler.bind(this);
        this.addFavouriteHandler = this.addFavouriteHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
        this.selectChangeHandler = this.selectChangeHandler.bind(this);
        this.state = {
            error: null,
            isLoaded: false,
            value: "",
            message: "",
            searchResults: {
                resultCount: 0,
                results: []
            },
            searchTerm: ' ',
            searchMedia: 'all',
            favourites: []
        };

    }

    // Search Form Input Changes Handler
    handleChange(event) {

        this.setState({
            searchTerm: event.target.value

        });

    }

    // Search Form Select Changes Handler
    selectChangeHandler(event) {

        this.setState({
            searchMedia: event.target.value
        });

    }

    // ADD ITEM TO FAVOURITES HANDLER
    addFavouriteHandler(event) {

        let searchResults = this.state.searchResults.results;
        let clickedTrackToAdd = event.target.getAttribute('data-key');

        let favouriteToAdd = {};

        for (let i = 0; i < searchResults.length; i++) {
            if (searchResults[i].trackId == clickedTrackToAdd) {
                favouriteToAdd = searchResults[i];
            }
        }

        fetch(`/api/favourites/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(favouriteToAdd) })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        favourites: result.favourites,
                        isLoaded: true
                    });

                },
                (error) => {
                    console.log(error);
                    this.setState({
                        error
                    });
                }
            )

        addedButton(event.target);
    }


    // Remove Item From Favourites Handler
    removeFavouriteHandler(e) {

        console.log(e.target.getAttribute('data-key'))

        fetch(`/api/favourites/${e.target.getAttribute('data-key')}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        favourites: result.favourites,
                        message: "Track has been removed."
                    });

                },
                (error) => {
                    console.log(error);
                    this.setState({
                        error
                    });
                }
            )

    }

    // Search Submit Handler
    searchHandler(event) {

        event.preventDefault();

        let searchInput = this.state.searchTerm;
        let searchMedia = this.state.searchMedia;

        if (searchInput == '') {
            searchInput = ' ';
        }

        fetch(`/api/search/${searchInput}/${searchMedia}`)
            .then(res => res.json())
            .then(
                (result) => {

                    this.setState({
                        searchResults: result
                    });
                    // console.log(this.state.searchResults);
                    showSearchResults();
                },
                (error) => {
                    console.log(error);
                    this.setState({
                        error
                    });
                }
            )
    }


    // Get Favourites on Initial Mount
    componentDidMount() {

        fetch("/api/favourites")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        favourites: result.favourites,
                        isLoaded: true
                    }

                    );
                },
                (error) => {
                    console.log(error);
                    this.setState({
                        error
                    });
                }
            )

    }


    render() {


        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div className="App">
                    <div className="spinner-grow text-light" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        } else
            return (
                <div className="App">



                    <div className="container">

                        <img id="main-logo" src={logo} alt="Music App Logo" />

                        {/* SEARCH FORM */}

                        <form onSubmit={this.searchHandler}>
                            <div className="form-row">
                                <div className="col-12 col-sm-7 mb-3">
                                    <input type="text" className="form-control" placeholder="Search.." onChange={this.handleChange} />
                                </div>
                                <div className="col-12 col-sm-3 mb-3">
                                    <select className="form-control" onChange={this.selectChangeHandler}>
                                        <option value="all">All</option>
                                        <option value="movie">Movie</option>
                                        <option value="podcast">Podcast</option>
                                        <option value="music">Music</option>
                                        <option value="musicVideo">Music Video</option>
                                        <option value="audiobook">Audio Book</option>
                                        <option value="shortFilm">Short Film</option>
                                        <option value="tvShow">TV Show</option>
                                        <option value="software">Software</option>
                                        <option value="ebook">Ebook</option>
                                    </select>
                                </div>
                                <div className="col-12 col-sm-2 mb-3">
                                    <button type="submit" className="btn btn-primary btn-block">Search</button>
                                </div>
                            </div>
                        </form>

                        <hr />

                        SEARCH RESULTS
                        <div id="search-results-container">

                            <div className="col-12">
                                <h2 className="text-center text-light mb-3">Search Results</h2>
                                <p className="text-center text-light mb-3">Results Found: {this.state.searchResults.resultCount}</p>
                            </div>


                            <SearchResults searchResults={this.state.searchResults.results} addFavouriteHandler={this.addFavouriteHandler} />


                            <hr />

                        </div>



                        {/* FAVOURITES LIST */}
                        <div className="col-12">
                            <h2 className="text-center text-light mb-3">Favourites List</h2>
                        </div>

                        <Favourites favourites={this.state.favourites} removeFavouriteHandler={this.removeFavouriteHandler} />





                    </div>





                </div>
            );

    }
}

export default App;