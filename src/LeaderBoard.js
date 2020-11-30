import React, { Component } from "react";
 

class LeaderBoard extends Component {

  constructor(props){
    super(props);
    this.state={
      users: [],
      baseURL: props.baseURL
    }
   }

  componentDidMount() {

    
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
	};
	fetch(this.state.baseURL+'/api/users', requestOptions)
	.then(response => response.json())
	.then(data => 
    {
      this.setState({users:data.users});
    })
  
  }


  render() {
    return (
      <div>
        <br/>
        <table width="60%">
		<tbody>
        <tr><td  width="33%"><strong>Name</strong></td><td width="33%"><strong>Score</strong></td></tr>
        {
          this.state.users.map((user) =>
  <tr><td>{user.name}</td><td>{user.score}</td></tr>
          )
        }
		</tbody>
        </table>
      </div>
    );
  }
}
 
export default LeaderBoard;
