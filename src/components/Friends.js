import { useEffect, useState } from 'react';
import { getCurrentFriends, getFriendRequests } from '../services/user.service';
import Friend from './min-components/Friend';
import FriendRequest from './min-components/FriendRequest';

const Friends = () => {

    const [ friendsList, setFriendsList ] = useState([]);
    const [ friendRequestList, setFriendRequestList ] = useState([]); 
    const [ friendReqActive, setFriendReqActive ] = useState(true);


    useEffect(() => {
        // Grabs current users friends
        getCurrentFriends()
            .then(result => {
                setFriendsList(result.data.friends);
            })
            .catch(err => {
                console.log(err.result)
            });


    }, [])

    useEffect(() => {
        // Grabs current users friend requests
        getFriendRequests()
            .then(result => {
                setFriendRequestList(result.data.results);
            })
            .catch(err => {
                console.log(err.result)
            });
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
                        <button id='friend-toggle' onClick={toggleList}>Friend Requests</button>
                    </li>
                    <li>
                    <button id='friend-req-toggle' onClick={toggleList}>All Friends</button>
                    </li>
                </ul>
            </div>
            <div className='friends-container'>
                {/* If friendReqActive=true, then user is viewing the friend request list */}
                {friendReqActive? friendsList.map(friend => {return (<Friend friend={friend} />)}) : friendRequestList.map(friend => {return (<FriendRequest friend={friend} />)}) }
            </div>
        </div>
    )

}

export default Friends