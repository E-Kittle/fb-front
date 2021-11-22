// This file uses axios for registering, logging in, and logging out the user
// It also contains a method for getting the current users information
import axios from "axios";
import {authHeader} from './auth-header';

const API_URL = "https://glacial-beyond-22328.herokuapp.com/";
// const API_URL = "http://localhost:5000/"

// Registers a new user 
const register = (newUser) => {
    return axios.post(API_URL + "user/", newUser);
};

//To login a user
const login = (user) => {
    return axios
        .post(API_URL + "session", user)

        // API call was successful, set the token in local storage and return the response
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response;
        })

        // API call failed, return the error with appropriate data
        .catch((err) => {
            return err.response;
        })
};

// Logs a user out locally by removing their token from localstorage
const logout = () => {
    localStorage.removeItem("user");
  };


//Function used to authenticate a returning user - Allowing the user to bypass logging in again
const authenticateUser = (config) => {
      return axios.get(`${API_URL}session`, config);
}




export {
    register, login, logout, authenticateUser
};