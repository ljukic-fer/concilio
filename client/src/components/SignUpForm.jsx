import React, { useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import styles, { layout } from '../style';
import MainNav from './MainNav';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dob: '',
    role: 3
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { firstName, lastName, email, password, dob } = formData;

    if (!firstName || !lastName || !email || !password || !dob) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      // Send form data to server for registration
      await axios.post('http://localhost:5000/register', formData);
      // Reset form after successful registration
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dob: '',
        role: 3
      });
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      if ((String(error)).substring(String(error).length - 3) === '400') {
        alert("ERROR! User with provided e-mail already exists")
      } else {
        alert('Error registering user. Please try again.');
      }
    }
  };

  return (
    <div>
      <MainNav />
      <div className={`flex-1 text-center ${styles.defaultBackground} ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <section id="login" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}>
            <div className='flex-1 flex flex-col'>
              <h2 className={styles.heading2}>
                Sign up
              </h2>
              <p className={styles.paragraph}>
                Fill in your data to create a new account
              </p>
            </div>
          </section>
          <section id="signup" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}>
            <div className='flex-1 dlex flex-col'>
              <form onSubmit={handleSubmit} className={layout.signupStyle}>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                <button type="submit" className={`py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px]`}>Sign up</button>
              </form>
              <p className={styles.paragraph}>
                Already have an account?
              </p>
              <button className='text-white hover:text-sky-400'
                onClick={event => window.location.href = '/login'}>Log in here</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
