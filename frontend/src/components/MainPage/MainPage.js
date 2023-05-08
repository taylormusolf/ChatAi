
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import './MainPage.css'

function MainPage() {
  return (
    <>
      <h1 className='chat-link'><Link to='/chat'>Chat with single dogs here!</Link></h1>
      <footer>
        Copyright &copy; 2023 The Social Petwork
      </footer>
    </>
  );
}

export default MainPage;