import React from 'react';
import styles from '../style/EstablishmentSection.css';
import LabelledField from './EstablishmentSection/LabelledField.jsx'

export default ({ children }) => (
  <div className="esOuter">
    <h1>Handsome and the Duchess</h1>
    <p>16 McHenry Street, Adelaide, City Centre, Adelaide, SA</p>

    <LabelledField label="Cuisines" value="Coffee and Tea, Cafe Food"></LabelledField>
    <LabelledField label="Cuisines" value="Coffee and Tea, Cafe Food"></LabelledField>

    <LabelledField label="Phone Number" value="0425 729 534"></LabelledField>
    <LabelledField label="Opening Hours" value="Today 6:30AM to 4PM" isOpen={true}></LabelledField>

  </div>
)