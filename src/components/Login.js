import '../styles/style.css';
import '../styles/form.css';

const Login = () => {


    return (
        <div className='login-container'>
            <div className='logo'>
                <h1>OdinBook</h1>
                <p>Connecting you with friends wherever you go</p>
            </div>
            <div className='login-wrapper'>
                <form>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' name='email' placeholder='Email'/>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' name='password' placeholder='Password'/>
                    <button type='submit' className='button-style'>Log In</button>
                </form>
                <hr />
                <div className='login-button-wrapper'>
                    <a href='/signup' className='button-style'>Create New Account</a>
                    <button className='button-style'>Test Drive an Existing Account</button>
                    <button className='button-style'>Login with Facebook</button>
                </div>
            </div>
        </div>
    )
    
}

export default Login