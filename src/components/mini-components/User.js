import { Link } from 'react-router-dom';
import { addFriend } from '../../services/user.service'

const User = (props) => {
    const { user } = props;

    // Function to add a new friend 
    const addNewFriend = (e) => {
        addFriend(e.target.id)
            .then(results => {
                console.log('success!')
                props.updateAllFriends();       //Trigger an update to refresh the DOM
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    // Create a 'card' for each user that is not a friend
    return (
        <div className='friend-container' key={user._id}>
            <h3>{user.first_name} {user.last_name}</h3>
            <div>
                <Link className='friend-container-button' to={`/profile/${user._id}`}>View Profile</Link>
                <button className='friend-container-button' id={user._id} onClick={addNewFriend}>Add Friend</button>
            </div>
        </div>
    )
}

export default User