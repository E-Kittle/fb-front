import React, { useReducer, useEffect } from 'react';
import Routes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/style.css';
import { authenticateUser } from './services/auth.service'
import Nav from './components/Nav'


// Export context for the user reducerhook
export const UserContext = React.createContext();

// Set up Reducer state and function
const initialState = {
  id: '',
  first_name: '',
  last_name: '',
  email: ''
}

// Reducer method to either set the user in state or logout the user
const reducer = (state, action) => {
  switch (action.type) {
    case 'setUser':
      return {
        id: action.payload.id,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        email: action.payload.email
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
          {currentUser.first_name === ''? null : <Nav /> }
          <Routes />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
