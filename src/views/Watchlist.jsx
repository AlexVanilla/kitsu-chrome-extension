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

/* FIXME:
prevent user from exiting out of extension while in middle of PATCH request
*/


import React, { PureComponent } from 'react';
import { search, getList, updateProgress, onError } from '../services/service.js';
import debounce from 'lodash.debounce';
import _ from 'lodash';
import SearchBar from '../shared/searchBar';
// import { test } from '../shared/test.gif'

export default class Watchlist extends PureComponent {
    constructor(props, context) {
        super(props, context)

        this.incrementProgress = this.incrementProgress.bind(this);
        this.decrementProgress = this.decrementProgress.bind(this);
        this.showModal = this.showModal.bind(this);
        this.search = this.search.bind(this);
        this.test = this.test.bind(this);

        this.state = {
            // TODO: possibly store this in chrome.storage to avoid GET calls   
            userEntries: [],
            searchResults: [],
            loading: true
        }
    }

    componentDidMount() {
        // NOTE: this.state gets reset every time user exits out of extension
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

    logout() {
        chrome.storage.sync.set({ userId: null }, () => {
            console.log('logged out worked');
        })
    }

    test() {
        console.log('debounce test');
    }

    search(searchInput) {
        if (searchInput) {
            console.log('search fired');

            // _.debounce(() => { this.test() }, 200);

            // debounce(function() {
            //     console.log('debounce search fired')
            // }, 2000);

            // setTimeout(function() {
            //     console.log('delayed search fired')
            // }.bind(this), 2000);
            // console.log('search fired', input);

            // setTimeout(search(input), 3000)
        }


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

    showModal() {
        console.log('TODO: create modal function')
    }

    render() {
        if (this.state.userEntries === null || this.state.userEntries.length === 0) { return null }
        else {
            const search = _.debounce(searchInput => {
                this.search(searchInput)
            }, 500);

            // TODO: have default img and name
            // TODO: add url slug
            let entryRows = this.state.userEntries.map((entry, index) => {
                // Minimize object property accessing
                let includedAttributes = entry.included.attributes;
                let entryType = entry.included.type;

                return (
                    <div key={entry.id} className="flex-containerRow" style={{ marginBottom: '10px', width: '100%' }}>
                        <div>
                            <img alt="thumbnail" className="img-thumbnail" src={includedAttributes.posterImage.medium} height={85} width={60} />
                            {/* TODO: finish links to redirect to kitsu site */}
                        </div>
                        <div className="watchList-progressColumn">
                            <p className="watchList-title" href={`https://kitsu.io/${entryType}/${includedAttributes.slug}`}>{includedAttributes.canonicalTitle}</p>
                            <button className="watchList-progress" onClick={() => { this.decrementProgress(entry.id, entry.attributes.progress, index) }}>-</button>
                            <button className="watchList-progress" onClick={() => { this.incrementProgress(entry.id, entry.attributes.progress, index) }}>+</button>
                            <span>{entryType === "anime" ? "Ep." : "Ch."} {this.state.entriesProgress[index]}</span>
                            <p onClick={this.showModal}>
                                <i className="fas fa-edit"></i> Edit Entry
                            </p>
                        </div>
                    </div>
                )
            });

            return (
                <div className="flex-container">
                    <div className="flex-container-row">
                        <select>
                            <option value="anime,manga">Both</option>
                            <option value="anime">Anime</option>
                            <option value="manga">Manga</option>
                        </select>
                        <button className="" type="button">Settings</button>
                        <button className="watchList-logout" onClick={this.logout} type="button">Logout</button>
                    </div>
                    <br />
                    <SearchBar onSearchTermChange={search} />
                    <div>
                        <div className="template-container flex-container">
                            {entryRows}
                        </div>
                    </div>
                    {/* <pre>{JSON.stringify(this.state.data, null, 4)}</pre> */}
                </div>
            )
        }
    }
}
