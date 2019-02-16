import React from 'react';
import styles from '../../style/EstablishmentSection.css';

export default ({ label, value }) => (
  <span>
    {(value ?
      <span className="trueTick">✔</span>
    :
      <span className="falseCross">✖</span>
    )}
  </span>
)