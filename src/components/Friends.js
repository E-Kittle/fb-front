import { useState, useContext } from 'react';
import { getCurrentFriends } from '../services/user.service';
import Friend from './mini-components/Friend';
import FriendRequest from './mini-components/FriendRequest';
import { UserContext } from '../App';

const Friends = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    //State and function to toggle whether the user is viewing the current friends or pending requests
    const [friendReqActive, setFriendReqActive] = useState(true);
    const toggleList = (e) => {
        if (e.target.id === 'friend-toggle') {
            setFriendReqActive(false);
        } else {
            setFriendReqActive(true);
        }
    }

    const updateAllFriends = () => {
        // Makes an API call to grab all friends from state, then sends that through dispatch
        getCurrentFriends()
        .then(result => {
            console.log('after getcurrentfriends')
            console.log(result)
            userContext.userDispatch({ type: 'updateAllFriends', payload: {friends: result.data.friends, friendRequests: result.data.friend_requests }})
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className='friends-page-wrapper'>
            <div className='friends-page-sidebar'>
                <ul>
                    <li>
                        <button id='friend-req-toggle' className={friendReqActive ? 'sidebar-button active' : 'sidebar-button'} onClick={toggleList}>Friend Requests</button>
                    </li>
                    <li>
                        <button id='friend-toggle' className={!friendReqActive ? ' sidebar-button active' : 'sidebar-button'} onClick={toggleList}>All Friends</button>
                    </li>
                </ul>
            </div>
            <div className='friends-page-main'>
                {/* If friendReqActive=true, then user is viewing the friend request list */}
                {!friendReqActive ? <h2>All Friends</h2> : <h2>Friend Requests</h2>}
                <div className='friends-container'>
                    {console.log(currentUser)}
                    {friendReqActive && currentUser.friends.length === 0 ? <h3>Search for friends above!</h3> : null}
                    {!friendReqActive ? currentUser.friends.map(friend => { return (<Friend friend={friend} key={friend._id} updateAllFriends={updateAllFriends}/>) }) : <FriendRequest friendRequestList={currentUser.friendRequests} updateAllFriends={updateAllFriends}/>}
                </div>
            </div>
        </div>
    )

}

export default Friends