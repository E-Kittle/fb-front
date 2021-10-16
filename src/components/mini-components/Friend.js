import { Link } from 'react-router-dom';
import { deleteFriend } from '../../services/user.service';

// Component displayed on Friends page - Displays existing friends
const Friend = (props) => {
    // Destructure props
    const { friend } = props;

    // Function to unfriend a user
    const handleRejection = (e) => {
        deleteFriend(e.target.id)
            .then(result => {
                props.updateAllFriends();   //Trigger update of currentUser.friends in context
            })
            .catch(error => {
                console.log(error)
            })
    }

    //Return the friend container
    return (
        <div className='friend-container' key={friend._id}>
            <h3>{friend.first_name} {friend.last_name}</h3>
            <div>
                <Link className='friend-container-button' to={`/profile/${friend._id}`}>View Profile</Link>
                <button className='friend-container-button' id={friend._id} onClick={handleRejection}>Unfriend</button>
            </div>
        </div>
    )
}

export default Friend