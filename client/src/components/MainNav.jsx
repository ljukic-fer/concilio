import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style';
import { ConcilioLogo } from '../assets';

const MainNav = () => {

    return (
        <nav className="bg-gray-800 p-4 min-h-18 text-[20px] font-poppins">
            <div className="flex items-center ml-4 py-1">
                <p className='text-white text-[18px] mr-4 font-serif font-medium tracking-wide italic'>Concilio</p>
                <img src={ConcilioLogo} alt='concilio' className='w-[28px] h-[28px]' />
                <ul className="flex items-center space-x-12 ml-auto mr-8">
                    <li>
                        <Link to="/" className="text-white hover:text-gray-400">Home</Link>
                    </li>
                    <li>
                        <Link to="/auth" className="text-white hover:text-gray-400">Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default MainNav;
