import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import axios from 'axios'
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Qs from 'qs';
// import "./Register.css";

const theme = createMuiTheme();
const baseUrl = "http://localhost:9797";

class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: ''
    }
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <div>
            <AppBar title="Register">
              <TextField
                placeholder="Enter your first name"
                label="First Name"
                onChange = { (event,newValue) => this.setState({ firstName: newValue }) }
              />

              <TextField
                placeholder="Enter your last name"
                label="Last Name"
                onChange = { (event,newValue) => this.setState({ lastName: newValue }) }
              />

              <TextField
                placeholder="Enter your Username"
                label="Username"
                onChange = { (event,newValue) => this.setState({ username: newValue }) }
              />

              <TextField
                placeholder="Enter your Password"
                label="Password"
                type="password"
                onChange = { (event,newValue) => this.setState({ password: newValue }) }
              />

              <Button 
                color="default" 
                variant="flat" 
                size="large" 
                label="Submit" 
                onClick={ (event) => this.handleClick(event) }
              > Create Account 
              </Button>
            </AppBar>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }

  handleClick(event){
    const payload = {
      "firstName": this.state.firstName,
      "lastName": this.state.lastName,
      "username": this.state.username,
      "password": this.state.password
    }

    console.log(payload);
    axios.post(`${baseUrl}/user/register`, Qs.stringify(payload))
    .then(function (response) {
     console.log(response.data);
     if(response.data.code == 200){
       console.log("Registration has succeeded");
       // var uploadScreen=[];
       // uploadScreen.push(<UploadPage appContext={self.props.appContext} role={self.state.loginRole}/>)
       // self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
     }
     // else if(response.data.code == 204){
     //   console.log("Username password do not match");
     //   alert(response.data.success)
     // }
     else{
      console.log(response.data);
       // console.log("Username does not exists");
       // alert("Username does not exist");
     }
    })
    .catch(function (error) {
     console.log(error);
    });
  }
}

export default Register;
