/* global chrome */
import axios from 'axios';

const baseApiUrl = "https://kitsu.io/api/";
const headers = {
    "Accept": "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    // TODO: temp fix for user session
    "Authorization": "Bearer <authorization token>"
};
let userId = null;

export function increment(id, payload) {
    // TODO: make safe payload
    return axios.patch(`${baseApiUrl}edge/library-entries/${id}`, payload, {
            headers
        })
        .then(response => response)
        .catch(onError)
}

export function login(payload) {
    // make safe payload
    const safePayload = {
        username: payload.username,
        password: payload.password
    };

    // TODO: try using JSON instead of url encoded (I'm just picky and I wanna see if I can use JSON)
    return axios.post(`${baseApiUrl}oauth/token`, `grant_type=password&username=${safePayload.username}&password=${safePayload.password}`, headers)
        .then(response => {
            // set the token
            setToken(response.data)

            // update the request header
            headers.Authorization = `Bearer ${response.data.access_token}`;
            console.log(headers);

            // get the user id
            return axios.get(`${baseApiUrl}edge/users?filter[name]=${safePayload.username}`)
                .then(result => {
                    userId = result.data.data[0].id;
                    // find way to set userId
                    return userId
                })
                .catch(() => {
                    console.log(onError);
                })
        })
        .catch(onError)
}

export function getChromeStorageItem(input) {
    chrome.storage.sync.get([input], (result) => {
        if (chrome.runtime.error) {
            console.error("Runtime error in App.jsx!");
        }
        console.log(result)
        return result
    });
}

function setToken(token) {
    chrome.storage.sync.set({
        "token": token
    }, () => {
        if (chrome.runtime.error) {
            console.error("Runtime error in App.jsx!");
        }
    });
}

export function getList() {
    // return axios.get(`${baseApiUrl}edge/users/${userId}/library-entries?filter[status]=current&include=anime,manga`)
    // TODO: rely on chrome.storage
    return axios.get(`${baseApiUrl}edge/users/<userId>/library-entries?filter[status]=current&include=anime,manga`, headers)
        .then(response => response.data)
        .catch(onError);
}

export function xhrSuccess(response) {
    return response.data;
}

export function onError(error) {
    console.error("ERROR:  ", error);
    return Promise.reject(error);
}