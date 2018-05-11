/* global chrome */
import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'react-router'
import login from '../services/service.js';

export default class Login extends PureComponent {
  constructor() {
    super();

    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.login = this.login.bind(this);
    this.test = this.test.bind(this);

    this.state = {
      formData: {
        username: "",
        password: ""
      },
    }
  }


  handleUsernameInputChange(event) {
    const value = event.target.value;
    const newFormData = { ...this.state.formData }
    newFormData.username = value;

    this.setState({ formData: newFormData })
  }

  handlePasswordInputChange(event) {
    const value = event.target.value;
    const newFormData = { ...this.state.formData }
    newFormData.password = value;
    this.setState({ formData: newFormData })
  }

  test() {
    chrome.storage.sync.set({ 'userId': process.env.USER_ID }, function () {
      console.log("userId invoked");
    })
  }

  login() {
    login(this.state.formData)
      .then(response => {
        console.log('success!', response);
        chrome.storage.sync.set({
          loggedIn: response
        }, () => {
          if (chrome.runtime.error) {
            console.error("Runtime error in Login.jsx");
          }
        })
      })
      .catch(error => { console.error("ERROR:  ", error) });
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form>
          <div>
            <input onChange={this.handleUsernameInputChange} className="form-control" type="text" placeholder="Username" />
            <input onChange={this.handlePasswordInputChange} className="form-control" type="password" placeholder="Password" />
          </div>
          <div>
            <button onClick={this.login} className="btn btn-primary" type="button">Login</button>
            <button onClick={this.test} className="btn btn-primary" type="button">Bypass Login</button>
          </div>
        </form>
      </div>
    );
  }
}
