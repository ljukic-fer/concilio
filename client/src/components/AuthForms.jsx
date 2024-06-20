import React, { useState } from 'react';
import axios from 'axios';
import styles, { layout } from '../style';
import { useDispatch, useSelector } from 'react-redux';
import { setDob, setEmail, setFirstName, setLastName, setRole, setToken } from '../redux/actions/AuthActions'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { conferencePic, conferencePic2 } from '../assets'
import MainNav from './MainNav';

const AuthForms = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [newFormData, setNewFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dob: '',
        role: 3
    });

    const [toggleSignUp, setToggleSignUp] = useState(false);

    const history = useHistory();

    const tok = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUpChange = e => {
        setNewFormData({ ...newFormData, [e.target.name]: e.target.value });
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

            history.push('/dashboard');
            alert('Login successful!' + tok + 'Email: ' + user.dob);

        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid email or password. Please try again.');
        }
    };


    const handleSignUp = async e => {
        e.preventDefault();

        const { firstName, lastName, email, password, dob } = newFormData;

        if (!firstName || !lastName || !email || !password || !dob) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            // Send form data to server for registration
            await axios.post('http://localhost:5000/register', newFormData);
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


    const toggleAuth = () => {
        if (toggleSignUp) setToggleSignUp(false);
        else setToggleSignUp(true);
    }

    return (
        <div>
            {!toggleSignUp ? (
                <div className={`w-full flex flex-col md:flex-row min-h-screen overflow-y-auto ${styles.defaultBackground}`}>
                    <div className='w-full md:w-1/2 relative'>
                        <img src={conferencePic2} alt='conference-pic-2' className='brightness-75 blur-[1px] w-full h-full object-cover' />
                    </div>
                    <div className='w-full h-full md:w-1/2 flex justify-center items-center'>
                        <div className={`flex-1 text-center ${styles.paddingX} ${styles.flexStart} ${styles.defaultBackground}`}>
                            <div className={`${styles.boxWidth}`}>
                                <section id="login" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-red-500/25 rounded-[20px] shadow-2xl`}>
                                    <div className='flex-1 dlex flex-col'>
                                        <h2 className={`${styles.heading}`}>Login</h2>
                                        <p className={`${styles.body} mb-10`}>Enter your credentials here to access your account</p>
                                        <form onSubmit={handleSubmit} className={layout.signupStyle}>
                                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                                            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                                            <button type="submit" className={`py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px] hover:text-blue-800`}>Login</button>
                                        </form>
                                        <p className={styles.body}>
                                            Don't have an account?
                                        </p>
                                        <button className='text-stone-800 hover:text-sky-600'
                                            onClick={toggleAuth}>Sign up here</button>
                                    </div>
                                </section>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <div className={`w-full flex flex-col md:flex-row min-h-screen overflow-y-auto ${styles.defaultBackground}`}>
                    
                    <div className='w-full h-full md:w-1/2 flex justify-center items-center'>
                        <div className={`flex-1 text-center ${styles.defaultBackground} ${styles.paddingX} ${styles.flexStart}`}>
                            <div className={`${styles.boxWidth}`}>
                                <section id="signup" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-red-500/25 rounded-[20px] shadow-2xl`}>
                                    <div className='flex-1 dlex flex-col'>
                                        <h2 className={styles.heading}>
                                            Sign up
                                        </h2>
                                        <p className={`${styles.body} mb-10`}>
                                            Fill in your data to create a new account
                                        </p>
                                        <form onSubmit={handleSignUp} className={layout.signupStyle}>
                                            <input type="text" name="firstName" placeholder="First Name" value={newFormData.firstName} onChange={handleSignUpChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                                            <input type="text" name="lastName" placeholder="Last Name" value={newFormData.lastName} onChange={handleSignUpChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                                            <input type="email" name="email" placeholder="Email" value={newFormData.email} onChange={handleSignUpChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                                            <input type="password" name="password" placeholder="Password" value={newFormData.password} onChange={handleSignUpChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                                            <input type="date" name="dob" placeholder="Date of Birth" value={newFormData.dob} onChange={handleSignUpChange} className="rounded-lg p-3 w-full max-w-[400px]" />
                                            <button type="submit" className={`py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none rounded-[10px]`}>Sign up</button>
                                        </form>
                                        <p className={styles.body}>
                                            Already have an account?
                                        </p>
                                        <button className='text-stone-800 hover:text-sky-600'
                                            onClick={toggleAuth}>Log in here</button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 relative'>
                        <img src={conferencePic} alt='conference-pic' className='blur-[2px] w-full h-full object-cover' />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthForms;
