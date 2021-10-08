import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { logout } from '../services/auth.service';
import { Link } from 'react-router-dom';
import { findFriend } from '../services/user.service';

const Nav = () => {


    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    const logoutUser = () => {
        userContext.userDispatch({ type: 'logoutUser' })
        logout();
    }


    // State and function to manage 'find friend' search
    const [friendSearch, setFriendSearch] = useState('');
    const handleChange = (e) => {
        setFriendSearch(e.target.value);
    }

    // State and function to manage searching for the 'find friend' search
    const [searchResults, setSearchResults] = useState([])
    const manageSearch = (e) => {
        e.preventDefault();
        let query = friendSearch.replace(' ', '+')
        findFriend(friendSearch)
            .then((results) => {
                setSearchResults(results.data.search)
            })
            .catch((error) => {
                console.log('error')
                console.log(error)
            })
    }

    return (
        <nav>
            <div className='nav-1'>
                <Link to='/' id='nav-title'>OdinBook</Link>
                <div className='dropdown-anchor'>
                    <form onSubmit={manageSearch}>
                        <label htmlFor='find-friend'>Find Friend</label>
                        <input type='text' id='find-friend' name='find-friend' required placeholder='Find Friend' onChange={handleChange} initialvalue={friendSearch} value={friendSearch}></input>
                    </form>
                    {searchResults.length === 0 ? null :
                        <div className='search-results'>
                            <ul>
                                {searchResults.map(result => {
                                    return (
                                        <li>
                                            <Link to={`/profile/${result._id}`}>{result.first_name} {result.last_name}</Link>
                                        </li>)
                                })}
                            </ul>
                        </div>}
                </div>
            </div>

            <div className='nav-2'>
                <Link to='/' className='nav-element'>Home</Link>
                <Link to='/friends' className='nav-element'>Friends</Link>
            </div>

            <div className='nav-3'>
                {/* Could add a dm option or possibly, an edit page option*/}
                <Link to={`/profile/${currentUser.id}`} className='nav-element'>
                    {currentUser.first_name} {currentUser.last_name}
                </Link>
                {/* To logout a user: delete JWT, clear user out of currentUser state */}
                <button className='nav-element' id='logout' onClick={logoutUser}>Logout</button>
            </div>

        </nav>
    )

}

export default Nav