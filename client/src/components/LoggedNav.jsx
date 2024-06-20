import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/actions/AuthActions';
import styles from '../style';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { ConcilioLogo } from '../assets';

const LoggedNav = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleClick = (event, path) => {
        if (location.pathname === path) {
            event.preventDefault();
            window.location.reload();
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(setToken(null));
        history.push('/auth');
    };

    return (
        <nav className="bg-gray-800 p-4 min-h-18 text-[20px] font-poppins">
            <div className="flex items-center ml-4">
                <p className='text-white text-[18px] mr-4 font-serif font-medium tracking-wide italic'>Concilio</p>
                <img src={ConcilioLogo} alt='concilio' className='w-[28px] h-[28px]' />
                <div className='ml-auto'>
                <ul className="flex space-x-20">
                    <li>
                        <Link to="/dashboard" onClick={(e) => handleClick(e, '/dashboard')} className="text-white hover:text-gray-400">Home</Link>
                    </li>
                    <li>
                        <Link to="/inbox" onClick={(e) => handleClick(e, '/inbox')} className="text-white hover:text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                            </svg>
                            Inbox
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" onClick={(e) => handleClick(e, '/profile')} className="text-white hover:text-gray-400">Profile</Link>
                    </li>
                    <li>
                    <button onClick={handleLogout} className="py-1 px-6 bg-red-600 font-poppins font-medium text-primary outline-none rounded-[10px] flex mr-8 text-white hover:text-gray-400">Logout</button>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
};

export default LoggedNav;
