
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './MainPage.css'
import splash from '../../assets/splash_placeholder.jpg'

function MainPage() {
  return (
    <div className='main-container'>
      <h1 className='splash-header'>CHAT WITH ANYONE</h1>
      <img className='splash-img' src={splash} alt='splash'></img>
      <footer>
        Copyright &copy; 2023 ChatAi
      </footer>
    </div>
  );
}

export default MainPage;