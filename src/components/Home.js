import '../styles/style.css';
import '../styles/home.css';
import { useState, useEffect, useContext } from 'react';
import { getCurrentFriends, getFriendRequests, getNewsFeed } from '../services/user.service';
import { UserContext } from '../App';
import NewPost from './modal/NewPost';




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
    const [friendsList, setFriendsList] = useState([]);
    const [friendReq, setFriendReq] = useState([]);
    const [newsFeed, setNewsFeed] = useState([]);

    // State and function to manage the modal for a new news post
    const [ modal, setModal ] = useState(false);
    const toggleModal = () => {
        console.log('would toggle modal')
        setModal(!modal);
    }


    useEffect(() => {
        // Grabs current users friends
        getCurrentFriends()
            .then(result => {
                setFriendsList(result.data.friends);
            })
            .catch(err => {
                console.log(err.result)
            });

        // Grabs current users friend requests
        getFriendRequests()
            .then(result => {
                setFriendReq(result.data.results);
            })
            .catch(err => {
                console.log(err.result)
            });

        getNewsFeed()
            .then(result => {
                console.log(result.data)
                setNewsFeed(result.data)
                // setFriendReq(result.data.results);
            })
            .catch(err => {
                console.log(err.result)
            });

    }, [])

    return (
        <div className='home-wrapper'>
            <div className='left-sidebar'>

            </div>
            <div className='news'>
                <div className='new-post news-post'>
                    {/* Triggers a modal */}
                    <button className='user-img'>
                        {currentUser.first_name[0]}{currentUser.last_name[0]}
                    </button >
                    <button onClick={toggleModal}>{`What's on your mind, ${currentUser.first_name}?`}</button>
                </div>
                <div className='news-feed'>
                    {newsFeed.map(post => {
                        return (
                            <div className='news-post'>
                                <div className='news-header'>
                                    <button className='user-img'>{post.author.first_name[0]}{post.author.last_name[0]}</button>
                                    <div>
                                        <h3>{post.author.first_name} {post.author.last_name}</h3>
                                        <p>{post.date}</p>
                                    </div>
                                </div>
                                <div className='news-content'>
                                    <p>{post.content}</p>
                                    <div>
                                        <p>{post.likes.length} Likes</p>
                                        <p>{post.comments.length} Comments</p>
                                    </div>
                                    <hr />
                                </div>
                                <div className='news-button-wrapper'>
                                    <button>Like</button>
                                    <button>Comment</button>
                                    {/* This button just adds focus to the text input */}
                                </div>
                                <hr />
                                <div className='comment-container'>
                                    {post.comments.length === 0 ? <p>No comments yet!</p> : null}
                                    {post.comments.map(comment => {
                                        return (
                                            <div className='comment-wrapper'>
                                                {/* Need to fix the backend not populating comment author */}
                                                {/* <button>{comment.temp_img}</button> */}
                                                <div>
                                                    {/* <a href='/#'>{comment.username}</a> */}
                                                    <p>{comment.content}</p>
                                                </div>
                                                <div className='comment-meta'>
                                                    <div>
                                                        <a href='/#'>Like</a>
                                                        <a href='/#'>Reply</a>
                                                    </div>
                                                    <p>{comment.likes}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <form className='new-comment-form'>
                                        <label htmlFor='new-comment'>New Comment</label>
                                        <button className='user-img'>{currentUser.first_name[0]}{currentUser.last_name[0]}</button>
                                        <input type='text' id='new-comment' name='new-comment' placeholder='write a comment...' />
                                    </form>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='contact-sidebar'>
                <div id='home-friend-requests'>
                    <h2>Friend Requests</h2>
                    {friendReq.map(contact => {
                        return (<div className='friend-aside-wrapper friends-style'>
                            <button className='user-img'>{contact.requestee.first_name[0]}{contact.requestee.last_name[0]}</button>
                            <h3>{contact.requestee.first_name} {contact.requestee.last_name}</h3>
                        </div>)
                    })}
                </div>
                <div id='home-friends' >
                    <h2>Friends</h2>
                    {friendsList.map(contact => {
                        return (<div className='friend-aside-wrapper friends-style'>
                            <button className='user-img'>{contact.first_name[0]}{contact.last_name[0]}</button>
                            <h3>{contact.first_name} {contact.last_name}</h3>
                        </div>)
                    })}
                </div>
            </div>
            {modal ? <NewPost toggleModal={toggleModal} /> : null}
        </div >
    )
}

export default Home