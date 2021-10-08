import { useEffect, useState } from 'react';
import { getCurrentFriends, getFriendRequests } from '../services/user.service';
import Friend from './mini-components/Friend';
import FriendRequest from './mini-components/FriendRequest';

const Friends = () => {

    const [friendsList, setFriendsList] = useState([]);
    const [friendRequestList, setFriendRequestList] = useState([]);
    const [friendReqActive, setFriendReqActive] = useState(true);

    const grabFriends = () => {
        // Grabs current users friends
        getCurrentFriends()
            .then(result => {
                setFriendsList(result.data.friends);
            })
            .catch(err => {
                console.log(err.result)
            });
    }

    const grabFriendRequests = () => {
        // Grabs current users friend requests
        getFriendRequests()
            .then(result => {
                setFriendRequestList(result.data.results);
            })
            .catch(err => {
                console.log(err.result)
            });
    }

    // Effect to grab the friends list on page load
    useEffect(() => {
        grabFriends();
    }, [])

    // Effect to grab the friend request list on page load
    useEffect(() => {
        grabFriendRequests();
    }, []);

    const toggleList = (e) => {
        if (e.target.id === 'friend-toggle') {
            setFriendReqActive(false);
        } else {
            setFriendReqActive(true);
        }
    }

    return (
        <div className='friends-page-wrapper'>
            <div className='friends-page-sidebar'>
                <ul>
                    <li>
                        <button id='friend-req-toggle' className={friendReqActive? 'sidebar-button active': 'sidebar-button'} onClick={toggleList}>Friend Requests</button>
                    </li>
                    <li>
                        <button id='friend-toggle' className={!friendReqActive? ' sidebar-button active': 'sidebar-button'} onClick={toggleList}>All Friends</button>
                    </li>
                </ul>
            </div>
            <div className='friends-page-main'>
                {/* If friendReqActive=true, then user is viewing the friend request list */}
                {!friendReqActive ? <h2>All Friends</h2> : <h2>Friend Requests</h2>}
                <div className='friends-container'>
                    {!friendReqActive ? friendsList.map(friend => { return (<Friend friend={friend} key={friend._id} grabFriends={grabFriends}/>) }) : <FriendRequest friendRequestList={friendRequestList} grabFriendRequests={grabFriendRequests} grabFriends={grabFriends}/>}
                </div>
            </div>
        </div>
    )

}

export default Friends