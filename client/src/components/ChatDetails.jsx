import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../style';

const ChatDetails = ({ message, onBackClick }) => {
    const [chatDetails, setChatDetails] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/chat/${message.chat_id}`, {
                    headers: {
                        Authorization: token
                    }
                });
                setChatDetails(response.data);
            } catch (error) {
                console.error('Error fetching chat details:', error);
            }
        };

        fetchChatDetails();
        window.scrollTo(0, 0);
    }, [message.chat_id, token]);


    const handleReplyChange = (event) => {
        setReplyMessage(event.target.value);
    };


    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!replyMessage.trim()) {
            window.alert('Reply message cannot be empty.');
            return;
        }

        const currentUser = localStorage.getItem('email')
        const rcv = currentUser === message.sender ? message.receiver : message.sender
        try {
            const response = await axios.post('http://localhost:5000/reply', {
                id: message.chat_id,
                sender: currentUser,
                receiver: rcv,
                body: replyMessage
            }, {
                headers: {
                    Authorization: token
                }
            });
            console.log('Reply sent successfully:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    }


    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    return (
        <div className={styles.body}>
            <div className="flex">
                <div className={`${styles.leftSection} flex-col mx-20 my-20 w-1/2`}>
                    <div className=''>
                        <h1 className='text-4xl mb-10'>{message.subject}</h1>
                        <p>From: {message.sender}</p>
                        <p>To: {message.receiver}</p>
                        <button onClick={onBackClick} className="fixed mt-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>
                            Go Back
                        </button>
                    </div>
                </div>

                <div className={`${styles.rightSection} flex flex-col w-1/2`}>
                    <form onSubmit={handleReplySubmit}>
                        <label>
                            Reply:
                            <textarea className='text-black resize-none overflow-y-hidden' value={replyMessage} onChange={handleReplyChange} style={{ height: 'auto', minHeight: '150px', maxHeight: '800px', minWidth: '600px' }} />
                        </label>
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="-6 -4 32 32" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                    {chatDetails && token && (
                        <ul>
                            {chatDetails.map((message, index) => (
                                <li key={index} className={message.sender === localStorage.getItem('email') ? styles.greyBackground : styles.defBackground}>
                                    <div className='text-center rounded-md outline-offset-1 outline-1 outline-dashed hover:outline my-8'>
                                        <p className='text-right text-gray-500 mb-6 text-[16px] mr-2'>{formatDate(message.time_sent)}</p>
                                        <p className='ml-2' style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{message.body}</p>
                                        <p className='text-right text-gray-500 mb-6 text-[16px] mr-2'>{message.sender}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatDetails;
