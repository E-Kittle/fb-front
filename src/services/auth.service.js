// This file uses axios for registering, logging in, and logging out the user
// It also contains a method for getting the current users information
import axios from "axios";
// import authHeader from './auth-header';

const API_URL = "http://localhost:5000/";

// Registers a new user 
const register = (newUser) => {
    return axios.post(API_URL + "user/", newUser);
};




export {
    register
};