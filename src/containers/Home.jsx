import React from 'react';

export default class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
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
  }

  componentDidMount(){

  }

  render() {
    return (
      <p>Home</p>
    );
  }
}
