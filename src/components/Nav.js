import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { logout } from '../services/auth.service';
import { Link } from 'react-router-dom';
import { findFriend } from '../services/user.service';
import { useHistory } from 'react-router-dom';

const Nav = () => {


    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;


    // Router method for re-routing user after successful logout
    let history = useHistory();


    const logoutUser = () => {
        userContext.userDispatch({ type: 'logoutUser' })
        logout();
        history.push('/')
    }


    // State and function to manage 'find friend' search
    const [friendSearch, setFriendSearch] = useState('');
    const handleChange = (e) => {
        setFriendSearch(e.target.value);
    }

    // State and function to manage searching for the 'find friend' search
    const [searchResults, setSearchResults] = useState([])
    const [searchDropDown, setSearchDropDown] = useState(false);
    const manageSearch = (e) => {
        e.preventDefault();
        if (friendSearch === '') {
            setSearchResults([]);
            setSearchDropDown(false);
        } else {

            let query = friendSearch.replace(' ', '+')
            findFriend(query)
                .then((results) => {
                    setSearchResults(results.data.search)
                })
                .catch((error) => {
                    console.log('error')
                    console.log(error)
                })
            setSearchDropDown(true)
        }
    }

    const clearDropDown = () => {
        setSearchDropDown(false);
        setSearchResults([]);
        setFriendSearch('');
    }

    // State and method to toggle the menu for responsive design
    const [menu, setMenu] = useState(false);
    const toggleMenu = () => {
        setMenu(!menu);
    }


    return (
        <nav>
            <div className='nav-1'>
                <Link to='/' id='nav-title'>OdinBook</Link>
                <div className='dropdown-anchor'>
                    <form onSubmit={manageSearch}>
                        <label htmlFor='find-friend'>Find Friend</label>
                        <input type='text' id='find-friend' name='find-friend' placeholder='Find Friend' onChange={handleChange} initialvalue={friendSearch} value={friendSearch}></input>
                    </form>
                    {!searchDropDown ? null :
                        <div className='search-results' onClick={clearDropDown}>
                            {searchResults.length === 0 ? <p>No results found</p> :
                                <ul>
                                    {searchResults.map(result => {
                                        return (
                                            <li key={result._id}>
                                                <Link to={`/profile/${result._id}`}>{result.first_name} {result.last_name}</Link>
                                            </li>)
                                    })}
                                </ul>}
                        </div>}
                </div>
            </div>

            <div className='nav-2'>
                <div className={menu? 'menu-visible' : 'menu-invisible'}>
                    <div className='nav-2-1'>
                        <Link to='/' className='nav-element' onClick={toggleMenu}>Home</Link>
                        <Link to='/friends' className='nav-element' onClick={toggleMenu}>Friends</Link>
                        {/* Could add a dm option or possibly, an edit page option*/}
                        <Link to={`/profile/${currentUser.id}`} onClick={toggleMenu} className='nav-element'>
                            {currentUser.first_name} {currentUser.last_name}
                        </Link>
                        {/* To logout a user: delete JWT, clear user out of currentUser state */}
                        <button className='nav-element' id='logout' onClick={logoutUser}>Logout</button>
                    </div>
                </div>
                <button className='nav-dropdown' onClick={toggleMenu}>≡</button>
            </div>
        </nav>
    )

}

export default Nav