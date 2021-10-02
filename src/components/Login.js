import '../styles/style.css';
import '../styles/form.css';
import '../styles/modal.css'
import SignUp from './modal/SignUp';
import { useState } from 'react';
import { login } from '../services/auth.service';

const Login = () => {

    // State to hold the users login data
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState(false);

    // State used to indicate if a new user successfully signed up
    // if a new user did successfully complete the signup form, then 
    // a green message appears on top of the login form
    const [newUserPrompt, setNewUserPrompt] = useState(false);

    // Function triggered by successful registration to update the state
    const handleNewUser = () => {
        setNewUserPrompt(true);
    }

    // Function that saves the state of the users input - creates a controlled input
    const handleChange = (e) => {
        setUser(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))

        console.log(user)
    }

    // Function to submit the login data to the api
    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(user);

    }
    
    const loginTestUser = (e) => {
        e.preventDefault();
        let testUser = {
            email: 'IA@gmail.com',
            password: 'isaacsPass'
        }
        
        loginUser(testUser)
    }
    
    const loginUser = (currentUser) => {
        login(currentUser)
        .then(response => {
            if(response.status === 200) {
                console.log('loggedin!')
                setError(false);
                //REDIRECT USER TO HOMEPAGE
            } else if (response.status === 400) {
                // Inform user that email or password is incorrect
                setError(true);
            }
        })
    }

    // State and method to toggle the signup modal - Presenting the user
    //with the signup form
    const [modal, setModal] = useState(false);
    const toggleModal = (e) => {
        if (e) {
            // Modal is being closed with the X button
            e.preventDefault();
            if (e.target.id === 'close-modal') {
                setModal(false)
            } else {
                setModal(true);
            }
        } else {
            // Modal is being closed by a successful new user registration
            setModal(false)
        }
    }

    return (
        <div className='login-container'>
            <div className='logo'>
                <h1>OdinBook</h1>
                <p>Connecting you with friends wherever you go</p>
            </div>
            <div className='login-wrapper'>
                <form onSubmit={handleSubmit}>
                    {!newUserPrompt? null: <span className='success'>Registration successful! Please login</span>}
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' name='email' placeholder='Email' required onChange={handleChange} initialvalue={user.email} value={user.email} />
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' name='password' placeholder='Password' required onChange={handleChange} initialvalue={user.password} value={user.password} />
                    {!error? null: <span className='error'>Email or Password is incorrect</span>}
                    <button type='submit' className='button-style'>Log In</button>
                </form>
                <hr />
                <div className='login-button-wrapper'>
                    <a href='/signup' className='button-style' onClick={toggleModal}>Create New Account</a>
                    <button className='button-style' onClick={loginTestUser}>Test Drive an Existing Account</button>
                    <button className='button-style'>Login with Facebook</button>
                </div>
            </div>
            {modal ? <SignUp toggleModal={toggleModal} handleNewUser={handleNewUser}/> : null}
        </div>
    )

}

export default Login