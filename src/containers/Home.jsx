import React from 'react';
import EstablishmentSection from '../components/EstablishmentSection.jsx'
import '../style/MainSection.css'
import config from '../config.json';

export default class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentID:18693142,
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


    fetch('https://developers.zomato.com/api/v2.1/search', {
      headers: {
          "user-key": config.zamatoKey
      }
    })
    .then(response => response.json())
    .then(data => this.setState({ "establishments":data.restaurants }));
  }

  setFocusedVenue(event){
    this.setState({"currentID":event.target.getAttribute("venueID")})
  }

  render() {
    return (
      <div classname="main">
        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"></link>
        <div className="mainLeft">
          <h6 className="resultsLabel">Results</h6>
          <ul className="venueList">
            {this.state.establishments.map((venue) =>
              <li onClick={this.setFocusedVenue.bind(this)} venueID={venue.restaurant.id}>{venue.restaurant.name}</li>
            )}            
          </ul>
        </div>

        <div className="mainRight">
          <EstablishmentSection id={this.state.currentID}></EstablishmentSection>
        </div>
      </div>
    );
  }
}
