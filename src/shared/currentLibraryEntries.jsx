import React, { PureComponent } from 'react';
import Loader from './loader';
import LibraryEntryThumbnail from './libraryEntryThumbnail';
import { updateProgress, onError } from '../services/service.js';

export default class CurrentLibraryEntries extends PureComponent {
    state = {
        libraryEntriesProgress: [],
        libraryEntriesDOM: null,
        loading: []
    }

    componentDidMount() {
        console.log('at library component', this.props.libraryEntries);
        let libraryEntriesProgress = [];

        for (let entry of this.props.libraryEntries) {
            libraryEntriesProgress.push(entry.attributes.progress);
        }

        this.setState({ libraryEntriesProgress });
    }

    test1 = (index) => {
        console.log('set to true')
        this.setState(prevState => {
            let newLoading = [...prevState.loading];
            newLoading[index] = true
            return {
                loading: newLoading
            }
        })
    }

    test2 = (index) => {
        console.log('set to true')
        this.setState(prevState => {
            let newLoading = [...prevState.loading];
            newLoading[index] = false;
            return {
                loading: newLoading
            }
        })
    }

    showModal = () => {
        console.log('TODO: create modal function')
        console.log(this.state)
    }

    incrementProgress = (id, progress, index) => {
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
            .then(response => {
                this.setState(prevState => {
                    let libraryEntriesProgress = [...prevState.libraryEntriesProgress];
                    libraryEntriesProgress[index] = response;
                    return { libraryEntriesProgress }
                });
            })
            .catch(onError)
    }

    decrementProgress = (id, progress, index) => {
        const payload = {
            "data": {
                "id": `${id}`,
                "type": "libraryEntries",
                "attributes": {
                    "progress": progress -= 1
                }
            }
        }

        updateProgress(id, payload)
            .then(response => {
                this.setState(prevState => {
                    let libraryEntriesProgress = [...prevState.libraryEntriesProgress];
                    libraryEntriesProgress[index] = response;
                    return { libraryEntriesProgress }
                });
            })
            .catch(onError)
    }

    render() {
        let libraryEntriesDOM = this.props.libraryEntries.map((entry, index) => {
            let includedAttributes = entry.included.attributes;
            let episodeCount = entry.included.attributes.episodeCount ? entry.included.attributes.episodeCount : '??';

            return (
                <div key={entry.id} className="watchlist-item">
                    <LibraryEntryThumbnail loading={this.state.loading[index]} imgSrc={includedAttributes.posterImage.medium} />
                    <div className="watchlist-col">
                        <p className="watchlist-title" href={`https://kitsu.io/${entry.included.type}/${includedAttributes.slug}`}>{includedAttributes.canonicalTitle}</p>
                        <div>
                            <i onClick={this.showModal} className="fas fa-edit watchlist-btn"></i>
                            <i onClick={() => { this.decrementProgress(entry.id, entry.attributes.progress, index) }} className="far fa-minus-square watchlist-btn"></i>
                            <i onClick={() => { this.incrementProgress(entry.id, entry.attributes.progress, index) }} className="far fa-plus-square watchlist-btn"></i>
                            {/* TODO: also add the total number of chapters if manga */}
                            <span>{entry.included.type === "anime" ? "Ep." : "Ch."} {this.state.libraryEntriesProgress[index]} of {episodeCount}</span>
                        </div>
                        <p>
                            <i onClick={() => { this.test1(index) }} className="far fa-plus-square watchlist-btn"></i>
                            <i onClick={() => { this.test2(index) }} className="far fa-plus-square watchlist-btn"></i>
                        </p>
                    </div>
                </div>
            )
        });


        // let image = this.state.loading ? (<div className="img-loader-container"><Loader /></div>) : (<div><img alt="thumbnail" src={includedAttributes.posterImage.medium} height={85} width={60} /></div>)

        return (
            <div>
                {libraryEntriesDOM}
            </div>
        )
    }
}