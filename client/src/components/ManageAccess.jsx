import React, { useEffect, useState } from 'react'
import styles from '../style';
import axios from 'axios';

const ManageAccess = ({ onBackClick }) => {
    const [regulars, setRegulars] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [searchBy, setSearchBy] = useState('');

    const fetchRegulars = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/regulars`);
            setRegulars(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCoordinators = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/coordinators`);
            setCoordinators(response.data);
        } catch (error) {
            console.error('Error fetching coordinators:', error);
        }
    };

    useEffect(() => {
        fetchRegulars();
        fetchCoordinators();
        window.scrollTo(0, 0);
    }, [])


    const handleGrantAccess = async (email) => {
        const confirmGrant = window.confirm('Are you sure you want to grant access to this user?');
        if (confirmGrant) {
            try {
                const response = await axios.post(`http://localhost:5000/grant-access/${email}`);
                alert('Rights granted successfully');
                fetchCoordinators();
                fetchRegulars();
            } catch (error) {
                console.error('Error granting rights:', error);
                alert('Failed to grant rights...');
            }
        }
    }

    const handleRevokeAccess = async (email) => {
        const confirmRevoke = window.confirm('Are you sure you want to revoke access from this coordinator?');
        if (confirmRevoke) {
            try {
                const response = await axios.post(`http://localhost:5000/revoke-access/${email}`);
                alert('Rights revoked successfully');
                fetchCoordinators();
                fetchRegulars();
            } catch (error) {
                console.error('Error revoking rights:', error);
                alert('Failed to revoke rights...');
            }
        }
    }

    const handleSearchChange = (event) => {
        setSearchBy(event.target.value);
    };

    const filteredRegulars = regulars.filter((user) =>
        user.email.toLowerCase().includes(searchBy.toLowerCase())
    );

    const filteredCoordinators = coordinators.filter((user) =>
        user.email.toLowerCase().includes(searchBy.toLowerCase())
    );

    return (
        <div className={`${styles.defaultBackground} ${styles.marginX} min-h-screen`}>
            <div className="flex ml-4 w-1/2">
            <button onClick={onBackClick} className="hover:cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 w-8 h-8 mt-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
            <h2 className={`${styles.heading} mt-4 text-center`}>Manage roles</h2>
            </div>
            <p className='text-[12px] mb-6 ml-4'>
                Go back
            </p>
            <hr class="h-[1px] my-8 border-t-[1px] border-stone-500"></hr>
            <input
                type="text"
                placeholder="Search by email"
                value={searchBy}
                onChange={handleSearchChange}
                className="p-2 mb-4 border border-gray-300 rounded"
            />
            <p>Coordinators</p>
            <ul>
                {filteredCoordinators.length > 0 ? (filteredCoordinators.map((coordinator, index) => (
                    <li key={index}
                        className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} h-12 text-2xl sm:my-4 my-2 sm:flex flex-row bg-black-gradient-2 rounded-[20px] box-shadow w-1/2 justify-between items-center`}>
                        <div>{coordinator.email}</div>
                        <div onClick={() => handleRevokeAccess(coordinator.email)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#DC143C" className="hover:cursor-pointer hover:stroke-red-800 w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </li>
                ))) : (
                    <h2 className={styles.heading}>No coordinators found</h2>
                )}
            </ul>
            <p className='mt-12'>Regular users</p>
            <ul>
                {filteredRegulars.length > 0 ? (filteredRegulars.map((regular, index) => (
                    <li key={index}
                        className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} h-12 text-2xl sm:my-4 my-2 sm:flex flex-row bg-black-gradient-2 rounded-[20px] box-shadow w-1/2 justify-between items-center`}>
                        <div>{regular.email}</div>
                        <div onClick={() => handleGrantAccess(regular.email)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#60D630" className="hover:cursor-pointer hover:stroke-green-800 w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </li>
                ))) : (
                    <h2 className={styles.heading}>No regulars found</h2>
                )}
            </ul>
        </div>
    )
}

export default ManageAccess