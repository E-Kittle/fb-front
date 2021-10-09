import { Link } from 'react-router-dom';
import { deleteFriend } from '../../services/user.service';


const Friend = (props) => {
    // Destructure props
    const { friend } = props;

    const handleRejection = (e) => {
        deleteFriend(e.target.id)
            .then(result => {
                props.updateAllFriends();
            })
            .catch(error => {
                console.log(error)
            })
    }


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