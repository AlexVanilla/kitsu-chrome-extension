import React, { PureComponent } from 'react';
import Loader from './loader';

export default class CurrentLibraryEntries extends PureComponent {
    state = {}

    componentDidMount() {
        console.log('mount', this.props.loading)
    }
    componentDidUpdate() {
        console.log('I updated?', this.props.loading)
    }

    render() {
        console.log(this.props.loading);

        if (this.props.loading) {
            return (
                <div className="img-loader-container">
                    <Loader />
                </div>
            )
        } else {
            return (
                <div>
                    <img alt="thumbnail" src={this.props.imgSrc} height={85} width={60} />
                </div>
            )
        }
    }
}