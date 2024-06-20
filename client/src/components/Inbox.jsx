import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import styles, { layout } from '../style';
import { setDob, setEmail, setFirstName, setLastName, setRole } from '../redux/actions/AuthActions';
import ChatDetails from './ChatDetails';
import NewMessageForm from './NewMessageForm';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showNewMessageForm, setShowNewMessageForm] = useState(false);
    const firstName = useSelector((state) => state.auth.firstName);
    const lastName = useSelector((state) => state.auth.lastName);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!token) {
                    throw new Error('Token not found');
                }

                axios.get('http://localhost:5000/profile', {
                    headers: {
                        Authorization: token
                    }
                })
                    .then(response => {
                        dispatch(setEmail(response.data.email));
                        dispatch(setFirstName(response.data.firstName));
                        dispatch(setLastName(response.data.lastName));
                        dispatch(setDob(response.data.dob));
                        dispatch(setRole(response.data.role));
                        console.log(response.data)
                    })
                    .catch(error => {
                        console.error('Error fetching profile:', error);
                        console.log('Error response data:', error.response.data);
                        //history.push('/login');
                    });

                const response = await axios.get('http://localhost:5000/messages', {
                    headers: {
                        Authorization: token
                    }
                });

                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [firstName, lastName]);

    const handleMessageBoxClick = (message) => {
        setSelectedMessage(message);
    };

    const handleBackClick = () => {
        setSelectedMessage(null);
        setShowNewMessageForm(null);
    };

    const handleNewMessageClick = () => {
        setShowNewMessageForm(true);
    };

    return (
        <div className={`${styles.defaultBackground} min-h-screen`}>
            {token && !selectedMessage && (
                <div className='flex'>
                    <div className={`w-1/2 p-8 flex-col`}>
                        <h2 className={styles.heading}>Inbox</h2>
                        <div className={`${styles.body}`}>
                            {messages.length > 0 ? (
                                <ul>
                                    {messages.map((message, index) => (
                                        <li key={index}>
                                            <div className='text-center bg-red-500/25 rounded-[20px] box-shadow hover:shadow-2xl outline-offset-1 outline-dashed outline-1 hover:bg-red-700/25 hover:scale-105 hover:outline w-full my-8 mx-12'
                                                onClick={() => handleMessageBoxClick(message)}>
                                                <p>From: {message.sender}</p>
                                                <p>To: {message.receiver}</p>
                                                <p>Subject: {message.subject}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No messages in your inbox</p>
                            )}
                        </div>
                    </div>
                    <div className={`${styles.rightSection} p-16`}>
                        {!showNewMessageForm && <button onClick={handleNewMessageClick} className="py-1 px-12 bg-blue-600 font-poppins font-medium text-primary outline-none rounded-[10px] ml-auto mr-8 text-white hover:bg-blue-800">
                            New message
                        </button>}
                        {showNewMessageForm && <NewMessageForm onBackClick={handleBackClick} />}
                    </div>
                </div>)
            }
            {selectedMessage && <ChatDetails message={selectedMessage} onBackClick={handleBackClick} />}
        </div>
    );
}

export default Inbox