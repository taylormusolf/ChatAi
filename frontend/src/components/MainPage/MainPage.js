
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import splash from '../../assets/splash_placeholder.jpg'
import lofi from '../../assets/lofi.avif'
import Footer from '../Footer/Footer';

function MainPage() {
  return (
    <div className='main-container'>
      <h1 className='splash-header'>chat with anyone</h1>
      {/* <img className='splash-img' src={splash} alt='splash'></img> */}
      {/* <img className='lofi-img' src={lofi} alt='splash'></img> */}

      <Footer />
    </div>
  );
}

export default MainPage;