import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { getProfile, getProfileFeed } from '../services/user.service'


const Profile = (props) => {

    // 2 ways this component will be used: for currentuser or for another users profile (props.match.params.id===undefined when for another user)

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State to hold the profile data
    const [profileUser, setProfileUser] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        bio: ''
    });
    const [posts, setPosts] = useState([]);
    const [friends, setFriends] = useState([]);


    // Used to grab the profile owners data
    useEffect(() => {
        getProfile(props.match.params.id)
        .then(results => {
            setProfileUser(results.data.user);
            setFriends(results.data.friends);
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    // Used to grab the profile users posts
    useEffect(() => {
        getProfileFeed(props.match.params.id)
        .then(results => {
            setPosts(results.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])



    return (
        <div className='profile-wrapper'>
            <div className='profile-header-wrapper'>
                <div className='profile-header'>
                    {profileUser.first_name === ''? <h1>Loading...</h1> : null}
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