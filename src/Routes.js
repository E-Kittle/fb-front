import { useContext } from 'react';
import { UserContext } from './App';
import { Switch, Route } from 'react-router-dom';

// Import components
import Login from './components/Login';
import Home from './components/Home';
import Friends from './components/Friends';
import Profile from './components/Profile';

const Routes = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    return (
        <Switch>
            <Route path='/' exact component={currentUser.email === '' ? Login: Home} />
            <Route path='/friends' component={Friends} />
            <Route path='/profile' exact component={Profile} />
            <Route path='/profile/:id' exact component={Profile} />
        </Switch>
    )

}

export default Routes