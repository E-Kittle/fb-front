import htmlDecode from "../services/formatting";
import { UserContext } from '../App';
import { useContext, useRef } from 'react';
import { likePost } from '../services/user.service';
import { Link } from 'react-router-dom';


const NewsPost = (props) => {

    const { post } = props;

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // Container to hold the ref
    const commentRef = useRef(null);

    const changeFocus = () => {
            commentRef.current.focus();
    }

    const toggleLike = () => {
        likePost(post._id)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error.response)
        })
        // A user can add a like or remove a like...
        // the API checks if the user has like the post before or not. So all I need to do 
        // is send that data to the API, and update the DOM...
        //For simplicity, just trigger another API call
    }

    return (
        
        <div className='news-post' key={post._id}>
            <div className='news-header'>
                <button className='user-img'>{post.author.first_name[0]}{post.author.last_name[0]}</button>
                <div>
                    <h3>{post.author.first_name} {post.author.last_name}</h3>
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
                <button onClick={toggleLike}>Like</button>
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
                                {/* <a href='/#'>{comment.username}</a> */}
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