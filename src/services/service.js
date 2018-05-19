/* global chrome */
/* NOTE: data.attributes for updating progress
data = {
    attributes: {
        createdAt: "2018-03-10T16:22:18.681Z",
        finishedAt: "2018-05-11T21:35:06.734Z",
        notes: "Overall it was a nice series.  Wish they delved more with more of the characters and I wished some relationships progressed more.",
        private: false,
        progress: 12,
        progressedAt: "2018-05-12T02:07:32.036Z",
        rating: "3.5",
        ratingTwenty: 14,
        reactionSkipped: "unskipped",
        reconsumeCount: 0,
        reconsuming: false,
        startedAt: "2018-03-11T08:45:02.693Z",
        status: "completed",
        updatedAt: "2018-05-12T02:07:32.036Z",
        volumesOwned: 0
    }
}
*/
"use strict"

import axios from 'axios';

const baseApiUrl = "https://kitsu.io/api/";

// NOTE: filters: [status]=current,planned,onHold,dropped

// Adding new series to library entry
// search GET https://kitsu.io/api/edge/anime?filter[text]=gun%20gale%20online

// get animeId

// POST to https://kitsu.io/api/edge/library-entries
/*var payload: {
    "data": {
        "attributes": {
            "status": "planned"
        },
        "relationships": {
            "anime": {
                "data": {
                    "type": "anime",
                    "id": "605" TODO: get animeId and put in this payload
                }
            },
            "user": {
                "data": {
                    "type": "users",
                    "id": "64982"
                }
            }
        },
        "type": "library-entries"
    }
}*/

// updating library entry 

/* PATCH payload
{
    "data": {
        "attributes": {
            "progress": "2"
        },
        "id": "25993558",
        "type": "libraryEntries"
    }
}*/




export function search(input) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['userId', 'headers'], result => {
            resolve(_searchCallback(input, result.headers))
        });
    });
}

function _searchCallback(input, headers) {
    // https://kitsu.io/api/edge/library-entries?filter[userId]=64982&filter[title]=houseki
    // https://kitsu.io/api/edge/anime?filter[text]=gun%20gale%20online
    // https://kitsu.io/api/edge/users/64982/library-entries?filter[animeId]=13600
    // https://kitsu.io/api/edge/library-entries?filter[userId]=64982&filter[animeId]=13600
    input = encodeURIComponent(input.trim());
    console.log('input', input);
    return axios.get(`${baseApiUrl}edge/anime?filter[text]=${input}`, headers)
        .then(response => {
            console.log('got response from search', response);
        })
        .catch(onError);
}

export function getList() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['userId', 'headers'], result => {
            resolve(_getListCallback(result.userId, result.headers))
        });
    });
}

function _getListCallback(userId, headers) {
    return axios.get(`${baseApiUrl}edge/users/${userId}/library-entries?filter[status]=current&include=anime,manga`, headers)
        .then(response => response.data)
        .catch(onError);
}

export function updateProgress(id, payload) {
    /*{
        "data": {
            "id": "25993558",
            "attributes": {
                "progress": 3
            },
            "relationships": {
                "anime": {
                    "data": {
                        "type": "anime",
                        "id": "13894"
                    }
                },
                "manga": {
                    "data": null
                }
            },
            "type": "library-entries"
        }
    }*/

    const safePayload = {
        data: {
            id: payload.data.id,
            attributes: {
                progress: payload.data.attributes.progress
            },
            type: "library-entries"
        }
    }

    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['headers'], result => {
            resolve(_updateProgressCallback(id, safePayload, result.headers))
        })
    })
}

function _updateProgressCallback(id, safePayload, headers) {
    return axios.patch(`${baseApiUrl}edge/library-entries/${id}`, safePayload, {
            headers: headers
        })
        .then(response => response)
        .catch(onError)
}

export function login(payload) {
    const safePayload = {
        username: payload.username,
        password: payload.password
    };

    const headers = {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
    }

    return axios.post(`${baseApiUrl}oauth/token`, `grant_type=password&username=${safePayload.username}&password=${safePayload.password}`, headers)
        .then(response => {
            // Add authorization token to headers
            // NOTE: Authorization token lasts for 30 days
            headers.Authorization = `Bearer ${response.data.access_token}`;

            // Get the user's id
            return axios.get(`${baseApiUrl}edge/users?filter[name]=${safePayload.username}`)
                .then(result => {
                    let newUserId = result.data.data[0].id;

                    chrome.storage.sync.set({
                        headers: headers,
                        userId: newUserId
                    }, () => {
                        chrome.storage.sync.get(result => {
                            console.log(result);
                        });
                    });
                })
        })
        .catch(onError)
}

export function xhrSuccess(response) {
    return response.data;
}

export function onError(error) {
    console.error("ERROR:  ", error);
    return Promise.reject(error);
}