import { useState, useContext } from 'react';
import { UserContext } from '../../App';
import { createNewPost } from '../../services/user.service';

function NewPost(props) {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State to hold the new post content
    const [newPost, setNewPost] = useState('');

    // Function to control input for a new user
    const handleChange = (e) => {
        setNewPost(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create the new post. If successful, close the modal
        createNewPost(newPost)
            .then(response => {
                props.toggleModal();
            })
            .catch(err => {
                console.log(err)
            })
    }


    // Used to close the modal when the user clicks outside of the modal
    const closeModal = (e) => {
        if (e.target.className === 'modal') {
            props.toggleModal();
        }
    }




    return (
        <div className="modal" onClick={closeModal}>
            <div className='modal-main'>
                <div className="modal-header">
                    <div className='post-header'>
                        <h1>Create Post</h1>
                    </div>
                    <button className='close-modal' id='x-modal' onClick={props.toggleModal}>X</button>
                </div>
                <hr />
                <form id='new-post-form' onSubmit={handleSubmit}>
                    <label htmlFor='new-post'>What's on your mind?</label>
                    <textarea type='text' id='new-post' name='new-post' placeholder="What's on your mind?" required onChange={handleChange}></textarea>
                    <button type='submit'>Post</button>
                </form>
            </div>
        </div>
    );
}

export default NewPost;
