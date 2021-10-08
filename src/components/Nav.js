import { useContext } from 'react';
import { UserContext } from '../App';
import { logout } from '../services/auth.service';
import { Link } from 'react-router-dom';

const Nav =() => {


        // Grab UserContext from app.js and destructure currentUser from it
        const userContext = useContext(UserContext);
        const { currentUser } = userContext;

        const logoutUser = () => {
            userContext.userDispatch({ type: 'logoutUser'})
            logout();
        }


    return (
        <nav>
            <div className='nav-1'>
                <Link to='/' id='nav-title'>OdinBook</Link>
                <form>
                    <label htmlFor='find-friend'>Find Friend</label>
                    <input type='text' id='find-friend' name='find-friend' placeholder='Find Friend'></input>
                </form>
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