import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
// import dogImg from '../../assets/dog-24.svg';
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
          {/* <Link to={'/posts'}>All Posts</Link> */}
          <Link to={'/profile'}>
          {user.profileImageUrl ? 
            <img className='profile-pic' src={user.profileImageUrl} alt='profile-img' /> : 
            null}
          </Link>  
          {/* <Link to={'/posts/new'}>Write a Post</Link> */}
          <button onClick={logoutUser}>Logout</button>
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
      <Link to='/'><img className='logo' src={gpt} alt='logo' /></Link>
      <Link to='/'><h1>ChatAi</h1></Link>
      { getLinks() }
    </div>
  );
}

export default NavBar;