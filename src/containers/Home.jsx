import React from 'react';
import EstablishmentSection from '../components/EstablishmentSection.jsx'
import '../style/MainSection.css'
import config from '../config.json';

export default class Home extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      currentData:null,
      city:-1,
      categories:[],
      cuisines:[],
      establishments:[],
      searchParameters:{
        category:"",
        cuisine:"",
        rating:{
          min:0,
          max:5
        },
        cost:{
          min:1,
          max:4
        }
      },
      lat:"0",
      long:"0"
    };

    //we need to first grab the users city
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({"lat":pos.coords.latitude, "lon":pos.coords.longitude})
      this.updateListOfVenues({
        "lat": pos.coords.latitude,
        "lon": pos.coords.longitude
      });
    });
  }

  updateListOfVenues(qs){
    //build the parameter string to append to the end of fetch
    var query = "?";
    var k = "";
    for(k in qs){
      query += k + "=" + qs[k] + "&";
    }

    console.log(qs)
    fetch('https://developers.zomato.com/api/v2.1/search' + query, {
      headers: {
          "user-key": config.zamatoKey
      },
      qs: qs
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ "establishments":data.restaurants })
      this.setState({"currentData":data.restaurants[0].restaurant})
    });

    //get cats
    fetch('https://developers.zomato.com/api/v2.1/categories' + query, {
      headers: {
          "user-key": config.zamatoKey
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ "categories":data.categories })
    });

    //get cats
    fetch('https://developers.zomato.com/api/v2.1/cuisines' + query, {
      headers: {
          "user-key": config.zamatoKey
      }
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ "cuisines":data.cuisines })
    });
  }

  setFocusedVenue(event){
    this.setState({"currentData":this.state.establishments[event.target.getAttribute("venueIndex")].restaurant})
  }

  updateFilters(event){
    var fc = document.getElementsByName("filtersCats");
    var c = "";

    for(var i = 0; i < fc.length; i++){
      if(fc[i].checked){
        c += fc[i].value + ","
      }
    }

    var fc2 = document.getElementsByName("filtersCuisines");
    var c2 = "";

    for(var i = 0; i < fc2.length; i++){
      if(fc2[i].checked){
        c2 += fc2[i].value + ","
      }
    }
  
    this.updateListOfVenues({
      "lat": this.state.lat,
      "lon": this.state.lon,
      "category": c,
      "cuisines":c2
    });

  }

  render() {
    var venueID = 0;
    return (
      <div classname="main">
        <div className="mainUpper">
          <h6>CATEGORY</h6>
          {this.state.categories.map((c) =>
            <p><input onChange={this.updateFilters.bind(this)} type="checkbox" name="filtersCats" value={c.categories.id}></input>{c.categories.name}</p>
          )}

          <h6>CUISINES</h6>
          {this.state.cuisines.map((c) =>
            <p><input onChange={this.updateFilters.bind(this)} type="checkbox" name="filtersCuisines" value={c.cuisine.cuisine_id}></input>{c.cuisine.cuisine_name}</p>
          )}
        </div>


        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"></link>
        <div className="mainLeft">
          <h6 className="resultsLabel">Results</h6>
          <ul className="venueList">
            {
              this.state.establishments.map((venue) =>
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
