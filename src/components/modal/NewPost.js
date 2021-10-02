import { useState, useContext } from 'react';
import { UserContext } from '../../App';

function NewPost(props) {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State to hold the new post content
    const [ newPost, setNewPost ] = useState('');

    return (
        <div className="modal">
            <div className='modal-main'>
                <div className="modal-header">
                    <div className='post-header'>
                        <h1>Create Post</h1>
                    </div>
                    <button className='close-modal' id='x-modal' onClick={props.toggleModal}>X</button>
                </div>
                <hr />
                <form id='new-post-form'>
                    <label htmlFor='new-post'>What's on your mind?</label>
                    <textarea type='text' id='new-post' name='new-post' placeholder="What's on your mind?" required></textarea>
                    <button type='submit'>Post</button>
                </form>
            </div>
        </div>
    );
}

export default NewPost;
