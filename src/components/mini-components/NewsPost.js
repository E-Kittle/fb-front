import htmlDecode from "../../services/formatting";
import { UserContext } from '../../App';
import { useContext, useRef, useState, useEffect } from 'react';
import { likePost, createComment, formatURL, editPost } from '../../services/user.service'
import { Link } from 'react-router-dom';
import Comments from '../mini-components/Comments';
import { formatDistance } from "date-fns";
import defaultProfileImg from '../../assets/default.jpeg'
import NewPost from "../modal/NewPost";

const NewsPost = (props) => {
    //Destructure the post in props
    const { post, updatePost } = props;

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // Container to hold the ref and function that provides focus to the ref 
    // Ref is used to provide focus to the 'write a comment' text input. Triggered
    // by pressing the 'comment' button
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
                setLiked(false);
                props.updateFeed(); //Triggers parent component to update the feed
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

    // Function to update a comment within the post
    const updateComment = (comment) => {
        //First, search through the comments for the post and find the index of the comment
        let index = post.comments.findIndex(oldComment => {
            if (oldComment._id === comment._id) {
                return true;
            }
            return false;
        })
        //Update the post
        let tempPost = post;
        tempPost.comments[index] = comment;

        updatePost(tempPost);   //Inform parent component of updated post
    }

    // State to hold the content for a new comment
    const [content, setContent] = useState('');

    // Make the comment text input controlled
    const handleCommentChange = (e) => {
        setContent(e.target.value)
    }

    //Submit a new comment for the post
    const handleNewComment = (e) => {
        e.preventDefault();
        createComment({ content }, e.target.id)
            .then(response => {
                setContent('');     //Clear the input state
                props.updateFeed(); //Inform parent component of update
            })
            .catch(error => {
                console.log(error)
            })
    }

    //Formats dates for a post
    const formatDates = (date) => {
        let oldDate = new Date(date);
        let today = new Date();
        let distance = formatDistance(oldDate, today)
        return distance;
    }


    // State to hold the dropdown menu and function to toggle it
    const [dropdown, setDropdown] = useState(false);
    const [edit, setEdit] = useState(false);
    const toggleDropDown = () => {
        setDropdown(!dropdown)
    }

    //Triggered by child component to close the edit post modal
    const toggleModal = () => {
        setEdit(false);
    }

    //Handles 'deleting' a post. For user friendliness, just replaces text content
    // with 'deleting' and removes images
    const handleDelete = (e) => {
        console.log('would delete post ' + e.target.id)
        editPost({content:'Deleted'}, e.target.id)
        .then(response => {
            toggleDropDown();       //Closes dropdown
            props.updateFeed();
        })
        .catch(error => {
            console.log('error')
            console.log(error)
        })
    }

    // Toggle to set edit to true, triggers a cascade that will open
    // a text input for user to edit post
    const editPostToggle = (e) => {
        setEdit(true);
    }

    return (

        <div className='news-post' key={post._id}>
            <div className='news-header'>
                <div className='news-header-wrapper'>
                    <Link to={`/profile/${post.author._id}`} className='cover-img'>
                        <img src={post.author.cover_img === undefined || post.author.cover_img === '' ? defaultProfileImg : post.author._id === currentUser.id ? formatURL(currentUser.cover_img) : formatURL(post.author.cover_img)} alt='to profile'></img>
                    </Link>
                    <div>
                        <Link to={`/profile/${post.author._id}`}>{post.author.first_name} {post.author.last_name}</Link>
                        <p>{formatDates(post.date)} ago</p>
                    </div>
                </div>
                <div className='post-dropdown-wrapper'>
                    {post.author._id === currentUser.id ? <button id={post._id} className='post-dropdown-button' onClick={toggleDropDown}>...</button> : null}
                    {!dropdown ? null :
                        <div className='post-menu'>
                            <ul>
                                <li>
                                    <button onClick={editPostToggle} id={post._id}>Edit Text</button>
                                </li>
                                <li>
                                    <button onClick={handleDelete} id={post._id}>Delete</button>
                                </li>
                            </ul>
                        </div>}
                </div>
            </div>
            <div className='news-content'>
                <p>{htmlDecode(post.content)}</p>
                <div className='news-image-contaner'>
                    {post.images.length === 0 ? null : post.images.map(image => { return <img src={formatURL(image)} alt='User Content' key={image}></img> })}
                </div>
                <div className='news-content-meta'>
                    <p>{post.likes.length} Like{post.likes.length > 1 ? 's' : null}</p>
                    <p>{post.comments.length} Comment{post.comments.length > 1 ? 's' : null}</p>
                </div>
                <hr />
            </div>
            <div className='news-button-wrapper'>
                <button onClick={toggleLike} id={liked ? 'liked' : null}>{liked ? 'Liked' : 'Like'}</button>
                <button onClick={changeFocus}>Comment</button>
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
            {edit? <NewPost post={post} edit={edit} toggleModal={toggleModal} toggleDropDown={toggleDropDown} updateFeed={props.updateFeed}/> : null}
        </div>
    );
}

export default NewsPost;