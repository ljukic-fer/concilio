import React, { useState } from 'react';
import axios from 'axios';
import styles, { layout } from '../style';
import { useDispatch, useSelector } from 'react-redux';
import { setDob, setEmail, setFirstName, setLastName, setRole, setToken } from '../redux/actions/AuthActions'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { conferencePic } from '../assets'
import MainNav from './MainNav';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const history = useHistory();

  const tok = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      const { user, token } = response.data;

      // Store the token in localStorage or session storage
      localStorage.setItem('token', token);
      localStorage.setItem('email', user.email);

      console.log('Token from store: ', tok);

      dispatch(setToken(token));
      dispatch(setEmail(user.email));
      dispatch(setFirstName(user.firstName));
      dispatch(setLastName(user.lastName));
      dispatch(setDob(user.dob));
      dispatch(setRole(user.role));

      //window.location.href = '/inbox';
      history.push('/dashboard');
      alert('Login successful!' + tok + 'Email: ' + user.dob);

    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <MainNav />
      <div className={`w-full flex text-center ${styles.flexStart} ${styles.defaultBackground}`}>
        <div className='flex flex-1'>
          <h2 className={styles.heading}>
            <img src={conferencePic} alt='conference-pic' className=' blur-[1.5px] h-screen object-cover align-self-end' />
          </h2>
        </div>
        <div className={`flex-1 text-center ${styles.paddingX} ${styles.flexStart} ${styles.defaultBackground}`}>
          <div className={`${styles.boxWidth}`}>
            <section id="login" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-red-500/25 rounded-[20px] box-shadow`}>
              <div className='flex-1 flex flex-col'>
                <h2 className={styles.heading}>
                  Login
                </h2>
                <p className={`${styles.body} mt-5`}>
                  Log in to access your account
                </p>
              </div>
            </section>
            <section id="login" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-red-500/25 rounded-[20px] box-shadow`}>
              <div className='flex-1 dlex flex-col'>
                <form onSubmit={handleSubmit} className={layout.signupStyle}>
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                  <button type="submit" className={`py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px] hover:text-blue-800`}>Login</button>
                </form>
                <p className={styles.body}>
                  Don't have an account?
                </p>
                <button className='text-white hover:text-sky-400'
                  onClick={event => window.location.href = '/signup'}>Sign up here</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
