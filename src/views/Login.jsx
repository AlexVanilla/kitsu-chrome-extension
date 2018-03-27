/* global chrome */
import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'react-router'
import { login, setToken, getChromeStorageItem } from '../services/service.js';
import Watchlist from './Watchlist';

export default class Login extends PureComponent {
  constructor(props, context) {
    super(props, context)

    this.submit = this.submit.bind(this)
    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this)
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this)
    this.getCookie = this.getCookie.bind(this)

    this.state = {
      formData: {
        username: "",
        password: ""
      },
      loggedIn: false,
      response: null,
      id: null
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

  submit() {
    login(this.state.formData)
      .then(response => {
        console.log(response);
        chrome.storage.sync.set({
          loggedIn: response
        }, () => {
          if (chrome.runtime.error) {
            console.error("Runtime error in Login.jsx");
          }
        })

        chrome.cookies.set({
          url: "https://kitsu.io/",
          name: "testCookie",
          value: response,
        })
      })
      // .then(response => {
      //   console.log(response)
      //   this.setState({ test: response })
      // })
      .catch(error => { console.error("ERROR:  ", error) });
  }

  getCookie() {
    chrome.cookies.get({
      url: "https://kitsu.io/",
      // name: "<cookieName>"
      name: "testCookie"
    }, cookie => {
      // console.log(cookie)
      // alert(cookie.value)
      this.setState({ id: cookie })
    })
  }

  render() {
    // isLoggedin boolean default false
    // TODO: use storage as some sort of cache

    // NOTE: use chrome.storage is recommended
    console.log(this.state.id)
    if (!this.state.id) {
      this.getCookie()
    }
    console.log(this.state.id)

    // chrome.cookies.getAll({}, cookies => {
    //   for (let cookie of cookies) {
    //     // console.log(cookie)
    //   }
    // })

    // NOTE: code review if "redirection" this way is fine (This is is fine for now unless this grows to be something more complicated)
    // console.log(getChromeStorageItem("loggedIn"))
    if (getChromeStorageItem("loggedIn")) {
      console.log("I worked?")
      // let userId = getChromeStorageItem("userId")
      return <Watchlist />
    }
    return (
      <div>
        <h1>Kitsu Login</h1>
        <form>
          <div>
            <input onChange={this.handleUsernameInputChange} className="form-control" type="text" placeholder="Username" />
            <input onChange={this.handlePasswordInputChange} className="form-control" type="password" placeholder="Password" />
          </div>
          <div>
            <button onClick={this.submit} className="btn btn-primary" type="button">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
