import { useState, useContext, useEffect } from 'react';
import { getCurrentFriends, getUsers } from '../services/user.service';
import Friend from './mini-components/Friend';
import FriendRequest from './mini-components/FriendRequest';
import { UserContext } from '../App';
import User from './mini-components/User';

const Friends = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State and function to grab all users 
    const [users, setUsers] = useState([]);
    useEffect(() => {

        //Grab all users from database
        getUsers()
            .then(result => {
                //Filter the users that are already friends, the currentUser, or a pending friend request exists
                let filtered = result.data.filter(user => {
                    let test1 = currentUser.friends.find(friend => user._id === friend._id);
                    let test2 = currentUser.friendRequests.find(request => user._id === request.requestee._id || user._id === request.requested._id);
                    if (currentUser.id === user._id) {
                        return false;
                    } else if (test1 === undefined && test2 === undefined) {
                        return true;
                    } else {
                        return false;
                    }
                })
                setUsers(filtered)
            })
            .catch(err => {
                console.log(err)
            })
    }, [currentUser])



    //State and function to toggle whether the user is viewing the current friends or pending requests
    const [active, setActive] = useState(0);
    const toggleList = (e) => {
        if (e.target.id === 'friend-toggle') {
            setActive(1);
        } else if (e.target.id === 'user-toggle') {
            setActive(2);
        } else {
            setActive(0)
        }
    }

    const updateAllFriends = () => {
        // Makes an API call to grab all friends from state, then sends that through dispatch
        getCurrentFriends()
            .then(result => {
                userContext.userDispatch({ type: 'updateAllFriends', payload: { friends: result.data.friends, friendRequests: result.data.friend_requests } })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // State and function to make the friends menu responsive
    const [friendVisibility, setFriendVisibility] = useState(false);
    const toggleVisibility = (e) => {
        setFriendVisibility(!friendVisibility);
    }


    return (
        <div className='friends-page-wrapper'>
            <div className='friends-page-sidebar'>
                {/* Initially, this is not visible. At 560px it becomes visible */}
                <h2>Filter Friends: </h2>
                <button className='toggle-friends' onClick={toggleVisibility}>+</button>
                <ul className={friendVisibility? 'visible-friends' : 'invisible-friends'}> 
                    <li>
                        <button id='friend-req-toggle' className={active === 0 ? 'sidebar-button active' : 'sidebar-button'} onClick={toggleList}>Friend Requests</button>
                    </li>
                    <li>
                        <button id='friend-toggle' className={active === 1 ? ' sidebar-button active' : 'sidebar-button'} onClick={toggleList}>All Friends</button>
                    </li>
                    <li>
                        <button id='user-toggle' className={active === 2 ? ' sidebar-button active' : 'sidebar-button'} onClick={toggleList}>All Users</button>
                    </li>
                </ul>
            </div>
            <div className='friends-page-main'>
                {/* If friendReqActive=true, then user is viewing the friend request list */}
                {active === 0 ? <h2>Friend Requests</h2> : active === 1 ? <h2>All Friends</h2> : <h2>All Users</h2>}
                <div className='friends-container'>
                    {active === 1 && currentUser.friends.length === 0 ? <h3>Search for friends above!</h3> : null}
                    {active === 1 ? currentUser.friends.map(friend => { return (<Friend friend={friend} key={friend._id} updateAllFriends={updateAllFriends} />) }) :
                        active === 0 ? <FriendRequest friendRequestList={currentUser.friendRequests} updateAllFriends={updateAllFriends} /> :
                            users.map(user => { return <User updateAllFriends={updateAllFriends} user={user} key={user._id} /> })}
                </div>
            </div>
        </div>
    )

}

export default Friends