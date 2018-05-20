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
                        <i onClick={this.showModal} className="fas fa-edit watchlist-btn" style={{ margin: '0px' }}></i>
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

        // let libraryEntriesDOM = this.props.libraryEntries.map((entry, index) => {
        //     // Minimize object property accessing
        //     let includedAttributes = entry.included.attributes;
        //     let entryType = entry.included.type;
        //     let progress = entry.attributes.progress;
        //     let episodeCount = entry.included.attributes.episodeCount ? entry.included.attributes.episodeCount : '??';

        //     newEntriesProgress.push(progress);

        //     return (
        //         <div key={entry.id} className="watchlist-item">
        //             <LibraryEntryThumbnail loading={this.state.loading} imgSrc={includedAttributes.posterImage.medium} />
        //             <div className="watchlist-col">
        //                 <p className="watchlist-title" href={`https://kitsu.io/${entryType}/${includedAttributes.slug}`}>{includedAttributes.canonicalTitle}</p>
        //                 <div>
        //                     <i onClick={this.showModal} className="fas fa-edit watchlist-btn"></i>
        //                     <i onClick={() => { this.decrementProgress(entry.id, progress, index) }} className="far fa-minus-square watchlist-btn"></i>
        //                     <i onClick={() => { this.incrementProgress(entry.id, progress, index) }} className="far fa-plus-square watchlist-btn"></i>
        //                     <i onClick={this.test1} className="far fa-plus-square watchlist-btn"></i>
        //                     <i onClick={this.test2} className="far fa-plus-square watchlist-btn"></i>
        //                     {/* TODO: also add the total number of chapters if manga */}
        //                     <span>{entryType === "anime" ? "Ep." : "Ch."} {progress} of {episodeCount}</span>
        //                 </div>
        //             </div>
        //         </div>
        //     )
        // });
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