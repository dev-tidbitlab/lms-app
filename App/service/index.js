import { APIURL } from '../../env'
import axios from 'axios'
export const GET = (url) => {
    console.log('APIURL + url==>> GET==', APIURL + url)
    return fetch(APIURL + url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => response.json())
        .then((responseData) => {
            return responseData
        })
//    return axios({
//         method: 'get',
//         url: APIURL + url,
//         withCredentials: true
//     }, { withCredentials: true })
//         .then(function (response) {
//             console.log(response,'response')
//             return response.data
//         });
};
export const POST = (url, Body) => {
    console.log('url, Body', url, Body)
    return fetch(APIURL + url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: Body
    }).then((response) => response.json())
        .then((responseData) => {
            return responseData
        })
};
export const FormPostAPI = (url, Body) => {
    console.log(APIURL + url)
    return fetch(APIURL + url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        credentials: 'include',
        body: Body
    }).then((response) => response.json())
        .then((responseData) => {
            return responseData
        })
};