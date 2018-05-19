import React, { PureComponent } from 'react';

export default class SearchBar extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            term: ''
        };
    }

    onInputChange(term) {
        this.setState({ term });
        this.props.onSearchTermChange(term);
    }

    render() {
        return (
            <div className="search-bar">
                <label htmlFor="search"><i className="fas fa-search"></i></label>
                <input onChange={event => this.onInputChange(event.target.value)} value={this.state.term} />
            </div>
        )
    }
}
