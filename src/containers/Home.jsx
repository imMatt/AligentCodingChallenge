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
      }
    };

    //we need to first grab the users city
    navigator.geolocation.getCurrentPosition((pos) => {
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
  }

  setFocusedVenue(event){
    this.setState({"currentData":this.state.establishments[event.target.getAttribute("venueIndex")].restaurant})
  }

  render() {
    var venueID = 0;
    return (
      <div classname="main">
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
