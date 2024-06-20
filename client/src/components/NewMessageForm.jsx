import React, { useState } from 'react';
import axios from 'axios';
import styles from '../style';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const NewMessageForm = ({ onBackClick }) => {
    const currentUser = localStorage.getItem('email');
    const history = useHistory();

    const [formData, setFormData] = useState({
        sender: currentUser,
        receiver: '',
        subject: '',
        body: ''
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.receiver.trim()) {
            window.alert('Receiver email cannot be empty.');
            return;
        }

        if (!formData.subject.trim() || !formData.body.trim()) {
            window.alert('Subject and body cannot be empty.');
            return;
        }

        try {
            const checkEmailResponse = await axios.post('http://localhost:5000/check-email', { email: formData.receiver });

            console.log('Email RESPONSE: ' + checkEmailResponse.status)
            if (checkEmailResponse.status === 200) {
                const sendMessageResponse = await axios.post('http://localhost:5000/messages/new', formData);
                console.log('Message sent successfully:', sendMessageResponse.data);
                window.alert('Message sent successfully!');

                window.location.reload();
            } else {
                window.alert('Receiver email does not exist.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            window.alert('Error: User with provided email doesnt exist');
        }
    };


    return (
        <div className=''>
            <h2 className={styles.heading}>New Message</h2>
            <form onSubmit={handleSubmit} className={`${styles.body} p-6 rounded shadow-2xl`}>
                <button onClick={onBackClick} className='flex ml-auto mb-6'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hover:text-red-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>

                <input type="text" name="receiver" placeholder="Receiver" value={formData.receiver} onChange={handleChange} className="w-full p-2 rounded text-black mb-4" />
                <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="w-full p-2 rounded text-black mb-4" />
                <textarea name="body" className='w-full mb-4' placeholder="Message Body" value={formData.body} onChange={handleChange} style={{ height: 'auto', minHeight: '300px', maxHeight: '1200px', minWidth: '400px' }} />
                <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="-6 -4 32 32" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default NewMessageForm;
