import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { getProfile, getProfileFeed, addFriend } from '../services/user.service'
import NewsPost from './mini-components/NewsPost';
// import Friend from './mini-components/Friend';
import { Link, useHistory } from 'react-router-dom';


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

    // State and function to toggle whether the user is viewing
    // the newsfeed or the friends list
    const [feedToggle, setFeedToggle] = useState(true);
    const toggleFeed = (e) => {
        if (e.target.id === 'posts') {
            setFeedToggle(true);
        } else if (e.target.id === 'friends') {
            setFeedToggle(false);
        }
    }

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
    }, [props.match.params.id])

    // Used to grab the profile users posts
    useEffect(() => {
        getProfileFeed(props.match.params.id)
            .then(results => {
                setPosts(results.data)
            })
            .catch(error => {
                console.log(error)
            })

        setFeedToggle(true)
    }, [props.match.params.id])



    const ProfileFeed = (props) => {

        return (
            <div>
                {posts.length === 0 ? <h2>User has no posts</h2> : null}
                {posts.map(post => {
                    return <NewsPost post={post} key={post._id} />
                })}
            </div>
        )
    }

    const ProfileFriends = (props) => {
        return (
            <div>
                {friends.length === 0 ? <h2>User has no friends</h2> : null}
                {friends.map(friend => {
                    return (
                        <div className='profile-friend' key={friend._id}>
                            <button className='user-img'>{friend.first_name[0]}{friend.last_name[0]}</button>
                            <Link to={`${friend._id}`} id={friend._id}>{friend.first_name} {friend.last_name}</Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    // Router method for re-routing user after successful logout
    let history = useHistory();
    const addNewFriend = () => {
        console.log(props.match.params.id + ' Added as friend')

        addFriend(props.match.params.id)
            .then(results => {
                console.log('success!')
                history.push('/friends')
            })
            .catch(error => {
                if (error.response.status===400) {
                    history.push('/friends')
                }
                console.log(error.response)
            })
        // Add them as a friend in the db
        // redirect for friend page

    }

    console.log(currentUser)
    console.log(friends)
    const NewFriend = () => {
        let test = true;
        currentUser.friends.forEach(currentFriend => {
            friends.forEach(profileFriend => {
                if (currentFriend === profileFriend._id) {
                    test = false;
                }
            })
        })
        if (test) {
            return null;
        } else {
            return <button className='friend-container-button' onClick={addNewFriend}>ADD FRIEND</button>
        }
    }

    return (
        <div className='profile-wrapper'>
            <div className='profile-header-wrapper'>
                <div className='profile-header'>
                    {profileUser.first_name === '' ? <h1>Loading...</h1> : null}
                    <h1>{profileUser.first_name} {profileUser.last_name}</h1>
                    <p>{profileUser.bio}</p>
                    {profileUser._id === currentUser.id ? null : <NewFriend />}
                </div>
                <hr />
                <div className='profile-buttons'>
                    <button id='posts' className={feedToggle ? 'active feed-buttons' : 'feed-buttons'} onClick={toggleFeed}>Posts</button>
                    <button id='friends' className={feedToggle ? 'feed-buttons' : 'active feed-buttons'} onClick={toggleFeed}>Friends</button>
                </div>
            </div>
            <div className='profile-content-wrapper'>
                <div>
                    {feedToggle ? <ProfileFeed /> : <ProfileFriends />}
                </div>
            </div>
        </div>
    )
}

export default Profile;