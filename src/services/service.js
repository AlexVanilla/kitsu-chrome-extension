/* global chrome */
"use strict"

import axios from 'axios';

const baseApiUrl = "https://kitsu.io/api/";

export function getList() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['userId', 'headers'], result => {
            resolve(_getListCallback(result.userId, result.headers))
        })
    });
}

function _getListCallback(userId, headers) {
    console.log('inliscb', userId, headers)
    return axios.get(`${baseApiUrl}edge/users/${userId}/library-entries?filter[status]=current&include=anime,manga`, headers)
        .then(response => response.data)
        .catch(onError);
}

export function updateProgress(id, payload) {
    const safePayload = {
        data: {
            attributes: {
                progress: payload.data.attributes.progress
            },
            id: payload.data.id,
            type: payload.data.type
        }
    }

    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['headers'], result => {
            resolve(_updateProgressCallback(id, safePayload, result.headers))
        })
    })
}

function _updateProgressCallback(id, safePayload, headers) {
    return axios.patch(`${baseApiUrl}edge/library-entries/${id}`, safePayload, { headers: headers })
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

                    chrome.storage.sync.set({ headers: headers, userId: newUserId }, () => {
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