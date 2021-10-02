import { useState } from 'react';


/*
Thought process
Password is the only field that needs validation - ensure it is eight characters


*/


function SignUp(props) {

  // State for the form contents
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })

  // State to hold the errors
  const [passError, setPassError] = useState('');

  const passValidate = (password) => {
    let numTest = new RegExp('.*[0-9]');
    let symTest = new RegExp('.*[!@#$%^&*]');

    if (password.length < 8 || !numTest.test(password) || !symTest.test(password)) {
      setPassError('Password must have 8 characters, 1 number, and 1 symbol')
      return false;
    } else {
      setPassError('')
      return true;
    }
  }


  const handleChange = (e) => {
    setNewUser(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let passed = passValidate(newUser.password)
    console.log(`passed: ${passed}`)
    console.log(newUser)

    // Validation is done. Now we know that we'd have all the data we need,
    // so. We can now submit the data to the server
  }

  return (
    <div className="modal">
      <div className='modal-main'>
        <div className="modal-header">
          <div>
            <h1>Sign Up</h1>
            <p>It's quick and easy.</p>
          </div>
          <button id='close-modal' onClick={props.toggleModal}>X</button>
        </div>
        <hr />
        <form className='signup-form' onSubmit={handleSubmit}>
          <div id='form-names'>
            <label htmlFor='first_name'>First name</label>
            <input type='text' id='first_name' name='first_name' placeholder='First name' autoFocus required onChange={handleChange} initialvalue={newUser.first_name} value={newUser.first_name}/>
            <label htmlFor='last_name'>First name</label>
            <input type='text' id='last_name' name='last_name' placeholder='Last name' required onChange={handleChange} initialvalue={newUser.last_name} value={newUser.last_name}/>
          </div>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' placeholder='Email' required onChange={handleChange} initialvalue={newUser.email} value={newUser.email}/>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' placeholder='Password' required onChange={handleChange} initialvalue={newUser.password} value={newUser.password}/>
          {/* {passError.length !== 0? } */}
          <span className='error'>{passError.length !== 0? passError : ''}</span>
          <button type='submit' className='button-style'>Sign Up</button>

        </form>
      </div>
    </div>
  );
}

export default SignUp;
