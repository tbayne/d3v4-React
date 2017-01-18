import React, { Component } from 'react';
import * as d3 from 'd3'

import './App.css';

import _ from 'lodash';

//import Preloader from './components/Preloader';
import NetworkGraph from './components/NetworkGraph1';

class App extends Component {

  constructor(props) {
        super(props);
        
        this.state = this.getData();
    }
  
  getData() {
    const range = 100;
    const data = {
            nodes:d3.range(0, range).map(function(){ return {label: "link",r:~~d3.randomUniform(8, 28)()}}),
            links:d3.range(0, range).map(function(){ return {source:~~d3.randomUniform(range)(), target:~~d3.randomUniform(range)()} })        
        }
    return data;
  }

  componentWillMount() {
    this.setState(this.getData());
  }

  render() {
        
    return (
        <div className="App container">
          <svg width="800" height="600">
            <NetworkGraph data={this.state} width={800} height={600} />
          </svg>
        </div>
      );
  }

}

export default App;
