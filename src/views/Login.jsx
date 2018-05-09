/* global chrome */
import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'react-router'
import { login, setToken, getChromeStorageItem } from '../services/service.js';

export default class Login extends PureComponent {
  state = {
    formData: {
      username: "",
      password: ""
    },
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

  submit() {
    chrome.storage.sync.set({ 'userId': true }, function () {
      console.log("userId invoked");
    })

    login(this.state.formData)
      .then(response => {
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
            <button onClick={this.submit} className="btn btn-primary" type="button">Login</button>
          </div>
        </form>
      </div>
    );
  }
}
