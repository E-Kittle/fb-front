import '../styles/style.css';
import '../styles/form.css';
import '../styles/modal.css'
import SignUp from './modal/SignUp';
import { useState, useContext } from 'react';
import { login } from '../services/auth.service';
import { UserContext } from '../App';
import { getFriendRequests } from '../services/user.service';

const Login = () => {

    // Grab UserContext in order to alert App.js that a user has logged in
    const userContext = useContext(UserContext);


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
    }

    // Function to submit the login data to the api
    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(user);

    }

    // Function to login the test user
    const loginTestUser = (e) => {
        e.preventDefault();
        let testUser = {
            email: 'bobb@gmail.com',
            password: 'bobsPass'
        }

        loginUser(testUser)
    }

    // Function called by handleSubmit and loginTestUser in order to login the user
    // to the API
    const loginUser = (currentUser) => {
        login(currentUser)
            .then(response => {
                if (response.status === 200) {
                    setError(false);
                    getFriendRequests()
                        .then(results => {
                            userContext.userDispatch({ type: 'setUser', payload: { user: response.data.user, friendRequests: results.data.results } })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    // Sets the new user in App.js and 'redirects' them to the homepage
                } else if (response.status === 400) {
                    // Inform user that email or password is incorrect
                    setError(true);
                }
            })
    }

    // State and method to toggle the signup modal - Presenting the user
    //with the signup form
    const [signUpModal, setSignUpModal] = useState(false);
    const toggleSignUpModal = (e) => {
        if (e) {
            // Modal is being closed with the X button
            e.preventDefault();
            if (e.target.id === 'close-modal') {
                setSignUpModal(false)
            } else {
                setSignUpModal(true);
            }
        } else {
            // Modal is being closed by a successful new user registration
            setSignUpModal(false)
        }
    }


    return (
        <div className='login-container'>
            <div className='logo'>
                <h1>OdinBook</h1>
                <p>Connecting you with friends wherever you go</p>
            </div>
            <div className='login-wrapper-container'>

                <div className='login-wrapper'>
                    <form onSubmit={handleSubmit}>
                        {!newUserPrompt ? null : <span className='success'>Registration successful! Please login</span>}
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' name='email' placeholder='Email' required onChange={handleChange} initialvalue={user.email} value={user.email} />
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' name='password' placeholder='Password' required onChange={handleChange} initialvalue={user.password} value={user.password} />
                        {!error ? null : <span className='error'>Email or Password is incorrect</span>}
                        <button type='submit' className='button-style'>Log In</button>
                    </form>
                    <hr />
                    <div className='login-button-wrapper'>
                        <a id='login-signup-button' href='/signup' className='button-style' onClick={toggleSignUpModal}>Create New Account</a>
                        <button className='button-style green-style' onClick={loginTestUser}>Test Drive an Existing Account</button>
                    </div>
                </div>
            </div>
            {signUpModal ? <SignUp toggleModal={toggleSignUpModal} handleNewUser={handleNewUser} /> : null}
        </div>
    )

}

export default Login