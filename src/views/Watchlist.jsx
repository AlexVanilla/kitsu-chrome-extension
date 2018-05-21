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
import SearchBar from '../shared/searchBar';
import SearchResults from '../shared/searchResults';
import CurrentLibraryEntries from '../shared/currentLibraryEntries';
import Loader from '../shared/loader';

import { search, getList, updateProgress, onError } from '../services/service.js';
import debounce from 'lodash.debounce';

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
                }

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

    logout = () => {
        chrome.storage.sync.set({ userId: null }, () => {
            console.log('logged out worked');
        })
    }

    querySearch = (searchInput) => {
        if (searchInput) {
            this.setState({ loading: true })
            search(searchInput)
                .then(result => {
                    this.setState(prevState => {
                        let newSearchResults = [...prevState.searchResults];
                        newSearchResults = result.data;
                        return {
                            searchResults: newSearchResults,
                            loading: false
                        }
                    });
                })
                .catch(error => {
                    console.error('error in search', error);
                })
        } else {
            this.setState(prevState => {
                return {
                    searchResults: [],
                    loading: false
                }
            });
        }
    }


    render() {
        let output = null;

        if (this.state.loading || this.state.userEntries === null || this.state.userEntries.length === 0) {
            output = <Loader />
        } else if (this.state.searchResults.length !== 0) {
            output = <SearchResults searchResults={this.state.searchResults} />
        } else {
            output = <CurrentLibraryEntries libraryEntries={this.state.userEntries} />
        }

        // Have the search function only fire after a certain amount of time (to prevent making excessive requests)
        const debounceQuerySearch = debounce(searchInput => {
            this.querySearch(searchInput)
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
                <SearchBar onSearchTermChange={debounceQuerySearch} />
                <br />
                {output}
                {/* <pre>{JSON.stringify(this.state.data, null, 4)}</pre> */}
            </div>
        )
    }
}
