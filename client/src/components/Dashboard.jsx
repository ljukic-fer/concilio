import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDob, setEmail, setFirstName, setLastName, setRole } from '../redux/actions/AuthActions';
import axios from 'axios';
import styles from '../style';
import ConferenceDetails from './ConferenceDetails';

const Dashboard = () => {
  const [conferences, setConferences] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const dispatch = useDispatch();
  const firstName = useSelector((state) => state.auth.firstName);
  const lastName = useSelector((state) => state.auth.lastName);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
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

      axios.get('http://localhost:5000/conferences', {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setConferences(response.data);
        })
        .catch(error => {
          console.error('Error fetching conferences:', error);
        });

    } else {
      //history.push('/login');
    }
  }, [conferences]);


  const fetchInvites = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:5000/invites', {
        headers: {
          Authorization: token
        }
      });
      setInvites(response.data);
    } catch (error) {
      console.error('Error fetching conference details:', error);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [])

  const handleConferenceBoxClick = (conference) => {
    setSelectedConference(conference);
  };

  const handleBackClick = () => {
    setSelectedConference(null);
  };

  const handleAcceptInvite = async (invite) => {
    const confirmation = window.confirm('Are you sure you want to attend this conference?');
    if (confirmation) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/attend-conference', {
          email: localStorage.getItem('email'),
          conference_id: invite.conference_id
        }, {
          headers: {
            Authorization: token
          }
        });

        alert(response.data.message);
        fetchInvites();  // Refresh invites after attending
      } catch (error) {
        console.error('Error attending conference:', error);
      }
    }
  };

  return (
    <div className={`${styles.defaultBackground} min-h-screen`}>
      {localStorage.getItem('token') && !selectedConference &&
        <div className={`${styles.marginX} ${styles.marginY}`}>
          <h1 className={styles.heading}>Welcome, {firstName} {lastName}</h1>
          <h2 className={`${styles.heading} mt-10 border-t-[1px] border-stone-500`}>Conferences:</h2>
          <ul className={`${styles.body}`}>
            {conferences.map(conference => (
              <li key={conference.conference_id}>
                <div className={`${styles.boxBackground} hover:cursor-pointer hover:scale-110 transition delay-150 text-center shadow-2xl hover:outline my-4 mx-12`}
                  onClick={() => handleConferenceBoxClick(conference)}>
                  <h3 className='font-bold mr-20 ml-20'>{conference.title}</h3>
                  <p className='mr-20 ml-20'>{conference.description}</p>
                  <p>{conference.start_time} - {conference.end_time}</p>
                </div>
              </li>
            ))}
          </ul>

          <h2 className={`${styles.heading} mt-10`}>Invites:</h2>
          <ul className={styles.body}>
            {invites.map(invite => (
              <li key={invite.conference_id}>
                <div className={`${styles.boxBackground} text-center shadow-2xl hover:outline my-4 mx-12`}
                  >
                  <h3 className='font-bold'>{invite.title}</h3>
                  <p>{invite.description}</p>
                  <p>{invite.start_time} - {invite.end_time}</p>
                  <div className="flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="#32ad26" className="w-12 h-12 mr-20 hover:stroke-green-800 hover:cursor-pointer"
                                onClick={()=>handleAcceptInvite(invite)}
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
      {selectedConference && <ConferenceDetails conference={selectedConference} onBackClick={handleBackClick} />}
    </div>
  )
}

export default Dashboard