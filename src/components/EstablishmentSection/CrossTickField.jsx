import React from 'react';
import styles from '../../style/EstablishmentSection.css';

export default ({ label, value }) => (
  <span>
    {(value ?
      <span><span className="trueTick">✔</span> {label} Available</span>
    :
      <span><span className="falseCross">✖</span> No {label}</span>
    )}
  </span>
)