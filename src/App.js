import React, { useReducer, useEffect } from 'react';
import Routes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/style.css';
import { authenticateUser } from './services/auth.service'


// Export context for the user reducerhook
export const UserContext = React.createContext();

// Set up Reducer state and function
const initialState = {
  id: '',
  username: '',
  email: '',
  admin: false
}

// Reducer method to either set the user in state or logout the user
const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser':
      return {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        admin: action.payload.admin,
      }
    case 'logoutUser':
      return initialState

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
    authenticateUser(dispatch);
  }, [])


  return (
    <UserContext.Provider
      value={{ currentUser, userDispatch: dispatch }}
    >
      <Router>
        <div className='app'>
          <Routes />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
