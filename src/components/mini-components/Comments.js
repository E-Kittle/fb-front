import htmlDecode from "../../services/formatting";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import '../../styles/home.css'

const Comment = (props) => {

    //destructure props
    const { comments } = props;

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


    // State to hold the sorted comments
    const [sorted, setSorted] = useState([]);
    useEffect(() => {
        let sortedComments = commentSort(comments)
        setSorted(sortedComments);
        console.log(sortedComments)
    }, [])

    //Component for each individual comment
    const Comment = (props) => {
        const { comment } = props;

        return (
            <>
                <div className={props.index === 0? 'comment-wrapper' : props.index >= 3? `comment-wrapper reply3` : `comment-wrapper reply${props.index}`} >
                    <div className='comment-header'>
                        <button className='user-img'>{comment.comment.author.first_name[0]} {comment.comment.author.last_name[0]}</button>
                        <div className='comment-content-wrapper'>
                            <Link to={`/profile/${comment.commentId}`}>{comment.commentAuthor} {props.parentAuthor===null? null: `- @${props.parentAuthor}`}</Link>
                            <p>{htmlDecode(comment.comment.content)}</p>
                        </div>
                    </div>
                    <div className='comment-meta'>
                        <div>
                            <button>Like</button>
                            <button>Reply</button>
                        </div>
                        <p>{comment.comment.likes.length} Likes</p>
                    </div>
                </div>
                {comment.replies.length === 0 ? null : comment.replies.map(reply => { return (<Comment comment={reply} index={props.index + 1} key={reply.commentId} parentAuthor={comment.commentAuthor}/> ) })}
            </ >
        )
    }

    return (
        sorted.map(comment => {
            return <div className='comment-chain' key={comment.commentId}><Comment comment={comment} index={0} parentAuthor={null}/> </div>
        })
    )

}

export default Comment;