import '../../styles/style.css';
import '../../styles/modal.css';


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
      </div>
    </div>
  );
}

export default SignUp;
