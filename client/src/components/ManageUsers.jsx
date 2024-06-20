import React, { useEffect, useState } from 'react'
import styles from '../style'
import axios from 'axios';

const ManageUsers = ({ onBackClick }) => {
    const [users, setUsers] = useState([]);
    const [searchBy, setSearchBy] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching conference details:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        window.scrollTo(0, 0);
    }, [])


    const handleDeleteUser = async (user) => {
        const confirmDelete = window.confirm('Are you sure you want to remove this user?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/delete_user`, {
                    data: { email: user.email }
                });
                alert('User removed successfully!');
                fetchUsers();
            } catch (error) {
                console.error('Error removing user:', error);
                alert('Failed to remove user.');
            }
        }
    };


    const handleSearchChange = (event) => {
        setSearchBy(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchBy.toLowerCase())
    );

    return (
        <div className={`${styles.marginX} min-h-screen`}>
            <div className="flex ml-4 w-1/2">
            <button onClick={onBackClick} className="hover:cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 w-8 h-8 mt-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </button>
            <h2 className={`${styles.heading} mt-4 text-center`}>Manage users</h2>
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

            <ul>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <li key={index}
                            className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} h-12 text-2xl sm:my-4 my-2 sm:flex flex-row bg-black-gradient-2 rounded-[20px] box-shadow w-1/2 justify-between items-center`}>
                            <div>{user.email}</div>
                            <div onClick={() => handleDeleteUser(user)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#DC143C" className="hover:stroke-red-800 hover:cursor-pointer w-10 h-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                        </li>
                    ))) : (
                    <h2 className={styles.heading}>No users found</h2>
                )
                }
            </ul>
        </div>
    )
}

export default ManageUsers