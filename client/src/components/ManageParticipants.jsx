import React, { useEffect, useState } from 'react'
import styles from '../style'
import axios from 'axios';

const ManageParticipants = ({ conference, onBackClick }) => {
    const [attendees, setAttendees] = useState([]);
    const [newInvites, setNewInvites] = useState('');

    const fetchConferenceDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/attendees/${conference.conference_id}`);
            setAttendees(response.data.attendees);
        } catch (error) {
            console.error('Error fetching conference details:', error);
        }
    };

    useEffect(() => {
        fetchConferenceDetails();
    }, [conference.conference_id, attendees]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleDeleteClick = async (attendee) => {
        const confirmDelete = window.confirm('Are you sure you want to remove this participant?');
        if (confirmDelete) {
            try {
                // Send a DELETE request to remove the attendee
                await axios.delete(`http://localhost:5000/conference/${conference.conference_id}/attendees`, {
                    data: { email: attendee }
                });
                alert('Attendee removed successfully!');
            } catch (error) {
                console.error('Error removing attendee:', error);
                alert('Failed to remove attendee.');
            }
        }
    };

    const handleInviteSubmit = async (event) => {
        event.preventDefault();
        try {
            const inviteesArray = newInvites.split(',').map(email => email.trim());
            await axios.post(`http://localhost:5000/conference/${conference.conference_id}/invites`, {
                emails: inviteesArray
            });
            alert('Invites sent successfully!');
            setNewInvites('');
        } catch (error) {
            console.error('Error sending invites:', error);
            alert('Failed to send invites.');
        }
    };

    return (
        <div className={`${styles.marginX} ${styles.marginY}`}>
            <h1 className={styles.heading}>Manage Participants</h1>
            <div>
                <button onClick={onBackClick} className="hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-6 w-8 h-8 mt-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <p className='text-[12px] ml-6 mb-6'>Go back</p>
            </div>
            <hr class="h-[1px] my-8 border-t-[1px] border-stone-500"></hr>
            <div className={`${styles.body} mb-12`}>
                <p className='flex-col'>Invite new people or erase current participants.</p>
                <form onSubmit={handleInviteSubmit} className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} h-12 text-2xl sm:my-4 my-2 sm:flex flex-row w-1/2`}>
                    <input
                        type="text"
                        placeholder="Enter emails to invite (comma separated)"
                        value={newInvites}
                        onChange={(e) => setNewInvites(e.target.value)}
                        className="w-full p-2 rounded text-black"
                        required
                    />
                    <button type="submit" className="ml-4 p-2 bg-blue-600 hover:bg-blue-800 text-white rounded">Invite</button>
                </form>
            </div>
            <ul>
                {attendees.map((attendee, index) => (
                    <li key={index}
                        className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} h-12 text-2xl sm:my-4 my-2 sm:flex flex-row bg-black-gradient-2 rounded-[20px] box-shadow w-1/2 justify-between items-center`}>
                        <div>{attendee}</div>
                        <div onClick={() => handleDeleteClick(attendee)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#DC143C" className="w-10 h-10 hover:cursor-pointer hover:stroke-red-800">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ManageParticipants