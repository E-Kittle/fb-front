import '../styles/style.css';
import '../styles/form.css';
import '../styles/modal.css'
import SignUp from './modal/SignUp';
import { useState } from 'react';

const Login = () => {

    // State to hold the users login data
    const [user, setUser] = useState ({
        email: '',
        password: ''
    })


  const handleChange = (e) => {
    setUser(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))

    console.log(user)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('would submit')
    console.log(user)
  }


    // State and method to toggle the signup modal - Presenting the user
    //with the signup form
    const [modal, setModal] = useState(false);
    const toggleModal = (e) => {
        e.preventDefault();

        if (e.target.id === 'close-modal') {
            setModal(false)
        } else {
            setModal(true);
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
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' name='email' placeholder='Email' onChange={handleChange} initialvalue={user.email} value={user.email} />
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' name='password' placeholder='Password' onChange={handleChange} initialvalue={user.password} value={user.password} />
                    <button type='submit' className='button-style'>Log In</button>
                </form>
                <hr />
                <div className='login-button-wrapper'>
                    <a href='/signup' className='button-style' onClick={toggleModal}>Create New Account</a>
                    <button className='button-style'>Test Drive an Existing Account</button>
                    <button className='button-style'>Login with Facebook</button>
                </div>
            </div>
            {modal? <SignUp toggleModal={toggleModal} /> : null }
        </div>
    )
    
}

export default Login