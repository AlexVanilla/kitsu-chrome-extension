import React, { PureComponent } from 'react';
import Loader from './loader';
import LibraryEntryThumbnail from './libraryEntryThumbnail';

// TODO: make sure we don't need getList() here
import { getList, updateProgress, onError } from '../services/service.js';

export default class CurrentLibraryEntries extends PureComponent {
    state = {
        newEntriesProgress: null,
        libraryEntriesDOM: null,
        loading: false
    }

    componentDidMount() {
        console.log('at library component', this.props.libraryEntries);
        let newEntriesProgress = [];

        let libraryEntriesDOM = this.props.libraryEntries.map((entry, index) => {
            // Minimize object property accessing
            let includedAttributes = entry.included.attributes;
            let entryType = entry.included.type;
            let progress = entry.attributes.progress;
            let episodeCount = entry.included.attributes.episodeCount ? entry.included.attributes.episodeCount : '??';

            newEntriesProgress.push(progress);

            return (
                <div key={entry.id} className="watchlist-item">
                    <LibraryEntryThumbnail loading={this.state.loading} imgSrc={includedAttributes.posterImage.medium} />
                    <div className="watchlist-col">
                        <p className="watchlist-title" href={`https://kitsu.io/${entryType}/${includedAttributes.slug}`}>{includedAttributes.canonicalTitle}</p>
                        <div>
                            <i onClick={this.showModal} className="fas fa-edit watchlist-btn"></i>
                            <i onClick={() => { this.decrementProgress(entry.id, progress, index) }} className="far fa-minus-square watchlist-btn"></i>
                            <i onClick={() => { this.incrementProgress(entry.id, progress, index) }} className="far fa-plus-square watchlist-btn"></i>
                            <i onClick={this.test1} className="far fa-plus-square watchlist-btn"></i>
                            <i onClick={this.test2} className="far fa-plus-square watchlist-btn"></i>
                            {/* TODO: also add the total number of chapters if manga */}
                            <span>{entryType === "anime" ? "Ep." : "Ch."} {progress} of {episodeCount}</span>
                        </div>
                    </div>
                </div>
            )
        });

        this.setState({
            libraryEntriesDOM: libraryEntriesDOM,
            newEntriesProgress: newEntriesProgress
        });
    }

    test1 = () => {
        console.log('set to true')
        this.setState({ loading: true })
    }

    test2 = () => {
        console.log('set to false')
        this.setState({ loading: false })
    }

    showModal() {
        console.log('TODO: create modal function')
    }

    incrementProgress(id, progress, index) {
        const payload = {
            "data": {
                "id": `${id}`,
                "type": "libraryEntries",
                "attributes": {
                    "progress": progress += 1
                }
            }
        }

        updateProgress(id, payload)
            .then(() => {
                this.setState(prevState => {
                    let newEntriesProgress = [...prevState.entriesProgress];
                    newEntriesProgress[index] += 1;
                    return {
                        entriesProgress: newEntriesProgress
                    }
                })
                return
            })
            .catch(onError)

    }

    decrementProgress(id, progress, index) {
        const payload = {
            "data": {
                "id": `${id}`,
                "type": "libraryEntries",
                "attributes": {
                    "progress": progress -= 1
                }
            }
        };

        updateProgress(id, payload)
            .then(() => {
                this.setState(prevState => {
                    let newEntriesProgress = [...prevState.entriesProgress];
                    newEntriesProgress[index] -= 1;
                    return {
                        entriesProgress: newEntriesProgress
                    }
                })
            })
            .catch(onError)
    }

    render() {
        // let image = this.state.loading ? (<div className="img-loader-container"><Loader /></div>) : (<div><img alt="thumbnail" src={includedAttributes.posterImage.medium} height={85} width={60} /></div>)

        return (
            <div>
                {this.state.libraryEntriesDOM}
            </div>
        )
    }
}