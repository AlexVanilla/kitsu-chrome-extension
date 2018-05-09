import React, { PureComponent } from 'react';
import Login from './login';
import Watchlist from './watchlist';
import '../css/style.css';

export default class App extends PureComponent {
    constructor(props) {
        super();

        this.state = {
            userId: null
        }
    }

    componentDidMount() {
        chrome.storage.sync.get(['userId'], result => {
            this.setState({ userId: result.userId })
        });
    }

    render() {
        console.log(this.state.userId);
        let component = this.state.userId ? (<Watchlist />) : (<Login />)

        return (
            <div>
                {component}
            </div>
        )
    }
}