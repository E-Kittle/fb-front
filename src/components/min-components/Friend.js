
const Friend = (props) => {

    // Destructure props
    const { friend } = props;

    return (
        <div className='friend-container' key={friend._id}>
            <h3>{friend.first_name} {friend.last_name}</h3>
            <div>
                <a className='friend-container-button' href={`/profile/${friend._id}`}>View Profile</a>
                <button className='friend-container-button'>Unfriend</button>
            </div>
        </div>
    )
}

export default Friend