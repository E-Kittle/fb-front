import React, { useReducer, useEffect } from 'react';
import Routes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/style.css';
import Nav from './components/Nav';
import { getFriendRequests } from './services/user.service';
import { logout, authenticateUser } from './services/auth.service';
import Footer from './components/Footer';
// Export context for the user reducerhook
export const UserContext = React.createContext();

// Set up Reducer state and function
const initialState = {
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  friends: [],
  friendRequests: [],
  cover_img: ''
}

// Reducer method to either set the user in state or logout the user
const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser':
      return {
        id: action.payload.user.id,
        first_name: action.payload.user.first_name,
        last_name: action.payload.user.last_name,
        email: action.payload.user.email,
        friends: action.payload.user.friends,
        friendRequests: action.payload.friendRequests,
        cover_img: action.payload.user.cover_img
      }

    case 'logoutUser':
      return initialState

    case 'updateUser':
      return {
        ...state,
        cover_img: action.payload.cover
      }

    case 'updateAllFriends':
      return {
        ...state,
        friendRequests: action.payload.friendRequests,
        friends: action.payload.friends
      }

    case 'updateFriendRequests':
      return {
        ...state,
        friendRequests: action.payload.friendRequests
      }
    default:
      return state

  }
}


function App() {
  // useReducer hook for the user
  const [currentUser, dispatch] = useReducer(reducer, initialState);

  // Checks if a token exists in the users localStorage, if so, it pings the database
  // to check if the session is still active and 'logs in' the user on client side
  // Additionally, catches any page refresh that would 'logout' the user
  useEffect(() => {
    if (authenticateUser() === null) {
      // User has expired token, log them out
      logout();
    } else {

      authenticateUser()
      .then(response => {
        //User was successfully authenticated. 
        //Now grab their friend request list
        getFriendRequests()
        .then(result => {
          // Now, update the context/reducer with the data
          dispatch({ type: 'setUser', payload: {user: response.data.user, friendRequests: result.data.results }})
          // reducer({ type: 'setUser', payload: {user: response.data.user, friendRequests: result.data.results }})
        })
        .catch(err => {
          console.log('error in app')
          console.log(err.response)
        });
      })
      .catch(err => {
        console.log('error in app/expired token: logout')
        // A token exists from a previous authentication but is no longer valid, remove from localStorage
        logout();
      })
    }
    }, [])


  return (
    <UserContext.Provider
      value={{ currentUser, userDispatch: dispatch }}
    >
      <Router>
        <div className='app'>
          <div>

          {currentUser.first_name === '' ? null : <Nav />}
          <Routes />
          </div>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
