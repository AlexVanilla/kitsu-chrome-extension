import React, { PureComponent } from 'react';
import Login from './login';
import Watchlist from './watchlist';

export default class App extends PureComponent {
    constructor() {
        super();

        this.state = {
            userId: null
        }
    }

    componentDidMount() {
        // After mounting, set the userId from storage onto state object
        chrome.storage.sync.get(result => {
            this.setState({ userId: result.userId })
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.userId ? (<Watchlist />) : (<Login />)}
            </React.Fragment>
        )
    }
}