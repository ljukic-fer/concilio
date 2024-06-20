import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import styles from '../style';

const NewConferenceForm = ({ onBackClick }) => {
    const currentUser = localStorage.getItem('email');
    const history = useHistory();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        coordinator: currentUser,
        start_time: '',
        end_time: '',
        invitees: ''
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const inviteesArray = formData.invitees.split(',').map(email => email.trim());
            const response = await axios.post('http://localhost:5000/conferences/new', {
                ...formData,
                invitees: inviteesArray
            });
            alert('Conference created successfully!');
        } catch (error) {
            console.error('Error creating conference:', error);
            alert('Failed to create conference.');
        }
    };

    return (
        <div className="container">
            <h1 className={styles.heading}>Create a new conference</h1>
            <form onSubmit={handleSubmit} className={`${styles.body} p-6 rounded shadow-2xl mb-8`}>
                <button onClick={onBackClick} className='flex ml-auto mb-6'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hover:text-red-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
                <div className='mb-4'>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-black"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-black"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label>Start Time</label>
                    <input
                        type="datetime-local"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-black"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label>End Time</label>
                    <input
                        type="datetime-local"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-black"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label>Attendees (comma-separated emails)</label>
                    <input
                        type="text"
                        name="invitees"
                        value={formData.invitees}
                        onChange={handleChange}
                        className="w-full p-2 rounded text-black"
                        required
                    />
                </div>
                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Create Conference</button>
            </form>
        </div>
    )
}

export default NewConferenceForm;