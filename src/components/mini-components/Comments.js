import htmlDecode from "../../services/formatting";
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../App";
import '../../styles/home.css';
import { likeComment, createComment, editComment, formatURL } from "../../services/user.service";
import { formatDistance } from "date-fns";
import defaultProfileImg from '../../assets/default.jpeg'

const Comment = (props) => {

    //destructure props
    const { comments, updateComment } = props;

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;


    const commentSort = (comments) => {
        let sortedComments = [];
        let newComment;

        comments.forEach(comment => {
            if (sortedComments.length === 0 || comment.commentRef === null) {
                //If sortedComments is empty, fill it with the first comment
                newComment = {
                    commentId: comment._id,
                    commentAuthor: `${comment.author.first_name} ${comment.author.last_name}`,
                    comment: comment,
                    replies: []
                }
                sortedComments.push(newComment);
            } else {
                //There is something in commentRef, meaning the comment is a reply
                //Find out which comment it is replying to and push it to sortedComments

                // Second attempt
                let index = 0;
                sortedComments.every(sortedComment => {
                    if (sortedComment.commentId === comment.commentRef) {
                        // commentRef was found at the top level, add the comment to the list of replies
                        newComment = {
                            commentId: comment._id,
                            commentAuthor: `${comment.author.first_name} ${comment.author.last_name}`,
                            comment: comment,
                            replies: []
                        }
                        sortedComments[index].replies.push(newComment);
                        return false;
                    } else if (sortedComment.replies.length !== 0) {
                        // The sortedComment in the array has comments nested in its replies. Loop through those to see if our newest
                        // comment is a reply to one of those comments

                        let updateArr = searchReplies(sortedComment.replies, comment)
                        if (updateArr === null) {
                            index++;        //Increment the index for the next loop
                            return true;
                        } else {
                            sortedComments[index].replies = updateArr;
                            return false;
                        }
                        //Needs to 
                    } else {
                        index++;        //Increment the index for the next loop
                        return true;
                    }


                })

            }

        })
        return sortedComments;
    }

    const searchReplies = (repliesArr, comment) => {
        let index = 0;
        let newComment;
        let returnReplies = [...repliesArr];     //Create a mutable copy
        let passed = false;
        repliesArr.every(reply => {
            if (reply.commentId === comment.commentRef) {
                newComment = {
                    commentId: comment._id,
                    commentAuthor: `${comment.author.first_name} ${comment.author.last_name}`,
                    comment: comment,
                    replies: []
                }
                returnReplies[index].replies.push(newComment);
                passed = true;
                return false;
                //The comment is a reply to the comment found in repliesArr. 
                //return the updated returnReplies to be updated at a higher level
            } else if (reply.replies.length !== 0) {
                // The reply has its own replies, use recursion to loop through those to update the appropriate index
                let arr = searchReplies(reply.replies, comment);

                if (arr === null) {   //The original comment wasn't found, continue loop
                    index++;        //Increment the index for the next loop
                    return true;
                } else {
                    returnReplies[index].replies = arr;
                    passed = true;
                    return false;
                }

            } else {
                index++;
                return true;
            }

        })

        if (passed) {
            return returnReplies
        } else {
            return null;
        }
    }


    // State to hold the sorted comments and useEffect to sort the comments
    const [sorted, setSorted] = useState([]);
    useEffect(() => {
        let sortedComments = commentSort(comments);
        setSorted(sortedComments);
    }, [comments])



    //Component for each individual comment
    const Comment = (props) => {
        const { comment, updateComment } = props;
        const [like, setLike] = useState(false);
        const [dropdown, setDropdown] = useState(false);
        const [newReply, setNewReply] = useState(false);        //State to toggle the reply text input
        const [content, setContent] = useState('');             //State to hold the content for the reply
        const [editting, setEditting] = useState(false);        //State to hold whether the user is editing a post or not

        const manageLikes = (e) => {
            likeComment(e.target.id)
                .then(response => {
                    // Update was a success, send the data to NewsPost to update state
                    // console.log(response.data)
                    // setLike(prevLike => !prevLike);
                    // updateComment(response.data.results);
                    props.updateFeed();
                })
                .catch(err => [
                    console.log(err.response)
                ])
        }

        useEffect(() => {
            let index = comment.comment.likes.findIndex(like => {
                if (like === currentUser.id) {
                    return true;
                } else {
                    return false;
                }
            })

            if (index === -1) {
                // User was not found
                // console.log('set false')
                setLike(false);
            } else {
                // console.log('set true')
                setLike(true)
            }
        }, [comment.comment.likes])

        const toggleDropDown = () => {
            setDropdown(!dropdown)
        }

        const toggleReply = () => {
            setNewReply(!newReply)
        }

        const handleChange = (e) => {
            setContent(e.target.value)
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            if (editting) {
                editComment({ content }, comment.commentId)
                    .then(results => {
                        console.log('success')
                        props.updateFeed();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            } else {
                createComment({ content: content, comment, commentid: e.target.id }, props.postId)
                    .then(results => {
                        console.log('success')
                        props.updateFeed();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }

        // 'deletes' the comment - Just replaces text input with deleted, so as not to disturb
        // other users replies
        const handleDelete = (e) => {
            editComment({ content: '[Deleted]' }, comment.commentId)
                .then(results => {
                    props.updateFeed();
                })
                .catch(error => {
                    console.log(error)
                })
        }

        const editCommentToggle = () => {
            toggleReply();
            setEditting(true);
            setContent(htmlDecode(comment.comment.content))
        }

        const formatDates = (date) => {
            let oldDate = new Date(date);
            let today = new Date();
            let distance = formatDistance(oldDate, today)
            return distance;
        }

        return (
            <>
                <div className={props.index === 0 ? 'comment-wrapper' : props.index >= 3 ? `comment-wrapper reply3` : `comment-wrapper reply${props.index}`} >
                    <div className='comment-header'>
                        <Link to={`/profile/${comment.comment.author._id}`} className='cover-img'>
                            <img src={comment.comment.author.cover_img === undefined || comment.comment.author.cover_img === '' ? defaultProfileImg : formatURL(comment.comment.author.cover_img)} alt='to profile'></img>
                        </Link>
                        <div className='comment-content-wrapper'>
                            <div>
                                <div>
                                    <Link to={`/profile/${comment.commentId}`}>{comment.commentAuthor} {props.parentAuthor === null ? null : `- @${props.parentAuthor}`}</Link>
                                    <p>{formatDates(comment.comment.date)} ago</p>
                                </div>
                                <p>{htmlDecode(comment.comment.content)}</p>
                            </div>
                            <div>
                                {comment.comment.author._id === currentUser.id ? <button id={comment.commentId} className='dropdown-button' onClick={toggleDropDown}>...</button> : null}
                                {!dropdown ? null :
                                    <div className='comment-menu'>
                                        <ul>
                                            <li>
                                                <button onClick={editCommentToggle}>Edit</button>
                                            </li>
                                            <li>
                                                <button onClick={handleDelete}>Delete</button>
                                            </li>
                                        </ul>
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className='comment-meta'>
                        <div>
                            <button className={like ? 'comment-button liked-comment' : 'comment-button'} id={comment.commentId} onClick={manageLikes}>Like</button>
                            <button className='comment-button' onClick={toggleReply}>Reply</button>
                        </div>
                        <p>{comment.comment.likes.length} Like{comment.comment.likes.length <= 1 ? null : 's'}</p>
                    </div>
                    {!newReply ? null :
                        <div className='reply-wrapper'>
                            <form className='new-comment-form new-reply' id={comment.comment._id} onSubmit={handleSubmit}>
                                <label htmlFor='new-reply' >New Comment</label>
                                <input type='text' id='new-reply' name='new-reply' autoFocus placeholder='write a reply...' required initialvalue={content} value={content} onChange={handleChange} />
                            </form>
                        </div>}
                </div>
                {comment.replies.length === 0 ? null : comment.replies.map(reply => { return (<Comment comment={reply} postId={props.postId} index={props.index + 1} key={reply.commentId} updateFeed={props.updateFeed} parentAuthor={comment.commentAuthor} updateComment={updateComment} />) })}
            </ >
        )
    }

    return (
        sorted.map(comment => {
            return <div className='comment-chain' key={comment.commentId}><Comment comment={comment} index={0} parentAuthor={null} postId={props.postId} updateComment={updateComment} updateFeed={props.updateFeed} /> </div>
        })
    )

}

export default Comment;