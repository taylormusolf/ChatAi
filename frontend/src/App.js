import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';

import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import Profile from './components/Profile/Profile';

import { getCurrentUser } from './store/session';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import ChatBotNew from './components/ChatBot/ChatBotNew';
import ChatBotIndex from './components/ChatBot/ChatBotIndex';
import ChatBotShow from './components/ChatBot/ChatBotShow';
import ChatBattle from './components/ChatBot/ChatBattle';
import ChatBotSearch from './components/ChatBot/ChatBotSearch';
import Modal from './components/Modal/Modal';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);

  return loaded && (
    <>
      <div className='app-wrapper'>
        <Modal />
        <NavBar />
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
          <AuthRoute exact path="/login" component={LoginForm} />
          <AuthRoute exact path="/signup" component={SignupForm} />

          <ProtectedRoute exact path="/chatbots/new" component={ChatBotNew} />

          <ProtectedRoute exact path="/chatbots/" component={ChatBotIndex} />
          <ProtectedRoute exact path="/chatbots/search" component={ChatBotSearch} />
          <ProtectedRoute exact path="/chatbots/battle" component={ChatBattle} />
          <ProtectedRoute exact path="/chatbots/:chatBotId" component={ChatBotShow} />
          <ProtectedRoute exact path="/profile" component={Profile} />
        </Switch>
        
      </div>
    </>
  );
}

export default App;