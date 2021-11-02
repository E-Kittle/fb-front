import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { getProfile, getProfileFeed, addFriend, getFriendRequests } from '../services/user.service'
import NewsPost from './mini-components/NewsPost';
import { Link, useHistory } from 'react-router-dom';
import defaultProfileImg from '../assets/default.jpeg';
import NewImg from './modal/NewImg';


const Profile = (props) => {
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
        profile_img: '',
    });
    const [posts, setPosts] = useState([]);     //State to hold the posts
    // State used by children components to trigger whether the feed needs to be updated or not
    const [updateTheFeed, setUpdateTheFeed] = useState(false);

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
                    cover_img: results.data.user.cover_img,
                    profile_img: results.data.user.profile_img
                }
                setProfileUser(user);   //Save the user in state
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
    }, [props.match.params.id, updateTheFeed])

    // Update the 'updateTheFeed' state - This triggers a new API call for the feed
    const updateFeed = () => {
        setUpdateTheFeed(!updateTheFeed);
    }

    //Component to display the NewsPosts on the profile
    const ProfileFeed = (props) => {
        return (
            <div>
                {posts.length === 0 ? <h2>User has no posts</h2> : null}
                {posts.map(post => {
                    return <NewsPost post={post} key={post._id} updateFeed={props.updateFeed} />
                })}
            </div>
        )
    }

    //Component to display the users friends on their profile
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

    let history = useHistory(); //Used to redirect users
    //Function to add a new friend from that users profile
    const addNewFriend = () => {
        addFriend(props.match.params.id)
            .then(results => {
                //Success! Now get the updated list of friendrequests and update userContext
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
                // error - redirect for friend page
                if (error.response.status === 400) {
                    history.push('/friends')
                }
                console.log(error.response)
            })

    }

    // Component to display the 'add friend' button if the user is not already a friend
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
            return <button className='friend-container-button' onClick={addNewFriend}>ADD FRIEND</button> //Not friends! Display add friend button
        } else {
            return null;
        }
    }

    //State to hold the modal toggle
    const [modal, setModal] = useState(false);
    const [modalCover, setModalCover] = useState(true);    //State to hold whether the modal is for a profile or cover image

    //Function to toggle the NewImg modal - 
    const toggleModal = (e) => {
        if (e.target.id === 'cover-img-button') {
            //User is toggling the modal to create a new cover image
            setModal(true);
            setModalCover(true);
        } else if (e.target.id === 'profile-img-button') {
            //User is toggling the modal to add a new profile img
            setModal(true)
            setModalCover(false)
        } else {
            setModal(false)
        }
    }

    //Closes the modal
    const closeModal = () => {
        setModal(false)
    }

    //Function to update the user profile following an img update
    const updateProfile = (data) => {
        if (data.cover) {
            // updating due to new cover photo
            setProfileUser(prevState => ({
                ...prevState,
                cover_img: data.cover
            }))
        } else {
            // updating due to new profile photo
            setProfileUser(prevState => ({
                ...prevState,
                profile_img: data.profile
            }))
        }
    }


    return (
        <div className='profile-wrapper'>
            <div className='profile-header-wrapper'>
                <div className={profileUser.profile_img === '' || profileUser.profile_img === undefined ? 'top-profile-header' : 'top-profile-header profile-banner'} style={profileUser.profile_img === '' || profileUser.profile_img === undefined ? { backgroundImage: 'none' } : { backgroundImage: `url(${profileUser.profile_img})` }}>

                    <div id='profile-img-wrapper'>
                        {profileUser.cover_img === undefined || profileUser.cover_img === '' ?
                            <img id='profile-img' src={defaultProfileImg} alt='Cover' /> :
                            <img id='profile-img' src={profileUser.cover_img} alt='Cover' />
                        }
                        {currentUser.id === profileUser.id ? <button id='cover-img-button' onClick={toggleModal}>+</button> : null}
                    </div>
                    <div className='profile-header'>
                        {profileUser.first_name === '' ? <h1>Loading...</h1> : null}
                        <h1>{profileUser.first_name} {profileUser.last_name}</h1>
                        <p>{profileUser.bio}</p>
                        {profileUser.id === currentUser.id ? null : <NewFriend />}
                        {profileUser.id === currentUser.id ? <button className='friend-container-button' id='profile-img-button' onClick={toggleModal}>Edit Profile Photo</button> : null}
                    </div>
                </div>
                <hr />
                <div className='profile-buttons'>
                    <button id='posts' className={feedToggle ? 'active feed-buttons' : 'feed-buttons'} onClick={toggleFeed}>Posts</button>
                    <button id='friends' className={feedToggle ? 'feed-buttons' : 'active feed-buttons'} onClick={toggleFeed}>Friends</button>
                </div>
            </div>
            <div className='profile-content-wrapper'>
                <div>
                    {feedToggle ? <ProfileFeed updateFeed={updateFeed}/> : <ProfileFriends />}
                </div>
            </div>
            {modal ? <NewImg cover={modalCover} toggleModal={toggleModal} updateProfile={updateProfile} closeModal={closeModal}/> : null}
        </div>
    )
}

export default Profile;