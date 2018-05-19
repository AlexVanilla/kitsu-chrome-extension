import React, { PureComponent } from 'react';
import Login from './login';
import Watchlist from './watchlist';
import '../css/style.scss';

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
        console.log('app render', this.state.userId)
        let component = this.state.userId ? (<Watchlist />) : (<Login />)

        // TODO: implement flexbox container
        return (
            <div className="app-componentPadding">
                {component}
            </div>
        )
    }
}