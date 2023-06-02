import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import { openModal } from "../../store/modal";
import gpt from '../../assets/gpt.jpg';

function NavBar () {
  const loggedIn = useSelector(state => !!state.session.user);
  const user = useSelector(state => state.session.user)
  const dispatch = useDispatch();
  
  const logoutUser = e => {
      e.preventDefault();
      dispatch(logout());
  }

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="links-nav">
          <Link to={'/profile'}>
          {user.profileImageUrl ? 
            <img className='profile-pic' src={user.profileImageUrl} alt='profile-img' /> : 
            null}
          </Link>  
          <Link id="battle-button" to='/chatbots/battle'>Battle</Link>
          <button onClick={logoutUser} id="logout-button">Logout</button>
          <div id="create-button" className='nav-create-button' title='Create a Chatbot!' onClick={()=>dispatch(openModal({name:'new'}))}><div>+</div></div>

        </div>
      );
    } else {
      return (
        <div className="links-auth">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
        </div>
      );
    }
  }

  return (
    <div className='navbar'>
      <div className="nav-left">
        <Link to='/'><img className='logo' src={gpt} alt='logo' /></Link>
        <Link to='/'><h1>ChatAi</h1></Link>
      </div>
      <div className="nav-right">
        { getLinks() }
      </div>
    </div>
  );
}

export default NavBar;