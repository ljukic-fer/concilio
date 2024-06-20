import React, { useEffect, useState } from 'react'
import styles from '../style'
import axios from 'axios';

const ManageEvents = ({ conference, onBackClick }) => {
  const token = localStorage.getItem('token')
  const [events, setEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    authors: '',
    venue: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/conference/${conference.conference_id}`, {
        headers: {
          Authorization: token
        }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    window.scrollTo(0, 0);
  }, [conference.conference_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authorsArray = formData.authors.split(',').map(author => author.trim());
      const newEvent = { ...formData, authors: authorsArray, conference_id: conference.conference_id };
      await axios.post('http://localhost:5000/events', newEvent);
      alert('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        authors: '',
        venue: ''
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event.');
    }
  };

  const handleDelete = async (event_id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/events/${event_id}`);
        alert('Event deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
      }
    }
  };

  const handleShowEventDetails = (eventId) => {
    setShowEventDetails(prev => (prev === eventId ? null : eventId));
  }

  const handleCreateEventClick = () => {
    if (showCreateEventForm) setShowCreateEventForm(false);
    else setShowCreateEventForm(true);
  }

  return (
    <div className='flex'>
      <div className={`${styles.marginX} ${styles.marginY} flex-col flex-1`}>
        <h1 className={styles.heading}>Manage events</h1>
        <div>
          <button onClick={onBackClick} className="hover:cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-6 w-8 h-8 mt-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <p className='text-[12px] ml-6 mb-6'>Go back</p>
          <p className='border-t-[1px] border-stone-500 mb-12'></p>
        </div>
        {events.length > 0 ? (
          <ul>
            {events.map(event => (
              <li key={event.event_id}
                className={`${styles.paragraph} ${styles.flexStart} ${styles.padding} text-2xl sm:my-4 my-2 sm:flex bg-black-gradient-2 rounded-[20px] box-shadow w-full justify-between items-center`}
                onClick={() => handleShowEventDetails(event.event_id)}
                onMouseEnter={() => setHoveredEventId(event.event_id)}
                onMouseLeave={() => setHoveredEventId(null)} >
                <div>
                  <h3 className='font-bold text-white mb-2'>{event.title}</h3>
                  <p>{new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</p>
                  {showEventDetails === event.event_id && <div>
                    <p>{event.description}</p>
                    <p className='text-right mt-2 text-[12px]'>Authors: {event.authors.join(', ')}</p>
                  </div>}
                  {hoveredEventId === event.event_id && showEventDetails !== event.event_id && (
                    <div className="text-center text-[12px] text-gray-400">
                      Click to see additional info
                    </div>
                  )}
                </div>
                <div onClick={() => handleDelete(event.event_id)} style={{ marginLeft: 'auto', cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#DC143C" className="w-10 h-10 hover:stroke-red-800">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>) : (
          <h1 className='font-poppins font-bold text-[24px] mt-12'>No events scheduled for this conference</h1>
        )}
      </div>
      <div className={`${styles.rightSection} p-16`}>
        {!showCreateEventForm && <button onClick={handleCreateEventClick} className="py-1 px-12 bg-blue-600 font-poppins font-medium text-primary outline-none rounded-[10px] ml-auto mr-8 text-white hover:bg-blue-800">
          Create new event
        </button>}
        {showCreateEventForm &&
          <div>
            <h1 className={styles.heading}>Create a new event</h1>
            <form onSubmit={handleSubmit} className={`${styles.body} p-6 rounded shadow-2xl mb-8`}>
              <button onClick={handleCreateEventClick} className='flex ml-auto mb-6'>
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
                <label>Authors (comma-separated)</label>
                <input
                  type="text"
                  name="authors"
                  value={formData.authors}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-black"
                  required
                />
              </div>
              <div className='mb-4'>
                <label>Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-black"
                  required
                />
              </div>
              <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Create Event</button>
            </form>
          </div>
        }
      </div>
    </div>
  )
}

export default ManageEvents