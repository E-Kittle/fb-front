// This file is used for management of API calls not related
// to user authentication/registration

import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://localhost:5000/";

// Grab the current users friendslist
// API uses bearer token to gran currentusers data
const getCurrentFriends = () => {
    const config = authHeader();
    return axios.get(`${API_URL}user/friends`, config)
}

// Grabs the friends of another users profile
// Not working
const getFriends = (user) => {
    return axios.get(`${API_URL}${user.id}/friends`)
}


// Grab the current users friend requests
const getFriendRequests = () => {
    const config = authHeader();
    return axios.get(`${API_URL}user/friendreq`, config)
}

// Grabs the current users newsfeed (for profile)


// Grabs the current users HOME newsfeed (newsfeed from friends)

export {
    getCurrentFriends,
    getFriendRequests,
};