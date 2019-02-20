import React from 'react';

import EstablishmentSection from '../components/EstablishmentSection.jsx'
import ReactDOM from 'react-dom'

import '../style/MainSection.css'
import config from '../config.json';

import Slider, { Range } from 'rc-slider';
import '../style/slider.css';

export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentData: null,
      city: -1,
      categories: [],
      cuisines: [],
      establishments: [],
      establishmentsFiltered: [],
      searchParameters: {
        category: "",
        cuisine: "",
        rating: {
          min: 0,
          max: 5
        },
        cost: {
          min: 1,
          max: 4
        }
      },
      lat: "0",
      long: "0",
      cIndex: 0,
      loadingMore: false
    };

    //we need to first grab the users city to be able to provide relevant search results
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({ "lat": pos.coords.latitude, "lon": pos.coords.longitude })
      this.getListOfVenuesFromAPI({
        "lat": pos.coords.latitude,
        "lon": pos.coords.longitude
      }, 0);

      //grab the list of cuisines and categories around the users location
      this.getFilterOptionsFromAPI({
        "lat": pos.coords.latitude,
        "lon": pos.coords.longitude
      });
    });
  }

  getFilterOptionsFromAPI(qs) {
    //build the parameter string to append to the end of fetch
    var query = "?";
    var k = "";
    for (k in qs) {
      query += k + "=" + qs[k] + "&";
    }

    //get the data needed for the filter section 
    //get cats
    fetch('https://developers.zomato.com/api/v2.1/categories' + query, {
      headers: {
        "user-key": config.zamatoKey
      }
    })
      .then(response => response.json())
      .then(data => {
        //we splice out the last 4 to match the UI provided - might need to clarify on this 
        this.setState({ "categories": data.categories.splice(0, 4) })
      });

    //get cats
    fetch('https://developers.zomato.com/api/v2.1/cuisines' + query, {
      headers: {
        "user-key": config.zamatoKey
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ "cuisines": data.cuisines.splice(0, 11) })
      });
  }

  getListOfVenuesFromAPI(queryObject, firstResultIndex) {
    //append index param
    queryObject.start = firstResultIndex;

    this.setState({ "cIndex": firstResultIndex })

    //build the parameter string to append to the end of fetch
    var queryString = "?";
    var k = "";
    for (k in queryObject) {
      queryString += k + "=" + queryObject[k] + "&";
    }

    fetch('https://developers.zomato.com/api/v2.1/search' + queryString, {
      headers: {
        "user-key": config.zamatoKey
      }
    })
      .then(response => response.json())
      .then(data => {
        if (firstResultIndex == 0) {
          this.setState({
            "establishments": data.restaurants,
            "establishmentsFiltered": data.restaurants,
            "currentData": data.restaurants[0].restaurant,
          })
        } else {
          var es = this.state.establishments;
          es = es.concat(data.restaurants);


          this.setState({"loadingMore": false, "establishments": es }, this.updateFiltersLocally());
        }
      });
  }

  setFocusedVenue(event) {
    this.setState({ "currentData": this.state.establishments[event.target.getAttribute("venueindex")].restaurant })
  }

  //Filter the results that need to be handled locally (Cost & Rating) - as the API doesn't have a way to filter by these
  updateFiltersLocally() {
    var filtered = [];
    var results = this.state.establishments;

    var fCost = this.state.searchParameters.cost;
    var fRating = this.state.searchParameters.rating;

    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      
      var price = result.restaurant.price_range;
      var rating = result.restaurant.user_rating.aggregate_rating; 

      //check price is within range
      if (price >= fCost.min && result.restaurant.price_range <= fCost.max) {
        if(rating >= fRating.min && rating <= fRating.max){
          filtered.push(result);
        }
      }
    }

    this.setState({ "establishmentsFiltered": filtered })
  }

  //Map the range values to the state and re-run the local filters
  updateRatingRange(values) {
    var minRating = values[0];
    var maxRating = values[1];

    var searchParams = this.state.searchParameters;
    searchParams.rating.min = minRating;
    searchParams.rating.max = maxRating;

    this.setState(
      {
        searchParameters: searchParams
      },
      this.updateFiltersLocally
    )
  }

  //Map the range values to the state and re-run the local filters
  updateCostRange(values) {
    var minRating = values[0];
    var maxRating = values[1];

    var searchParams = this.state.searchParameters;
    searchParams.cost.min = minRating;
    searchParams.cost.max = maxRating;

    this.setState(
      {
        searchParameters: searchParams
      },
      this.updateFiltersLocally
    )
  }

  getFilterString(name){
    var filterElements = document.getElementsByName(name);
    var filterString = "";

    for (var i = 0; i < filterElements.length; i++) {
      if (filterElements[i].checked) {
        filterString += filterElements[i].value + ","
      }
    }
    
    return filterString;
  }

  updateFilters(event, index) {
    //if index is undefined default it to 0;
    if(index === undefined){
      index = 0;
    }

    this.getListOfVenuesFromAPI({
      "lat": this.state.lat,
      "lon": this.state.lon,
      "category": this.getFilterString("filtersCats"),
      "cuisines": this.getFilterString("filtersCuisines")
    }, index);

  }

  componentDidMount() {
    const elem = ReactDOM.findDOMNode(this.refs.venueList);
    elem.addEventListener('scroll', (event) => {
      var obj = event.target;
      var dist = (obj.scrollHeight - obj.offsetHeight) - obj.scrollTop;

      //while scrolling check if less than 50px from bottom,
      //if so then we should populate some more results
      if (dist <= 50 && !this.state.loadingMore) {
        this.setState({ "loadingMore": true });
        this.updateFilters(null, this.state.cIndex + 20);
      }
    });
  }

  render() {
    var venueid = 0;
    return (
      <div className="main">
        <div className="filterArea">

          <div>
            <h6 className="filterLabel">Category</h6>
            <ul className="catList filterList">
              {this.state.categories.map((c) =>
                <li key={"filter_" + c.categories.id}>
                  <input onChange={this.updateFilters.bind(this)} type="checkbox" name="filtersCats" value={c.categories.id}></input>
                  {c.categories.name}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h6 className="filterLabel filterLabelCuisine">Cuisine</h6>
            <ul className="cuisineList filterList">
              {this.state.cuisines.map((c) =>
                <li key={"filter_" + c.cuisine.cuisine_id}>
                  <input onChange={this.updateFilters.bind(this)} type="checkbox" name="filtersCuisines" value={c.cuisine.cuisine_id}></input>
                  {c.cuisine.cuisine_name}
                </li>
              )}
            </ul>
          </div>

          <div className="rangeSelectorsAside">
            <h6 className="filterLabel">Rating</h6>
            <Range marks={["0", "", "", "", "", "5"]} onAfterChange={this.updateRatingRange.bind(this)} className="rangeSelector" defaultValue={[0, 5]} min={0} max={5} />

            <h6 className="filterLabel">Cost</h6>
            <Range marks={["", "$", "", "", "$$$$"]} onAfterChange={this.updateCostRange.bind(this)} className="rangeSelector" defaultValue={[1, 4]} min={1} max={4} />
          </div>
        </div>

        <div className="mainLower">
          <div className="mainLeft" ref="venueList">
            <h6 className="resultsLabel">Results</h6>
            <ul className="venueList">
              {
                this.state.establishmentsFiltered.map((venue) =>
                  <li key={"venue_" + venue.restaurant.id} onClick={this.setFocusedVenue.bind(this)} venueid={venue.restaurant.id} venueindex={venueid++}>
                    <p>{venue.restaurant.name}</p>
                  </li>
                )}
            </ul>
          </div>

          <div className="mainRight">
            <EstablishmentSection data={this.state.currentData}></EstablishmentSection>
          </div>
        </div>
      </div>
    );
  }
}
