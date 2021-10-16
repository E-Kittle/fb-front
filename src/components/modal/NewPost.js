import { useState, useEffect } from 'react';
import { createNewPost, updatePost, editPost } from '../../services/user.service';
import htmlDecode from '../../services/formatting';

function NewPost(props) {

    // State to hold the new post content
    const [newPost, setNewPost] = useState({
        content: '',
        images: []
    });

    // State to hold any errors
    const [error, setError] = useState('');

    // UseEffect to edit a post. If user is editing a post, we'll update it here in state
    useEffect(() => {
        if (props.edit) {
            setNewPost(props.post)
        }
    }, [props.post, props.edit])

    // Function to control input for a new user
    const handleChange = (e) => {
        setNewPost({
            ...newPost,
            content: e.target.value
        });
    }

    // Function to handle submitting data to the api
    const handleSubmit = (e) => {
        e.preventDefault();

        if (error === '') {
            if (props.edit) {
                // User is editing a post. 
                editPost(newPost, newPost._id)
                .then(response => {
                    // Success! Close modal, close edit post modal, and trigger update newsfeed in parent
                    props.toggleDropDown();
                    props.toggleModal();
                    props.updateFeed();
                })
                .catch(error => {
                    console.log(error)
                })
            } else {
                // Create a new post.
                createNewPost(newPost)
                    .then(response => {
                        // Post was successfully created, now add photos if user attached any
                        if(newPost.images.length !== 0) {

                            updatePost(newPost, response.data.post._id)
                            .then(result => {
                            // Success - updatenewsfeed and toggle modal
                            props.setUpdateNewsFeed(true);
                            props.toggleModal();
                            })
                        } else {
                            // Success - updatenewsfeed and toggle modal
                            props.setUpdateNewsFeed(true);
                            props.toggleModal();
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        } else {
            return;
        }
    }


    // Used to close the modal when the user clicks outside of the modal
    const closeModal = (e) => {
        if (e.target.className === 'modal') {
            props.toggleModal();
        }
    }

    //Function to handle user adding images
    const handleImages = (e) => {
        if (e.target.files.length > 4) {
            setError('Choose up to 4 images')
        } else {
            setNewPost({
                ...newPost,
                images: e.target.files
            });
            setError('');
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
                <form id='new-post-form' onSubmit={handleSubmit} encType="multipart/form-data">
                    <label htmlFor='new-post'>What's on your mind?</label>
                    <textarea type='text' id='new-post' name='new-post' placeholder="What's on your mind?" required initialvalue={htmlDecode(newPost.content)} value={htmlDecode(newPost.content)} onChange={handleChange} ></textarea>
                    {props.edit ? null : <input type='file' id='image' name='image' accept='image/*' multiple onChange={handleImages} />}
                    {error === '' ? null : <span className='error'>{error}</span>}
                    <button type='submit'>Post</button>
                </form>
            </div>
        </div>
    );
}

export default NewPost;
