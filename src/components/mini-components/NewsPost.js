import htmlDecode from "../../services/formatting";
import { UserContext } from '../../App';
import { useContext, useRef, useState, useEffect } from 'react';
import { likePost } from '../../services/user.service'
import { Link } from 'react-router-dom';


const NewsPost = (props) => {

    const { post, updatePost } = props;

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // Container to hold the ref and function that provides focus to the ref 
    const commentRef = useRef(null);
    const changeFocus = () => {
            commentRef.current.focus();
    }

    //-----------------------------------------------------------------------
    // Section for liking a post
    // State to hold whether a user has liked a post or not
    const [ liked, setLiked ] = useState(false);

    // Function to toggle a like. It sends the request to the db, which returns the post
    // data. Then, this data is sent to Home.js to update state
    const toggleLike = () => {
        likePost(post._id)
        .then(response => {
            // Post has been updated in the db, now update state in Home.js
            updatePost(response.data.results);
            setLiked(false);
        })
        .catch(error => {
            console.log(error.response)
        })
    }

    // useEffect to check if the user has liked the post
    useEffect(() => {
        post.likes.forEach(authId => {
            if (authId === currentUser.id) {
                setLiked(true);
            }
        })
    }, [post.likes, currentUser.id])
    //-----------------------------------------------------------------------


    return (
        
        <div className='news-post' key={post._id}>
            <div className='news-header'>
                <button className='user-img'>{post.author.first_name[0]}{post.author.last_name[0]}</button>
                <div>
                    <Link to={`/profile/${post.author._id}`}>{post.author.first_name} {post.author.last_name}</Link>
                    <p>{post.date}</p>
                </div>
            </div>
            <div className='news-content'>
                <p>{htmlDecode(post.content)}</p>
                <div>
                    <p>{post.likes.length} Likes</p>
                    <p>{post.comments.length} Comments</p>
                </div>
                <hr />
            </div>
            <div className='news-button-wrapper'>
                <button onClick={toggleLike} id={liked? 'liked' : null}>{liked? 'Liked' : 'Like'}</button>
                <button onClick={changeFocus}>Comment</button>
                {/* This button just adds focus to the text input */}
            </div>
            <hr />
            <div className='comment-container'>
                {post.comments.length === 0 ? <p>No comments yet!</p> : null}
                {post.comments.map(comment => {
                    return (
                        <div className='comment-wrapper' key={comment._id}>
                            {/* Need to fix the backend not populating comment author */}
                            {/* <button>{comment.temp_img}</button> */}
                            <div>
                                <Link to={`/profile/${comment._id}`}>{comment.first_name}</Link>
                                <p>{htmlDecode(comment.content)}</p>
                            </div>
                            <div className='comment-meta'>
                                <div>
                                    <Link to='/#'>Like</Link>
                                    <Link to='/#'>Reply</Link>
                                </div>
                                <p>{comment.likes}</p>
                            </div>
                        </div>
                    )
                })}
                <form className='new-comment-form'>
                    <label htmlFor='new-comment' >New Comment</label>
                    <button className='user-img'>{currentUser.first_name[0]}{currentUser.last_name[0]}</button>
                    <input type='text' ref={commentRef} id='new-comment' name='new-comment' placeholder='write a comment...' />
                </form>
            </div>
        </div>
    );
}

export default NewsPost;