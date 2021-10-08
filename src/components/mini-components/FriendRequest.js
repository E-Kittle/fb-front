import { useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import { rejectFriendRequest, acceptFriendRequest } from '../../services/user.service';


const FriendRequest = (props) => {

    //Destructure props
    const { friendRequestList } = props;

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // Event handler to reject a friend request
    const handleRejection = (e) => {
        console.log(`would reject request for request: ${e.target.id}`)
        rejectFriendRequest(e.target.id)
        .then(response => {
            props.grabFriendRequests();
        })
        .catch(error => {
            console.log(error)
        })
    }

    // Event handler to accept a friend request
    const handleAcceptance = (e) => {
        console.log(`would accept request for request: ${e.target.id}`)
        acceptFriendRequest(e.target.id)
        .then(response => {
            console.log('worked')
            props.grabFriends();
            props.grabFriendRequests();
        })
        .catch(error => {
            console.log(error)
        })
    }

    // Function/Component to display the appropriate data to the DOM - Appropriate data is defined
    // as a request received by the user
    const PendingRequest = (props) => {
        if (props.friend.requestee._id === currentUser.id) {
            return null;
        } else {
            return (
                <div className='friend-container' key={props.friend.requestee._id}>
                    <h3>{props.friend.requestee.first_name} {props.friend.requestee.last_name}</h3>
                    <div id='pending-friend-container'>
                        <Link className='friend-container-button' to={`/profile/${props.friend.requestee._id}`}>View Profile</Link>
                        <button id={props.friend._id} className='friend-container-button' onClick={handleAcceptance}>Accept</button>
                        <button id={props.friend._id} className='friend-container-button' onClick={handleRejection}>Reject</button>
                    </div>
                </div>
            )
        }
    }

    // Function/Component to display the appropriate data to the DOM - Appropriate data is for
    // requests sent by the user
    const SentRequest = (props) => {
        if (props.friend.requestee._id === currentUser.id) {
            return (
                <div className='friend-container' key={props.friend.requested._id}>
                    <h3>{props.friend.requested.first_name} {props.friend.requested.last_name}</h3>
                    <div>
                        <Link className='friend-container-button' to={`/profile/${props.friend.requested._id}`}>View Profile</Link>
                        <button id={props.friend._id} className='friend-container-button' onClick={handleRejection}>Cancel Request</button>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }


    return (
        <div className='friend-req-wrapper'>
            {friendRequestList.length === 0? <h3>Search for friends above!</h3> : null}
            <div className='users-pending-requests'>
                {friendRequestList.length===0? null : <h3>Your Pending Requests</h3>}
                <div className='request-wrapper'>
                    {friendRequestList.map(friend => <PendingRequest friend={friend} key={friend._id}/>)}
                </div>
            </div>
            <div className='users-sent-requests'>
            {friendRequestList.length===0? null : <h3>Your Sent Requests</h3> }
                <div className='request-wrapper'>
                    {friendRequestList.map(friend => <SentRequest friend={friend} key={friend._id} />)}
                </div>
            </div>
        </div>
    )
}

export default FriendRequest