// This file is used for management of API calls not related
// to user authentication/registration

import axios from "axios";
import {authHeader, authHeaderWithContent} from './auth-header';

const API_URL = "http://localhost:5000/";

// SERVICE REQUESTS FOR FRIENDS
// ------------------------------------------------------------------------------------

//Grab all users
const getUsers = () => {
    const config = authHeader();
    return axios.get(`${API_URL}users`, config)
}


// Users by the 'Find Friend' search bar to look for users matching the search query
const findFriend = (id) => {
    const config = authHeader();
    return axios.get(`${API_URL}user/${id}`, config)
}

// Grab the current users friendslist
// API uses bearer token to gran currentusers data
const getCurrentFriends = () => {
    const config = authHeader();
    return axios.get(`${API_URL}user/friends?all=true`, config)
}

// Grab the current users friend requests
const getFriendRequests = () => {
    const config = authHeader();
    return axios.get(`${API_URL}user/friendreq`, config)
}

// This just requires us to delete the friend request. It works for the reject and cancel friend request buttons
const rejectFriendRequest = (reqId) => {
    const config = authHeader();
    return axios.delete(`${API_URL}user/friendreq/${reqId}`, config)
}

// This approves the friend request and the API adds the friends to the friend lists
const acceptFriendRequest = (reqId) => {
    const config = authHeader();
    return axios.put(`${API_URL}user/friendreq/${reqId}`, {'data': ''}, config)
}

const deleteFriend = (friendId) => {
    const config = authHeader();
    return axios.delete(`${API_URL}user/friend/${friendId}`, config)
}

const addFriend = (friendId) => {
    const config = authHeader();
    return axios.post(`${API_URL}user/friend/${friendId}`, {'data': ''}, config)
}

// SERVICE REQUESTS FOR POSTS
// ------------------------------------------------------------------------------------
// Grabs the current users newsfeed (for profile)
const getNewsFeed = () => {
    const config = authHeader();
    return axios.get(`${API_URL}posts`, config)
}

// Creates a new post
const createNewPost = (post) => {
    let config = authHeaderWithContent();

    // Create the FormData object and append the images to it. 
    const formData = new FormData();
    const arr = Array.from(post.images);
    arr.forEach(file => {
        formData.append("photos", file)
    })
    formData.append('content', post.content)
    return axios.post(`${API_URL}posts`, {formData}, config)
} 

// Adds/Removes a like on a post - API handles removing a post
const likePost = (postid) => {
    const config = authHeader();
    return axios.put(`${API_URL}post/${postid}/like`, {'data': ''}, config)
}

// SERVICE REQUESTS FOR COMMENTS
// ------------------------------------------------------------------------------------

const createComment = (content, postId) => {
    const config = authHeader();
    return axios.post(`${API_URL}post/${postId}/comment`, content, config)
}


// Adds/Removes a like on a comment - API handles removing a comment
const likeComment = (commentId) => {
    const config = authHeader();
    return axios.put(`${API_URL}comment/${commentId}/like`, {'data': ''}, config)
}

// Edits a comment
const editComment = (content, commentId) => {
    const config = authHeader();
    return axios.put(`${API_URL}comment/${commentId}`, content, config)
}

// 'deletes' the comment - Just replaces text with 'deleted' so that replies aren't confusing
const deleteComment = (content, commentId) => {
    const config = authHeader();
    return axios.put(`${API_URL}comment/${commentId}`, content, config)
}


// SERVICE REQUESTS FOR USER PROFILE
// ------------------------------------------------------------------------------------
// Grabs the users profile data and friends list
const getProfile = (userId) => {
    const config = authHeader();
    return axios.get(`${API_URL}user/profile/${userId}`, config)
}

// Grabs the users personal newsfeed - Just their posts
const getProfileFeed = (userId) => {
    const config = authHeader();
    return axios.get(`${API_URL}user/profile/${userId}/feed`, config)
}

const updateCover = (file, id) => {
    let data = new FormData();
    data.append("cover", file);
    return axios.put(`${API_URL}user/profile/${id}/cover`, data, {headers: {"Content-Type": "multipart/form-data"}})
}


const formatURL = (end) => {
    return `${API_URL}${end}`
}

export {
    getCurrentFriends,
    getFriendRequests,
    getNewsFeed,
    createNewPost,
    likePost,
    rejectFriendRequest,
    acceptFriendRequest,
    deleteFriend,
    getProfile,
    getProfileFeed,
    findFriend,
    addFriend,
    likeComment,
    createComment,
    editComment,
    getUsers,
    updateCover,
    formatURL
};