import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Home from "./Home";
import LeaderBoard from "./LeaderBoard";
class Main extends Component {


    constructor(props) {
        super(props);
	
        this.state={
			jwt: props.jwt,
            baseURL: process.env.REACT_APP_BASE_URL
          };

                
      }
    
        render() {
      return (
        <HashRouter>
          <div>
            <h1>AKS Komp</h1>
            <ul className="header">
              
              <li><NavLink exact to="/" style={{backgroundColor: 'black'}} activeStyle={{backgroundColor: 'red'}}>Home</NavLink></li>
              <li><NavLink to="/leaderboard" style={{backgroundColor: 'black'}} activeStyle={{backgroundColor: 'red'}}>Leader Board</NavLink></li>
              
            </ul>
            <div className="content">
            <Route exact  path="/" component={() => <Home jwt={this.state.jwt} baseURL={this.state.baseURL}/>}/>
            <Route path="/leaderboard" component={() => <LeaderBoard baseURL={this.state.baseURL}/> }/>              
            </div>

            
          </div>
        </HashRouter>

      );
    }
  }

export default withRouter(Main);
