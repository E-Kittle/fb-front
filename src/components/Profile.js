import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { getProfile, getProfileFeed, addFriend, getFriendRequests, formatURL } from '../services/user.service'
import NewsPost from './mini-components/NewsPost';
// import Friend from './mini-components/Friend';
import { Link, useHistory } from 'react-router-dom';
import defaultProfileImg from '../assets/default.jpeg';
import NewImg from './modal/NewImg';


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
        bio: '',
        friends: [],
        cover_img: '',
    });
    const [posts, setPosts] = useState([]);

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
                let user = {
                    id: results.data.user._id,
                    first_name: results.data.user.first_name,
                    last_name: results.data.user.last_name,
                    email: results.data.user.email,
                    bio: results.data.user.bio,
                    friends: results.data.friends,
                    cover_img: results.data.user.cover_img
                }
                setProfileUser(user);
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
                {profileUser.friends.length === 0 ? <h2>User has no friends</h2> : null}
                {profileUser.friends.map(friend => {
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

    let history = useHistory();
    const addNewFriend = () => {
        console.log(props.match.params.id + ' Added as friend')

        addFriend(props.match.params.id)
            .then(results => {
                console.log('success!')
                getFriendRequests()
                    .then(result => {
                        userContext.userDispatch({ type: 'updateAllFriends', payload: { friends: result.data.friends, friendRequests: result.data.friend_requests } })
                        history.push('/friends')
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                if (error.response.status === 400) {
                    history.push('/friends')
                }
                console.log(error.response)
            })
        // Add them as a friend in the db
        // redirect for friend page

    }

    // Function to display the 'add friend' button if the user is not already a friend
    const NewFriend = () => {
        //Test to check if the profile belongs to a friend of the currentUser
        let currentFriend = false;
        currentUser.friends.forEach(friend => {
            if (friend._id === profileUser.id) {
                currentFriend = true; //If they match, the profile user is a friend of the current user
            }
        })
        //Test to check if the profile belongs to someone with a pending friend request
        let pendingRequest = false;
        currentUser.friendRequests.forEach(friendRequest => {
            if (friendRequest.requestee._id === profileUser.id || friendRequest.requested._id === profileUser.id) {
                pendingRequest = true;  //They match, the profile user has a pending friend request
            }
        })

        if (currentFriend) {
            return null;    //Users are already friends
        } else if (currentUser.id === profileUser.id) {
            return null; // The current user is the profile user
        } else if (pendingRequest) {
            //The user is not a current friend but they already have a pending request, display a link to friends page
            return <Link to='/friends' className='see-all'>See Pending Friend Request</Link>
        } else if (!currentFriend && !pendingRequest) {
            return <button className='friend-container-button' onClick={addNewFriend}>ADD FRIEND</button>
        } else {
            return null;
        }
    }

    //State to hold the modal toggle
    const [modal, setModal] = useState(false);
    const [modalCover, setModalCover] = useState(true);    //State to hold whether the modal is for a profile or cover image
    const toggleModal = (e) => {
        if(e!== undefined && e.target.id==='profile-img-button') {
            //User is toggling the modal to create a new profile image
            setModal(true);
            setModalCover(true);
        } else {
            setModal(false)
        }
    }

    const updateProfile = (data) => {
        if (data.cover) {
            console.log('updating coverphoto')

            setProfileUser(prevState => ({
                ...prevState,
                cover_img: data.cover
            }))
        } else {
            console.log('updating profile image')
        }
    } 


    return (
        <div className='profile-wrapper'>
            {console.log(profileUser)}
            <div className='profile-header-wrapper'>
                <div id='profile-img-wrapper'>
                    {profileUser.cover_img === undefined || profileUser.cover_img===''? 
                    <img id='profile-img' src={defaultProfileImg} alt='Cover' /> :
                    <img id='profile-img' src={formatURL(profileUser.cover_img)} alt='Cover' />
                }
                    {currentUser.id===profileUser.id? <button id='profile-img-button' onClick={toggleModal}>+</button> : null}
                </div>
                <div className='profile-header'>
                    {profileUser.first_name === '' ? <h1>Loading...</h1> : null}
                    <h1>{profileUser.first_name} {profileUser.last_name}</h1>
                    <p>{profileUser.bio}</p>
                    {profileUser.id === currentUser.id ? null : <NewFriend />}
                    {profileUser.id === currentUser.id ? <button className='friend-container-button'>Edit Profile Photo</button> : null}
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
            {modal? <NewImg cover={modalCover} toggleModal={toggleModal} updateProfile={updateProfile}/> : null}
        </div>
    )
}

export default Profile;