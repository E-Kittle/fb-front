import '../styles/style.css';
import '../styles/home.css';
import { useState, useEffect, useContext } from 'react';
import { getNewsFeed, formatURL } from '../services/user.service';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import NewPost from './modal/NewPost';
import defaultProfileImg from '../assets/default.jpeg';
// import htmlDecode from '../services/formatting';
import NewsPost from './mini-components/NewsPost';



/*
Here is where the bulk of the data grabbing will need to be done....
1. Grab friends list and display it on the sidebar
2. Grab 
*/



const Home = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State to hold each piece of data for the current user
    const [newsFeed, setNewsFeed] = useState([]);
    const [updateNewsFeed, setUpdateNewsFeed] = useState(false);
    const [loading, setLoading] = useState(true);

    // State and function to manage the modal for a new news post
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    }

    // Function to update a post following an update to its likes or comments
    const updatePost = (post) => {
        let index = newsFeed.findIndex(oldPost => {
            return oldPost._id === post._id;
        })

        let feed = newsFeed;
        feed.splice(index, 1, post)
        setNewsFeed([...feed])
    }

    const updateFeed = () => {
        getNewsFeed()
            .then(result => {
                if (result.data.new === true) {
                    setNewsFeed([]);
                } else {
                    setNewsFeed(result.data.reverse())
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err.result)
            });
    }

    useEffect(() => {
        getNewsFeed()
            .then(result => {
                if (result.data.new === true) {
                    setNewsFeed([]);
                } else {
                    setNewsFeed(result.data.reverse())
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err.result)
            });
    }, [])

    useEffect(() => {
        //Used to refresh the page if the user has submitted a new post

        getNewsFeed()
            .then(result => {
                console.log('new news feed triggered')
                console.log(result.data)
                if (result.data.new === true) {
                    setNewsFeed([]);
                } else {
                    setNewsFeed(result.data.reverse())
                }
            })
            .catch(err => {
                console.log(err.result)
            });

        setUpdateNewsFeed(false)
    }, [updateNewsFeed])

    const PendingFriendReq = (props) => {
        const { contact } = props;
        if (contact.requestee._id === currentUser.id) {
            return null;
        } else {
            return (
                <div className='friend-aside-wrapper friends-style' key={contact._id}>
                    <Link to={`/profile/${contact._id}`} className='cover-img'>
                        <img src={contact.cover_img === undefined || contact.cover_img === '' ? defaultProfileImg : formatURL(contact.cover_img)} alt='to profile'></img>
                    </Link>
                    <Link to={`/profile/${contact.requestee._id}`}>{contact.requestee.first_name} {contact.requestee.last_name}</Link>
                </div>
            )
        }
    }

    return (
        <div className='home-wrapper'>
            <div className='news'>
                <div className='new-post news-post'>
                    {/* Triggers a modal */}
                    <Link to={`/profile/${currentUser._id}`} className='cover-img'>
                        <img src={currentUser.cover_img === undefined || currentUser.cover_img === '' ? defaultProfileImg : formatURL(currentUser.cover_img)} alt='to profile'></img>
                    </Link>
                    <button onClick={toggleModal}>{`What's on your mind, ${currentUser.first_name}?`}</button>
                </div>
                <div className='news-feed'>
                    {loading ? <div><h3>Loading...</h3></div> :
                        newsFeed.length === 0 ? <div><h3>Add some friends to see some content!</h3> <h3>(Hint: Use the 'find friend' search bar or go to the 'Friends' page to see all users!)</h3></div> : newsFeed.map(post => { return <NewsPost post={post} key={post._id} setUpdateNewsFeed={setUpdateNewsFeed} updatePost={updatePost} updateFeed={updateFeed} /> })}
                </div>


            </div>
            <div className='contact-sidebar'>
                <div id='home-friend-requests'>
                    <div>
                        <h2>Friend Requests</h2>
                        <Link to='/friends' className='see-all'>See All</Link>
                    </div>
                    {currentUser.friendRequests.map(contact => { return <PendingFriendReq contact={contact} key={contact._id} /> })}
                </div>
                <div id='home-friends' >
                    <h2>Friends</h2>
                    {currentUser.friends.map(contact => {
                        return (<div className='friend-aside-wrapper friends-style' key={contact._id}>
                            <Link to={`/profile/${contact._id}`} className='cover-img'>
                                <img src={contact.cover_img === undefined || contact.cover_img === '' ? defaultProfileImg : formatURL(contact.cover_img)} alt='to profile'></img>
                            </Link>
                            <Link to={`/profile/${contact._id}`}>{contact.first_name} {contact.last_name}</Link>
                        </div>)
                    })}
                </div>
            </div>
            {modal ? <NewPost toggleModal={toggleModal} setUpdateNewsFeed={setUpdateNewsFeed} /> : null}
        </div >
    )
}

export default Home