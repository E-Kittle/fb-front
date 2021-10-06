import { useContext } from 'react';
import { UserContext } from '../../App';


const FriendRequest = (props) => {

    //Destructure props
    const { friendRequestList } = props;

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;


    const PendingRequest = (props) => {
        if (props.friend.requestee._id === currentUser.id) {
            return null;
        } else {
            return (
                <div className='friend-container' key={props.friend.requestee._id}>
                    <h3>{props.friend.requestee.first_name} {props.friend.requestee.last_name}</h3>
                    <div id='pending-friend-container'>
                        <a className='friend-container-button' href={`/profile/${props.friend.requestee._id}`}>View Profile</a>
                        <button className='friend-container-button'>Accept</button>
                        <button className='friend-container-button'>Reject</button>
                    </div>
                </div>
            )
        }
    }

    const SentRequest = (props) => {
        if (props.friend.requestee._id === currentUser.id) {
            return (
                <div className='friend-container' key={props.friend.requested._id}>
                    <h3>{props.friend.requested.first_name} {props.friend.requested.last_name}</h3>
                    <div>
                        <a className='friend-container-button' href={`/profile/${props.friend.requested._id}`}>View Profile</a>
                        <button className='friend-container-button'>Cancel Request</button>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }


    // Need to break this down into the currentUser being the requestee vs. requested
    // 'Your pending requests' and 'Your sent requests'
    return (
        <div className='friend-req-wrapper'>
            {console.log(friendRequestList)}
            <div className='users-pending-requests'>
                <h3>Your Pending Requests</h3>
                <div className='request-wrapper'>
                    {friendRequestList.map(friend => <PendingRequest friend={friend} key={friend._id}/>)}
                </div>
            </div>
            <div className='users-sent-requests'>
                <h3>Your Sent Requests</h3>
                <div className='request-wrapper'>
                    {friendRequestList.map(friend => <SentRequest friend={friend} key={friend._id} />)}
                </div>
            </div>
        </div>
    )
}

export default FriendRequest