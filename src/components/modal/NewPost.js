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
                    <div className='news-header'>
                        <h1>Sign Up</h1>
                        <p>It's quick and easy.</p>
                    </div>
                    <button id='close-modal' onClick={props.toggleModal}>X</button>
                </div>
                <hr />
                <form >
                    <label htmlFor='new-post'>What's on your mind?</label>
                    <input type='text' id='new-post' name='new-post' placeholder="What's on your mind?" required></input>
                </form>
            </div>
        </div>
    );
}

export default NewPost;
