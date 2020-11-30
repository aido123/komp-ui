import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactSpinner from 'react-bootstrap-spinner'
class Home extends Component {


  constructor(props){
    super(props);

  this.state = {
    levels: [],
    levelsData: [],
    selectedLevel: "",
    validationError: "",

    questions: [],
    selectedQuestion: "",
    disabledSetup: false,
    disabledValidate: true,
    setupMessage: "",
    validationMessage: "",

    answers: [],
    selectedAnswer: "",

    loading: false,
    complete: "",

    baseURL: props.baseURL,
    access_token: props.jwt
  }
  
}


  componentDidMount() {

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
		
    fetch(this.state.baseURL +'/api/levels', requestOptions)
    .then(response => response.json())
    .then(data => 
      {
		if(data.status=="200"){
		this.setState({levelsData:data.levels});
        let levelsFromApi = data.levels.map(level => {
          return { value: level.id, display: level.name };
        });
        this.setState({
          levels: [
                {
                  value: "",
                  display:
                    "(Select Level)"
                }
              ].concat(levelsFromApi)
          });
		}else{
			console.log("Status Error" + data.status);
		}
      })
  
  }

  handleSelectChange(e)
  {
    console.log("Clicked on level" + e.target.value);
    this.state.selectedLevel = e.target.value;
    this.state.selectedQuestion = "";
    this.state.selectedAnswer = "";
    this.state.validationError = e.target.value === ""  ? "You must select your level" : ""
    	
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Bearer ' + this.state.access_token  },
      body: {}
    };
    fetch(this.state.baseURL +'/api/levels/'+this.state.selectedLevel+'/questions', requestOptions)
    .then(response => response.json())
    .then(data => 
      {
		if(data.status=="200"){
			this.setState({questions: data.questions});
			this.setState({complete: (this.state.questions.filter(item => item.complete === 'true')).length + "/" + this.state.questions.length});
			this.setState({disabledSetup: false});
			this.setState({disabledValidate: true});
			this.setState({validationMessage: ""});
			this.setState({setupMessage: ""});
			this.setState({answers: []});
		} else{
			console.log("Status Error: " + data.status);
		}
      })

  }

  handleQuestionClick(id){
    console.log("Clicked on question" + id);

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Bearer ' +  this.state.access_token }
    };
    fetch(this.state.baseURL +'/api/levels/'+this.state.selectedLevel+'/questions/'+id+'/answers', requestOptions)
    .then(response => response.json())
    .then(data =>
      {
		if(data.status=="200"){
			this.setState({answers: data.answers});
			this.setState({selectedQuestion:id});
			this.setState({disabledSetup: false});
			this.setState({disabledValidate: true});
			this.setState({validationMessage: ""});
			this.setState({setupMessage: ""});
			this.state.selectedAnswer = "";
		} else{
			console.log("Status Error: " + data.status);
		}
      })
  }

  handleAnswerClick(id){
    console.log("Clicked on answer" + id);
    this.setState({selectedAnswer:id});
  }

  handleQuestionSetupClick(id){
    console.log("Clicked on setup question" + id);
    this.setState({disabledSetup: true});
    this.setState({disabledValidate: true});
    this.setState({loading: true});
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Bearer ' +  this.state.access_token },
      body: {}
    };
    fetch(this.state.baseURL +'/api/setup/levels/'+this.state.selectedLevel+'/questions/' + id, requestOptions)
    .then(response => response.json())
    .then(data => 
      {
		if(data.status=="200"){
			this.setState({disabledValidate: false});
			this.setState({setupMessage: data.message});
			this.setState({loading: false});
		} else{
			this.setState({disabledSetup: false});
			this.setState({disabledValidate: true});
			this.setState({loading: false});
			console.log("Status Error" + data.status);
		}
      })
  }

  handleQuestionValidateClick(id){
    console.log("Clicked on validate question" + id);
    this.setState({disabledValidate: true});
    this.setState({setupMessage: ""});
    this.setState({loading: true});
    this.setState({validationMessage: ""});   
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization':'Bearer ' +  this.state.access_token },
      body: {}
    };
    fetch(this.state.baseURL +'/api/validate/levels/'+this.state.selectedLevel+'/questions/' + id + '?ansid=' + this.state.selectedAnswer, requestOptions)
    .then(response => response.json())
    .then(data => 
      {
        if (data.status === "200" && data.validation == "correct"){
          this.setState({disabledSetup: false});
          this.setState({disabledValidate: true}); 

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization':'Bearer ' +  this.state.access_token },
            body: {}
          };
          fetch(this.state.baseURL +'/api/levels/'+this.state.selectedLevel+'/questions', requestOptions)
          .then(response => response.json())
          .then(data => 
            {
			  if (data.status === "200"){
				  this.setState({questions: data.questions});
				  this.setState({complete: (this.state.questions.filter(item => item.complete === 'true')).length + "/" + this.state.questions.length});
				  this.setState({validationMessage: "Congratulations, you have solved this question."});   
				  this.setState({loading: false});
			  } else {
				    this.setState({disabledSetup: false});
					this.setState({disabledValidate: true}); 
					this.setState({loading: false});
					this.setState({validationMessage: "Internal Error " + data.status});  
					console.log("Status Error: " + data.status);
			  }
    
            })
      
        } else if (data.status === "200" && data.validation == "incorrect") {
			  this.setState({validationMessage: "Sorry we could not validate your task. Please make sure you've perform the task correctly"});   
			  this.setState({loading: false});
			  this.setState({disabledValidate: false}); 
        } else {
			  this.setState({validationMessage: "Internal Error " + data.status});   
			  this.setState({loading: false});
			  this.setState({disabledValidate: false}); 
			  console.log("Status Error: " + data.status);
		}
      })


  }

  render() {
    return (

      <div>
        <table width="100%">
		<tbody>
          <tr>
            <td width="25%"><strong>Level</strong></td><td width="15%"><strong>Questions Complete</strong></td><td width="60%"><strong>Description</strong></td>
          </tr>
          <tr>
            <td>
              <select value={this.state.selectedLevel} onChange={e => this.handleSelectChange(e)}>
                {this.state.levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.display}
                  </option>
                ))}
              </select>
            </td>
            <td>
              {this.state.complete}
            </td>
            <td>
            
              {this.state.levelsData.map(level => 
                {
                  return (level.id == this.state.selectedLevel && <div className="content" dangerouslySetInnerHTML={{__html: level.description}}></div>)
                }
              )} 
            </td>
          </tr>
		  </tbody>
        </table>
    

        <div style={{color: "red", marginTop: "5px"}}>
          {this.state.validationError}
        </div>

        <div>
          {this.state.questions.map(question => 
            {
              return (
                (this.state.selectedQuestion===question.id && <button id={question.id} className="btn warning" onClick={() => this.handleQuestionClick(question.id) }>{question.id}</button>)
                ||
                (question.complete==="true" && <button id={question.id} className="btn success"  onClick={() => this.handleQuestionClick(question.id) }>{question.id}</button>)
                ||
                (question.complete==="false" && <button id={question.id} className="btn default" onClick={() => this.handleQuestionClick(question.id) }>{question.id}</button>)
              )
            }
          )}
        </div>


        <div>
          {this.state.questions.map(question => 
            {
              return ((question.id === this.state.selectedQuestion && <p Style="border-style: dotted;"><div className="content" dangerouslySetInnerHTML={{__html: question.description}}></div></p>))
            }
          )}
        </div>

        <div>
          {this.state.answers.map(answer =>
            {
              return (
		(this.state.selectedAnswer===answer.id && <button id={answer.id} className="btn warning" onClick={() => this.handleAnswerClick(answer.id) }>{answer.description}</button>)
                ||
                (<button id={answer.id} className="btn default" onClick={() => this.handleAnswerClick(answer.id) }>{answer.description}</button>)
              )
            }
          )}
        </div>


        <div>
          {this.state.questions.map(question => 
          {
            return (
              (question.id === this.state.selectedQuestion && question.complete === "true" && <div>Question Completed</div>)
            ||
              (question.id === this.state.selectedQuestion && question.complete === "false" && <div>Question Not Attempted/Incomplete</div>)
              )
          }
          )}
        </div>


        <div>
          {this.state.questions.map(question => 
            {
              return (question.type === "setup" && question.id === this.state.selectedQuestion && <button className="btn info" id={question.id} disabled={this.state.disabledSetup} onClick={() => this.handleQuestionSetupClick(question.id) }>Setup</button>)
            })}
            &nbsp;&nbsp;
            {this.state.questions.map(question => 
            {
              return (question.id === this.state.selectedQuestion && <button className="btn info" id={question.id} disabled={question.type === "setup" && this.state.disabledValidate} onClick={() => this.handleQuestionValidateClick(question.id) }>Validate</button>)
            })}
            <br/>
        </div>

        <div>
          {this.state.setupMessage}
          <br/>   
        </div>
        <div>
          {this.state.validationMessage}
          <br/> 
      </div>

      <div>
        {this.state.loading===true && <div><ReactSpinner type="border" color="primary" size="1" /></div>}
        <br/>
      </div>


    </div>
  

    );
  }
}
 
export default Home;
