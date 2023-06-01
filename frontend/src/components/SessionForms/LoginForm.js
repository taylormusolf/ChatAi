import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {delay} from '../Util';

import { login, clearSessionErrors } from '../../store/session';

function LoginForm () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = (field) => {
    const setState = field === 'email' ? setEmail : setPassword;
    return e => setState(e.currentTarget.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })); 
  }
  const handleDemo = async(e) => {
    e.preventDefault();
  
    let emailArr = 'demo@user.com'.split('');
    let passwordArr = '123456'.split('');

    for (let i = 0; i < emailArr.length; i++) {
      await delay(100)
      setEmail(emailArr.slice(0,i+1).join(''))
    }
    for (let i = 0; i < passwordArr.length; i++) {
      await delay(100)
      setPassword(passwordArr.slice(0,i+1).join(''))
    }
    await delay(100);
    dispatch(login({
      email: 'demo@user.com',
      password: '123456'
    }))

  }

  return (
    <div className='session-form-container'>
      <form className="session-form" onSubmit={handleSubmit}>
        <h2>Log In Form</h2>
        <div className="errors">{errors?.email}</div>
        <label>
          <span>Email</span>
          <input type="text"
            value={email}
            onChange={update('email')}
            placeholder="Email"
          />
        </label>
        <div className="errors">{errors?.password}</div>
        <label>
          <span>Password</span>
          <input type="password"
            value={password}
            onChange={update('password')}
            placeholder="Password"
          />
        </label>
        <input
          type="submit"
          value="Log In"
          disabled={!email || !password}
        />
        <div onClick={handleDemo} id="demo-button">Demo User Login</div>
      </form>
    </div>
  );
}

export default LoginForm;