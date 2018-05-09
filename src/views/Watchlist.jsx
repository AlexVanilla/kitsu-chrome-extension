/* TODO:
Save user session in chrome and skip login page!
make interface
have user choose b/w getting just anime or just manga or all

*/
import React, { PureComponent } from 'react';
import { getList, getAnime, getManga, getChromeStorageItem, increment, decrement, onError } from '../services/service.js';
// import '../css/bootstrap.min.css';
// import '../css/Watchlist.css';

export default class Watchlist extends PureComponent {
    constructor(props, context) {
        super(props, context)

        this.incrementProgress = this.incrementProgress.bind(this);
        this.decrementProgress = this.decrementProgress.bind(this);

        this.state = {
            // TODO: possibly store this in chrome.storage to avoid GET calls   
            userEntries: [],
        }
    }

    componentDidMount() {
        // TODO: Token needs to be refreshed but by default it expires every 30 days (not sure if I have to refresh it they can just login again)
        /*
        window.setInterval(() => {
            getChromeStorageItem("token");
            // axios.post("url", payload, headers)
        }, 3000)
        */

        // TODO: need to keep user logged in use chrome.storage

        // Make GET request
        // TODO: check if this is in chrome.storage (if so avoid GET call and grab from storage)
        getList().then(result => {
            // Need additional information for the anime and manga
            const newData = result.data;
            const newEntriesProgress = [];

            // Convert included array into hashtable
            const included = result.included.reduce((accumulator, currentValue) => {
                accumulator[currentValue.id] = currentValue;
                return accumulator;
            }, {});

            for (let entry of newData) {
                let id = null;

                // check if there's information in the relationship.anime, if null check manga
                if (entry.relationships.anime.data) {
                    id = entry.relationships.anime.data.id;
                } else {
                    id = entry.relationships.manga.data.id;
                }

                // NOTE: included is an object with the 'id' as the key property
                entry.included = included[id];
                newEntriesProgress.push(entry.attributes.progress)
            }

            this.setState({
                userEntries: newData,
                entriesProgress: newEntriesProgress
            });
        });
    } // end of componentDidMount()

    incrementProgress(id, progress, index) {
        increment(id, {
            "data": {
                "id": `${id}`,
                "type": "libraryEntries",
                "attributes": {
                    "progress": progress += 1
                }
            }
        })
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
        increment(id, {
            "data": {
                "id": `${id}`,
                "type": "libraryEntries",
                "attributes": {
                    "progress": progress -= 1
                }
            }
        })
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
        // NOTE: code snippet to make PATCH
        // Only parameter I need to pass is 'id'


    }

    erase() {
        chrome.storage.sync.set({ 'userId': null }, function () {
            console.log('test erased')
        })
    }
    render() {
        if (this.state.userEntries === null || this.state.userEntries.length === 0) { return null }
        else {
            let test = this.state.userEntries.slice()
            // TODO: have default img and name
            // TODO: add url slug
            let entryRows = this.state.userEntries.map((entry, index) => {
                // Minimize object property accessing
                let includedAttributes = entry.included.attributes;
                let entryType = entry.included.type;

                return (
                    <div key={entry.id} className="row bg-light" style={{ marginBottom: '20px', width: '100%' }}>
                        <div className="col-sm-3">
                            <img alt="thumbnail" className="img-thumbnail" src={includedAttributes.posterImage.medium} height={85} width={60} />
                        </div>
                        <div className="col-sm-5">
                            <h6>
                                {/* TODO: finish links to redirect to kitsu site */}
                                <a href={`https://kitsu.io/${entryType}/${includedAttributes.slug}`}>{includedAttributes.canonicalTitle}</a>
                            </h6>
                            <div>
                                <button onClick={() => { this.incrementProgress(entry.id, entry.attributes.progress, index) }}>+</button>
                                <button onClick={() => { this.decrementProgress(entry.id, entry.attributes.progress, index) }}>-</button>
                            </div>
                            <span>{entryType === "anime" ? "Ep." : "Ch."} {this.state.entriesProgress[index]}</span>
                        </div>
                    </div>
                )
            });

            return (
                <div className="flex-container" style={{ width: '300px' }}>
                    <button onClick={this.erase} type="button">erase</button>
                    <div className="row">
                        <h1 className="col-12">Watch list</h1>
                    </div>
                    <div className="row">
                        <div className="template-container flex-container col-12">
                            {entryRows}
                        </div>
                    </div>
                    {/* <pre>{JSON.stringify(this.state.data, null, 4)}</pre> */}
                </div>
            )
        }
    }
}
