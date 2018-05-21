import React, { PureComponent } from 'react';
import Loader from './loader';
import LibraryEntryThumbnail from './libraryEntryThumbnail';

export default class SearchResults extends PureComponent {
    state = {
        libraryEntriesDOM: null,
        loading: false
    }

    componentWillReceiveProps(prevProps) {
        console.log('this ran?!')
    }

    componentDidMount() {
        console.log('results', this.props.searchResults);

        let searchResultsDOM = this.props.searchResults.map(entry => {
            let episodeCount = entry.attributes.episodeCount ? entry.attributes.episodeCount : '??'

            return (
                <div key={entry.id} className="watchlist-item">
                    <div>
                        <LibraryEntryThumbnail imgSrc={entry.attributes.posterImage.medium} />
                        <br />
                        <span onClick={this.showModal} className="edit-entry-btn"><i className="fas fa-edit"></i> Edit Entry</span>
                        <br />
                        <br />
                        <span><strong>Episodes:  </strong><br />{episodeCount}</span>
                        <br />
                        <br />
                        <span><strong>Type:  </strong><br />{entry.attributes.showType}</span>
                    </div>

                    <div className="watchlist-col">
                        <p className="watchlist-title">{entry.attributes.canonicalTitle}</p>
                        <p className="synopsis">{entry.attributes.synopsis}</p>

                    </div>
                </div>
            )
        })

        this.setState({ searchResultsDOM });

    }

    render() {
        // let image = this.state.loading ? (<div className="img-loader-container"><Loader /></div>) : (<div><img alt="thumbnail" src={includedAttributes.posterImage.medium} height={85} width={60} /></div>)

        return (
            <div>
                {this.state.searchResultsDOM}
            </div>
        )
    }
}