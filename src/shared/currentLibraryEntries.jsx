import React, { PureComponent } from 'react';
import Loader from './loader';
// TODO: make sure we don't need getList() here
import { getList, updateProgress, onError } from '../services/service.js';

export default class CurrentLibraryEntries extends PureComponent {
    state = {
        libraryEntriesDOM: null,
        loading: false
    }

    componentDidMount() {
        console.log('at library component', this.props.libraryEntries);

        let libraryEntriesDOM = this.props.libraryEntries.map((entry, index) => {
            // Minimize object property accessing
            let includedAttributes = entry.included.attributes;
            let entryType = entry.included.type;
            let image = this.state.loading ? (<div className="img-loader-container"><Loader /></div>) : (<div><img alt="thumbnail" src={includedAttributes.posterImage.medium} height={85} width={60} /></div>)

            return (
                <div key={entry.id} className="watchlist-item">
                    {image}
                    <div className="watchlist-col">
                        <p className="watchlist-title" href={`https://kitsu.io/${entryType}/${includedAttributes.slug}`}>{includedAttributes.canonicalTitle}</p>
                        <div>
                            <i onClick={this.showModal} className="fas fa-edit watchlist-btn"></i>
                            <i onClick={() => { this.decrementProgress(entry.id, entry.attributes.progress, index) }} className="far fa-minus-square watchlist-btn"></i>
                            <i onClick={() => { this.incrementProgress(entry.id, entry.attributes.progress, index) }} className="far fa-plus-square watchlist-btn"></i>
                            <span>{entryType === "anime" ? "Ep." : "Ch."} {entry.attributes.progress}</span>
                        </div>
                    </div>
                </div>
            )
        });

        this.setState({ libraryEntriesDOM });
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
        return (
            <div>
                {this.state.libraryEntriesDOM}
            </div>
        )
    }
}