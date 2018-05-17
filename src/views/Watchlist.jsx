/* TODO:
implement loader icon
clear chrome.storage (have some leftover code stored)
make interface
have user choose b/w getting just anime or just manga or all


TODO:
get library entry
make a button that will bring a modal
populate response to form
*/


import React, { PureComponent } from 'react';
import { getList, updateProgress, onError } from '../services/service.js';
// import { test } from '../shared/test.gif'

export default class Watchlist extends PureComponent {
    constructor(props, context) {
        super(props, context)

        this.incrementProgress = this.incrementProgress.bind(this);
        this.decrementProgress = this.decrementProgress.bind(this);
        this.search = this.search.bind(this);

        this.state = {
            // TODO: possibly store this in chrome.storage to avoid GET calls   
            userEntries: [],
            searchResults: [],
            loading: true
        }
    }

    componentDidMount() {
        getList()
            .then(result => {
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
                    entriesProgress: newEntriesProgress,
                    loading: false
                });
            })
            .catch(error => {
                console.error('error getting list', error);
                chrome.storage.sync.set({ userId: null });
            })
    } // end of componentDidMount()

    incrementProgress(id, progress, index) {
        updateProgress(id, {
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
        updateProgress(id, {
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
    }

    logout() {
        chrome.storage.sync.set({ userId: null }, () => {
            console.log('logged out worked');
        })
    }

    search() {
        // TODO: GET https://kitsu.io/api/edge/anime?filter[text]=afro
        /*
        {
            "data": [
                {
                    "id": "1165",
                    "type": "anime",
                    "links": {
                        "self": "https://kitsu.io/api/edge/anime/1165"
                    },
                    "attributes": {
                        "createdAt": "2013-02-20T16:18:44.268Z", 
                        "updatedAt": "2018-05-16T00:17:11.522Z", 
                        "slug": "afro-samurai", 
                        "synopsis": "When he was a young boy, Afro witnessed his father be cut down in a duel at the hands of a man known only as Justice. After ...,
                        "posterImage": {

                        }

                        */
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
                    <i className="fas fa-search"></i>
                    <i className="fas fa-user"></i>
                    <button onClick={this.logout} type="button">Logout</button>
                    <input type="text" placeholder="Search" />
                    <button>test<i className="fas fa-search"></i></button>
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
