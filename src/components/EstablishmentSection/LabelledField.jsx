import React from 'react';
import styles from '../../style/EstablishmentSection.css';

export default ({ label, value, isOpen }) => (
  <div className="esLabelledField">
    <p className="esLabel">{label}</p>
    <p className="esValue">{value} 
        {(isOpen ?
        <span className={"esOpenSpan"}>Open Now</span>
        :
        null)}
    </p>    
  </div>
)