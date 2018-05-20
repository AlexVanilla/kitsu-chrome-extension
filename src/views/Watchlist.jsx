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
// import _ from 'lodash';
import SearchBar from '../shared/searchBar';
import CurrentLibraryEntries from '../shared/currentLibraryEntries';
import Loader from '../shared/loader';

export default class Watchlist extends PureComponent {
    state = {
        // TODO: possibly store this in chrome.storage to avoid GET calls   
        userEntries: [],
        searchResults: [],
        searchResultsDOM: null,
        loading: true
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

                // TODO: have default img and name
                // TODO: add url slug
                // let entryRows = this.state.userEntries.map((entry, index) => {

                // store in the state object
                // this.setState({ currentWatchlistDOM: entryRows })

                this.setState({
                    userEntries: newData,
                    loading: false
                });
            })
            .catch(error => {
                console.error('error getting list', error);
                chrome.storage.sync.set({ userId: null });
            })

    } // end of componentDidMount()

    logout() {
        chrome.storage.sync.set({ userId: null }, () => {
            console.log('logged out worked');
        })
    }

    search(searchInput) {
        if (searchInput) {
            console.log('search fired');
            search(searchInput)
                .then(result => {
                    console.log('back to watchlist', result)
                })
                .catch(error => {
                    console.error('error in search', error);
                })
        }

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
        let output = (this.state.userEntries === null || this.state.userEntries.length === 0) ? (<Loader />) : (<CurrentLibraryEntries libraryEntries={this.state.userEntries} />)


        const search = debounce(searchInput => {
            this.search(searchInput)
        }, 500);


        return (
            <div className="home-container">
                <div className="header">
                    <select>
                        <option value="anime,manga">Both</option>
                        <option value="anime">Anime</option>
                        <option value="manga">Manga</option>
                    </select>
                    <button className="btn-setting" type="button">Settings</button>
                    <button className="btn-logout" onClick={this.logout} type="button">Logout</button>
                </div>
                <br />
                <SearchBar onSearchTermChange={search} />
                <br />
                <div>
                    {output}
                </div>
                {/* <pre>{JSON.stringify(this.state.data, null, 4)}</pre> */}
            </div>
        )
    }
}
