import React from 'react';
import styles from '../style/EstablishmentSection.css';
import LabelledField from './EstablishmentSection/LabelledField.jsx';
import CrossTickField from './EstablishmentSection/CrossTickField.jsx';
import config from '../config.json';

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = {id:this.props.id, 
            data:null
        }
    }

    componentWillReceiveProps(props){
        this.setState({"data":props.data})
        this.forceUpdate();
    }

    render(){
        return (
            <div className="esOuter">
                {(this.state.data) ? 
                <div>
                    <div className="esLeft">
                        <img src={this.state.data.thumb}></img>
                    </div>

                    <div className="esRight">
                        <h1>{this.state.data.name}</h1>
                        <p>{this.state.data.location.address}</p>
                    
                        <LabelledField label="Cuisines" value={this.state.data.cuisines}></LabelledField>
                    
                        <p><CrossTickField value={this.state.data.has_table_booking} label="Bookings"></CrossTickField></p> 
                        <p><CrossTickField value={this.state.data.has_online_delivery} label="Delivery"></CrossTickField></p>

                        <LabelledField label="Phone Number" value={this.state.data.phone_numbers}></LabelledField>
                        <LabelledField label="Opening Hours" value="Today 6:30AM to 4PM" isOpen={true}></LabelledField>      
                    </div>  
                </div>
                :
                null}
          </div>
        )
    }

}