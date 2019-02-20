import React from 'react';

import EstablishmentSection from '../components/EstablishmentSection.jsx'
import ReactDOM from 'react-dom'

import '../style/MainSection.css'
import config from '../config.json';

import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
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

    //we need to first grab the users city
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({ "lat": pos.coords.latitude, "lon": pos.coords.longitude })
      this.updateListOfVenues({
        "lat": pos.coords.latitude,
        "lon": pos.coords.longitude
      }, 0);

      this.updateFilterList({
        "lat": pos.coords.latitude,
        "lon": pos.coords.longitude
      });
    });
  }

  updateFilterList(qs) {
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

  updateListOfVenues(qs, index) {
    //append index param
    qs.start = index;

    this.setState({ "cIndex": index })

    //build the parameter string to append to the end of fetch
    var query = "?";
    var k = "";
    for (k in qs) {
      query += k + "=" + qs[k] + "&";
    }

    fetch('https://developers.zomato.com/api/v2.1/search' + query, {
      headers: {
        "user-key": config.zamatoKey
      },
      qs: qs
    })
      .then(response => response.json())
      .then(data => {
        if (index == 0) {
          this.setState({
            "establishments": data.restaurants,
            "establishmentsFiltered": data.restaurants,
            "currentData": data.restaurants[0].restaurant,
          })
        } else {
          var es = this.state.establishments;
          es = es.concat(data.restaurants);


          this.setState({"loadingMore": false, "establishments": es });
          this.updateFiltersLocally();
        }
      });
  }

  setFocusedVenue(event) {
    this.setState({ "currentData": this.state.establishments[event.target.getAttribute("venueIndex")].restaurant })
  }

  updateFiltersLocally() {
    var filtered = [];
    var results = this.state.establishments;

    for (var i = 0; i < results.length; i++) {
      var result = results[i];


      var price = result.restaurant.price_range;
      var min = this.state.searchParameters.cost.min;
      var max = this.state.searchParameters.cost.max;

      if (price >= min && result.restaurant.price_range <= max) {
        filtered.push(result);
      }
    }

    console.log("lowered from " + results.length + " to " + filtered.length)

    this.setState({ "establishmentsFiltered": filtered })
  }

  updateRatingRange(values) {
    var minRating = values[0];
    var maxRating = values[1];

    this.setState(
      {
        searchParameters: {
          rating: {
            min: minRating,
            max: maxRating
          }
        }
      },
      this.updateFiltersLocally()
    )
  }

  updateCostRange(values) {
    var minRating = values[0];
    var maxRating = values[1];

    this.setState(
      {
        searchParameters: {
          cost: {
            min: minRating,
            max: maxRating
          }
        }
      }
    ),
      this.updateFiltersLocally()
  }

  updateFilters(event, index) {
    if(index === undefined){
      index = 0;
    }

    var fc = document.getElementsByName("filtersCats");
    var c = "";

    for (var i = 0; i < fc.length; i++) {
      if (fc[i].checked) {
        c += fc[i].value + ","
      }
    }

    var fc2 = document.getElementsByName("filtersCuisines");
    var c2 = "";

    for (var i = 0; i < fc2.length; i++) {
      if (fc2[i].checked) {
        c2 += fc2[i].value + ","
      }
    }

    this.updateListOfVenues({
      "lat": this.state.lat,
      "lon": this.state.lon,
      "category": c,
      "cuisines": c2
    }, index);

  }

  componentDidMount() {
    const elem = ReactDOM.findDOMNode(this.refs.venueList);
    elem.addEventListener('scroll', (event) => {
      var obj = event.target;
      var dist = (obj.scrollHeight - obj.offsetHeight) - obj.scrollTop;

      if (dist <= 50 && !this.state.loadingMore) {
        console.log("BANGO")
        this.setState({ "loadingMore": true });
        this.updateFilters(null, this.state.cIndex + 20);
      }
    });
  }

  render() {
    var venueID = 0;
    return (
      <div classname="main">
        <div className="mainUpper">
          <div className="mainUpperFlex">

            
            <div>
              <h6 className="filterLabel">Category</h6>
              <ul className="catList filterList">
                {this.state.categories.map((c) =>
                  <li><input onChange={this.updateFilters.bind(this)} type="checkbox" name="filtersCats" value={c.categories.id}></input>{c.categories.name}</li>
                )}
              </ul>
            </div>

            <div>
              <h6 className="filterLabel filterLabelCuisine">Cuisine</h6>
              <ul className="cuisineList filterList">
                {this.state.cuisines.map((c) =>
                  <li><input onChange={this.updateFilters.bind(this)} type="checkbox" name="filtersCuisines" value={c.cuisine.cuisine_id}></input>{c.cuisine.cuisine_name}</li>
                )}
              </ul>
            </div>

            <div className="rangeSelectorsAside">
              <h6 className="filterLabel">Rating</h6>
              <Range marks={["0", "", "", "", "", "5"]} onAfterChange={this.updateRatingRange.bind(this)} className="rangeSelector" defaultValue={[0, 5]} min={0} max={5} />

              <h6 style={{ "padding-top": "20px" }} className="filterLabel">Cost</h6>
              <Range marks={["", "$", "", "", "$$$$"]} onAfterChange={this.updateCostRange.bind(this)} className="rangeSelector" defaultValue={[0, 3]} min={1} max={4} />


            </div>
          </div>
        </div>


        <link href="https://fonts.googleapis.com/css?family=Lato:400,900" rel="stylesheet"></link>
        <div className="mainLeft" ref="venueList">
          <h6 className="resultsLabel">Results</h6>
          <ul className="venueList">
            {
              this.state.establishmentsFiltered.map((venue) =>
                <li onClick={this.setFocusedVenue.bind(this)} venueID={venue.restaurant.id} venueIndex={venueID++}>{venue.restaurant.name}</li>
              )}
          </ul>
        </div>

        <div className="mainRight">
          <EstablishmentSection data={this.state.currentData}></EstablishmentSection>
        </div>
      </div>
    );
  }
}
