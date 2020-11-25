import React, { Component } from "react";
import Slider from "react-slick";



export default class Favourites extends Component {


    render() {

        const favourites = this.props.favourites;

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


                    {favourites.map((favourite) =>

                        <div className="text-center favourite-slide" key={favourite.trackId}>

                            <div className="text-center mb-3 thumbnail-container">
                                <img src={favourite.artworkUrl100} className="img-fluid rounded mx-auto" alt="Title Artwork" />
                            </div>
                            <h4 className="text-light">{favourite.artistName}</h4>
                            <p className="text-light">{favourite.trackName}</p>
                            <p className="text-light">{favourite.url}</p>
                            <button className="btn btn-dark btn btn-dark col-12 mb-3 align-bottom" onClick={this.props.removeFavouriteHandler} type="button" data-key={favourite.trackId}>REMOVE FROM FAVOURITES</button>

                        </div>

                    )}

                </Slider>
            </div>
        );
    }
}