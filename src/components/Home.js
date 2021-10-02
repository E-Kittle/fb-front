import '../styles/style.css';
import '../styles/home.css';
import { useState, useEffect, useContext } from 'react';
import { getCurrentFriends, getFriendRequests } from '../services/user.service';
import { UserContext } from '../App';

// Sample data
const sample_posts = [
    {
        user: {
            username: 'sarah B. Strickland',
            temp_img: 'SS'
        },
        timestamp: '52m',
        content: 'To the left to the left',
        likes: 12,
        comments: [
            {
                username: 'Robert',
                temp_img: 'RS',
                content: 'Come and pick me up!',
                likes: 8
            },
            {
                username: 'Elisabeth',
                temp_img: 'EK',
                content: 'Too cool!',
                likes: 30
            }
        ]
    },
    {
        user: {
            username: 'Maddie',
            temp_img: 'MH',
        },
        timestamp: '2h',
        content: 'closing Day!',
        likes: 38,
        comments: [
            {
                username: 'Lindsay',
                temp_img: 'LS',
                content: 'Congrats!',
                likes: 5
            },
            {
                username: 'Elisabeth',
                temp_img: 'EK',
                content: 'Congrats!',
                likes: 2
            }
        ]
    },
    {
        user: {
            username: 'Tricia',
            temp_img: 'TR',
        },
        timestamp: 'August 19 at 1:29 PM',
        content: 'Yay to friends',
        likes: 12,
        comments: [
            {
                username: 'Robert',
                temp_img: 'RS',
                content: "We're best friends!",
                likes: 4
            },
            {
                username: 'Elisabeth',
                temp_img: 'EK',
                content: 'Too cool!',
                likes: 2
            },
            {
                username: 'Shannon',
                temp_img: 'ST',
                content: "I'm tired!",
                likes: 3
            },
            {
                username: 'Julia',
                temp_img: 'JR',
                content: "This sucks!",
                likes: 4
            }
        ]
    },
]


const current_user = {
    username: 'Test User',
    temp_img: 'TU'
}


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
                    </button>
                    <button>{`What's on your mind, ${currentUser.first_name}?`}</button>
                </div>
                <div className='news-feed'>
                    {sample_posts.map(post => {
                        return (
                            <div className='news-post'>
                                <div className='news-header'>
                                    <button className='user-img'>{post.user.temp_img}</button>
                                    <h3>{post.user.username}</h3>
                                    <p>{post.timestamp}</p>
                                </div>
                                <div className='news-content'>
                                    <p>{post.content}</p>
                                    <div>
                                        <p>{post.likes} Likes</p>
                                        <p>{post.comments.length} Comments</p>
                                    </div>
                                </div>
                                <div className='new-button-wrapper'>
                                    <button>Like</button>
                                    <button>Comment</button>
                                    {/* This button just adds focus to the text input */}
                                </div>
                                <div className='comment-container'>
                                    {post.comments.map(comment => {
                                        return (
                                            <div className='comment-wrapper'>
                                                <button>{comment.temp_img}</button>
                                                <div>
                                                    <a href='/#'>{comment.username}</a>
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
                                    <form>
                                        <label htmlFor='new-comment'>New Comment</label>
                                        <button>{current_user.temp_img}</button>
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

        </div >
    )
}

export default Home