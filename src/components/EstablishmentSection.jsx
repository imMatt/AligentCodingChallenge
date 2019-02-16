import React from 'react';
import styles from '../style/EstablishmentSection.css';
import LabelledField from './EstablishmentSection/LabelledField.jsx';
import CrossTickField from './EstablishmentSection/CrossTickField.jsx';
import config from '../config.json';

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = {id:this.props.id, data:{}}

        
        fetch('https://developers.zomato.com/api/v2.1/restaurant?res_id=16774318', {
            headers: {
                "user-key": config.zamatoKey
            }
        })
        .then(response => response.json())
        .then(data => this.setState({ "data":data }));
    }

    render(){
        return (
            <div className="esOuter">
                <div className="esLeft">
                    <img src="https://b.zmtcdn.com/data/res_imagery/16774318_RESTAURANT_fc526e8cfdc1cd8242c50298385d325c.JPG?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A"></img>
                </div>

                <div className="esRight">
                    <h1>{this.state.data.name}</h1>
                    <p>{this.state.data.location.address}</p>
                
                    <LabelledField label="Cuisines" value={this.state.data.cuisines}></LabelledField>
                
                    <p><CrossTickField value={this.state.data.has_table_booking}></CrossTickField> No Bookings</p> 
                    <p><CrossTickField value={this.state.data.has_online_delivery}></CrossTickField> Delivery Available</p>

                    <LabelledField label="Phone Number" value={this.state.data.phone_numbers}></LabelledField>
                    <LabelledField label="Opening Hours" value="Today 6:30AM to 4PM" isOpen={true}></LabelledField>      
                </div>  
          </div>
        )
    }

}