import React, { PureComponent } from 'react';
import '../css/style.scss'
// import icon from './test.gif';


export default class Load extends PureComponent {
    state = {
        loading: true
    };

    componentDidMount() {
        setTimeout(() => this.setState({ loading: false }), 1500); // simulates an async action, and hides the spinner
    }

    render() {
        const { loading } = this.state;

        if (loading) { // if your component doesn't have to wait for an async action, remove this block 
            console.log('test');
            return <div className="loader"></div>
            // return null; // render null when app is not ready
        }

        return (
            <div>I'm the app</div>
        );
    }
}
