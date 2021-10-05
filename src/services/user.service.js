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
const getNewsFeed = () => {
    const config = authHeader();
    return axios.get(`${API_URL}posts`, config)
}

// Grabs the current users HOME newsfeed (newsfeed from friends)



// Creates a new post
const createNewPost = (post) => {
    const config = authHeader();
    return axios.post(`${API_URL}posts`, {'content': post}, config)
} 

// Adds/Removes a like on a post - API handles removing a post
const likePost = (postid) => {
    const config = authHeader();
    console.log(config)
    return axios.put(`${API_URL}post/${postid}/like`, config)
}

export {
    getCurrentFriends,
    getFriendRequests,
    getNewsFeed,
    createNewPost,
    likePost
};