import { useState } from 'react';


function SignUp(props) {
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
        <form className='signup-form'>
          <div id='form-names'>
            <label htmlFor='first_name'>First name</label>
            <input type='text' id='first_name' name='first_name' placeholder='First name' />
            <label htmlFor='last_name'>First name</label>
            <input type='text' id='last_name' name='last_name' placeholder='Last name' />
          </div>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' placeholder='Email' />
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' placeHolder='Password' />

          <button type='submit' className='button-style'>Sign Up</button>

        </form>
      </div>
    </div>
  );
}

export default SignUp;
