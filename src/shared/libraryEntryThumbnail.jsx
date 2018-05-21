import React, { PureComponent } from 'react';
import Loader from './loader';

export default class CurrentLibraryEntries extends PureComponent {
    render() {
        if (this.props.loading) {
            return (
                <div className="img-loader-container">
                    <Loader />
                </div>
            )
        } else {
            return (
                <React.Fragment>
                    <img alt="thumbnail" src={this.props.imgSrc} height={113} width={80} />
                </React.Fragment>
            )
        }
    }
}