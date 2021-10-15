import htmlDecode from "../../services/formatting";
import { UserContext } from '../../App';
import { useContext, useRef, useState, useEffect } from 'react';
import { likePost, createComment, formatURL } from '../../services/user.service'
import { Link } from 'react-router-dom';
import Comments from '../mini-components/Comments';
import { formatDistance } from "date-fns";
import defaultProfileImg from '../../assets/default.jpeg'

const NewsPost = (props) => {

    const API_URL = "http://localhost:5000/";

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
    const [liked, setLiked] = useState(false);

    // Function to toggle a like. It sends the request to the db, which returns the post
    // data. Then, this data is sent to Home.js to update state
    const toggleLike = () => {
        likePost(post._id)
            .then(response => {
                // Post has been updated in the db, now update state in Home.js
                // updatePost(response.data.results);
                setLiked(false);
                props.updateFeed();
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

    const updateComment = (comment) => {
        let index = post.comments.findIndex(oldComment => {
            if (oldComment._id === comment._id) {
                return true;
            }
            return false;
        })
        let tempPost = post;
        tempPost.comments[index] = comment;

        updatePost(tempPost);
        //Update the post here, then send it to updatePost()
    }

    const [content, setContent] = useState('');

    const handleCommentChange = (e) => {
        setContent(e.target.value)
    }

    const handleNewComment = (e) => {
        e.preventDefault();
        console.log(`Would submit: ${content} for post: ${e.target.id}`)
        createComment({ content }, e.target.id)
            .then(response => {
                setContent('');
                props.updateFeed();
            })
            .catch(error => {
                console.log(error)
            })
    }

    const formatDates = (date) => {
        let oldDate = new Date(date);
        let today = new Date();
        let distance = formatDistance(oldDate, today)
        return distance;
    }


    return (

        <div className='news-post' key={post._id}>
            <div className='news-header'>
                <Link to={`/profile/${post.author._id}`} className='cover-img'>
                    <img src={post.author.cover_img === undefined || post.author.cover_img === '' ? defaultProfileImg : post.author._id===currentUser.id? formatURL(currentUser.cover_img) : formatURL(post.author.cover_img)} alt='to profile'></img>
                </Link>
                <div>
                    <Link to={`/profile/${post.author._id}`}>{post.author.first_name} {post.author.last_name}</Link>
                    <p>{formatDates(post.date)} ago</p>
                </div>
            </div>
            <div className='news-content'>
                <p>{htmlDecode(post.content)}</p>
                {post.images.length === 0 ? null : post.images.map(image => { return <img src={`${API_URL}${image}`} alt='User Content'></img> })}
                <div>
                    <p>{post.likes.length} Like{post.likes.length > 1 ? 's' : null}</p>
                    <p>{post.comments.length} Comment{post.comments.length > 1 ? 's' : null}</p>
                </div>
                <hr />
            </div>
            <div className='news-button-wrapper'>
                <button onClick={toggleLike} id={liked ? 'liked' : null}>{liked ? 'Liked' : 'Like'}</button>
                <button onClick={changeFocus}>Comment</button>
                {/* This button just adds focus to the text input */}
            </div>
            <hr />
            <div className='comment-container'>
                {post.comments.length === 0 ? <p>No comments yet!</p> : <Comments comments={post.comments} key={`comments:${post._id}`} postId={post._id} updateComment={updateComment} updateFeed={props.updateFeed} />}
                <form className='new-comment-form' id={post._id} onSubmit={handleNewComment}>
                    <label htmlFor='new-comment' >New Comment</label>
                    <Link to={`/profile/${currentUser._id}`} className='cover-img'>
                        <img src={currentUser.cover_img === undefined || currentUser.cover_img === '' ? defaultProfileImg : formatURL(currentUser.cover_img)} alt='to profile'></img>
                    </Link>
                    <input type='text' ref={commentRef} id='new-comment' name='new-comment' placeholder='write a comment...' initialvalue={content} value={content} onChange={handleCommentChange} />
                </form>
            </div>
        </div>
    );
}

export default NewsPost;