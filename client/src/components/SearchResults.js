import React, { Component } from "react";
import Slider from "react-slick";



export default class SearchResults extends Component {


    render() {

        const searchResults = this.props.searchResults;

        var settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        };
        return (
            <div>

                <Slider {...settings}>


                    {searchResults.map((searchresult) =>
                        <div className="text-center search-slide" key={searchresult.trackId}>
                            <div className="text-center mb-3 thumbnail-container">
                                <img src={searchresult.artworkUrl100} className="img-fluid rounded mx-auto" alt="Title Artwork" />
                            </div>

                            <h4 className="text-light">{searchresult.artistName}</h4>
                            <p className="text-light">{searchresult.trackName}</p>
                            <p className="text-light">{searchresult.url}</p>
                            <button className="btn btn-dark col-12 mb-3" onClick={this.props.addFavouriteHandler} type="button" data-key={searchresult.trackId}>ADD TO COLLECTION</button>

                        </div>
                    )}


                </Slider>
            </div>
        );
    }
}