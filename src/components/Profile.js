import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';


const Profile = (props) => {

    // 2 ways this component will be used: for currentuser or for another users profile (props.match.params.id===undefined when for another user)

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State to hold the profile data
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [friends, setFriends] = useState([]);


    // Used to grab the profile owners data
    useEffect(() => {
        if (props.match.params.id === undefined) {
            // In this case, the profile belongs to the user so reference currentUser for all data
            setProfileUser(currentUser);
        } else {
            // Grab profile data based on id
        }
    }, [])

    // Used to grab the profile users posts
    useEffect(() => {

    })

    // Used to grab the profile users friends
    useEffect(() => {

    })


    return (
        <div className='profile-wrapper'>
            {console.log(props.match.params.id)}
            <div className='profile-header-wrapper'>
                <div className='profile-header'>
                    <h1>{profileUser.first_name} {profileUser.last_name}</h1>
                    <p>Bio</p>
                </div>
                <div className='profile-buttons'>
                    <button>Posts</button>
                    <button>Friends</button>
                </div>
            </div>
            <div className='profile-content-wrapper'>

            </div>
        </div>
    )
}

export default Profile;