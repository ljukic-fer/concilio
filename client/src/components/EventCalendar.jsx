import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '../style';

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleClosePopup = () => {
        setSelectedEvent(null);
    };

    return (
        <div>
            <div className={styles.leftSection}>
                <h2 className={styles.heading}>Calendar</h2>
                <div className={styles.calendar}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView='month'
                        style={{ height: 450, width: '80%', color: '#0a3632', backgroundColor: '#d4aeae', border: '1.5px solid #0a3632', borderRadius: '10px' }}
                        onSelectEvent={handleEventClick}
                    />
                </div>
            </div>
            {selectedEvent && (
                <div className={styles.popupContainer}>
                    <div className={styles.popup}>
                        <div className={styles.popupcontent}>
                            <button onClick={handleClosePopup} className='flex ml-auto mb-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hover:text-red-800">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                            <h1 className='font-bold mb-2'>{selectedEvent.title}</h1>
                            <p>{selectedEvent.description}</p>
                            <p className='text-right mt-2 text-[11px]'>Authors: {selectedEvent.authors}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCalendar;
