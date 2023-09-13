
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './MainPage.css'
import splash from '../../assets/splash_placeholder.jpg'
import lofi from '../../assets/lofi.avif'

function MainPage() {
  return (
    <div className='main-container'>
      <h1 className='splash-header'>chat with anyone</h1>
      {/* <img className='splash-img' src={splash} alt='splash'></img> */}
      {/* <img className='lofi-img' src={lofi} alt='splash'></img> */}

      <footer>
        Copyright &copy; 2023 ChatAi
      </footer>
    </div>
  );
}

export default MainPage;