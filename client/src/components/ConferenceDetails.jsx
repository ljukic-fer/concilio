import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../style';
import EventCalendar from './EventCalendar';
import Repository from './Repository';
import ManageParticipants from './ManageParticipants';
import ManageEvents from './ManageEvents';

const ConferenceDetails = ({ conference, onBackClick }) => {
    const [conferenceDetails, setConferenceDetails] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [openRepository, setOpenRepository] = useState(false);
    const [participantsScreen, setParticipantsScreen] = useState(false);
    const [eventsScreen, setEventsScreen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchConferenceDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/conference/${conference.conference_id}`, {
                    headers: {
                        Authorization: token
                    }
                });
                setConferenceDetails(response.data);
            } catch (error) {
                console.error('Error fetching conference details:', error);
            }
        };

        fetchConferenceDetails();
    }, [conference.conference_id, token]);

    useEffect(() => {
        if (conferenceDetails) {
            const formattedEvents = formatEvents(conferenceDetails);
            const now = new Date();
            formattedEvents.sort((a, b) => a.start - b.start);
            const upcoming = formattedEvents.find(event => event.start > now);
            const current = formattedEvents.find(event => event.start <= now && event.end >= now);
            setUpcomingEvent(upcoming);
            setCurrentEvent(current);
            window.scrollTo(0, 0);
        }
    }, [conferenceDetails])


    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatEvents = (events) => {
        return events.map(event => ({
            title: event.title,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            description: event.description,
            authors: event.authors.join(', '),
            venue: event.venue
        }));
    };

    const handleOpenRepository = () => {
        setOpenRepository(true);
    }
    const handleCloseRepository = () => {
        setOpenRepository(false);
    }


    const handleParticipants = () => {
        setParticipantsScreen(true);
    }
    const handleBackToDetails = () => {
        setParticipantsScreen(false);
        setEventsScreen(false);
    }
    const handleEvents = () => {
        setEventsScreen(true);
    }

    return (
        <div>
            {!openRepository && !participantsScreen && !eventsScreen &&
                <div className={`${styles.marginX} ${styles.marginY}`}>
                    <h1 className={`${styles.heading}`}>{conference.title}</h1>
                    <button onClick={onBackClick} className="hover:cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-6 w-8 h-8 mt-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <p className='text-[12px] ml-6 mb-6'>Go back</p>
                    <hr class="h-[1px] my-8 border-t-[1px] border-stone-500"></hr>
                    <div className='flex'>
                        <p className={`${styles.body} flex-col ml-6 mb-6 w-1/2`}>{conference.description}</p>
                        <p className='ml-auto'>{formatDate(conference.start_time)} - {formatDate(conference.end_time)}</p>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.leftSection}>
                            {conferenceDetails ? <EventCalendar events={formatEvents(conferenceDetails)} /> : <p>ERROR</p>}
                        </div>
                        <div className={`${styles.rightSection} ${styles.boxWidth} h-full mt-20`}>
                            <div className={`${styles.upperHalf} ${styles.flexCenter} ${styles.marginY} ${styles.padding} min-h-60 sm:flex flex-col bg-red-500/25 rounded-[20px] box-shadow`}>
                                {currentEvent ? (
                                    <div>
                                        <h3 className='font-bold'>Current Event</h3>
                                        <p>{currentEvent.title}</p>
                                        <p>{formatDate(currentEvent.start)}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3>No events in progress...</h3>
                                    </div>
                                )}
                                {upcomingEvent ? (
                                    <div className='mt-6'>
                                        <h3 className='font-bold'>Up next...</h3>
                                        <p>{upcomingEvent.title}</p>
                                        <p>{formatDate(upcomingEvent.start)}</p>
                                    </div>
                                ) : (
                                    <div className='mt-6'>
                                        <h3 className='font-bold'>No future events scheduled...</h3>
                                    </div>
                                )}
                            </div>
                            <div className={`${styles.lowerHalf} ${styles.flexCenter} ${styles.marginY} ${styles.padding} min-h-40 sm:flex-row flex-col bg-red-500/25 rounded-[20px] box-shadow hover:shadow-2xl hover:bg-red-700/25 hover:scale-110 transition delay-150`}
                                onClick={() => handleOpenRepository()}>
                                <div>
                                    <h1 className={`${styles.heading} cursor-pointer`}>Repository</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div>

                {conference.coordinator === localStorage.getItem('email') && !participantsScreen && !openRepository && !eventsScreen &&
                    <div className='flex flex-row px-12'>
                        <div className={`${styles.paragraph} ${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex flex-col bg-black-gradient-2 ml-auto hover:cursor-pointer hover:scale-110 transition hover:shadow-2xl rounded-[20px] box-shadow h-full w-1/3`}
                            style={{ boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.9)' }}
                            onClick={handleParticipants}>
                            Manage participants
                        </div>
                        <div className={`${styles.paragraph} ${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex flex-col bg-black-gradient-2 ml-auto hover:cursor-pointer hover:scale-110 transition hover:shadow-2xl rounded-[20px] box-shadow h-full w-1/3 m-auto`}
                            style={{ boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.9)' }}
                            onClick={handleEvents}>
                            Manage events
                        </div>
                    </div>
                }
                {conference && participantsScreen && !openRepository && <ManageParticipants conference={conference} onBackClick={handleBackToDetails} />}
                {conference && eventsScreen && !openRepository && <ManageEvents conference={conference} onBackClick={handleBackToDetails} />}
            </div>

            {openRepository && <Repository conference={conference} onBackClick={handleCloseRepository} />}
        </div>
    );
}

export default ConferenceDetails;
