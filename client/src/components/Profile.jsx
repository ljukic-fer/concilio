import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../style';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/profile', {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setProfileData(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          console.log('Error response data:', error.response.data);
          //history.push('/login');
        });
    } else {
      //history.push('/login');
    }
  }, [history]);

  return (
    <div>
      {!localStorage.getItem('token') ? (
      <div>
        <h1 className={styles.heading2}>You are unauthorized</h1>
      </div>) : (
      profileData ? (
        <div className={`min-h-screen flex-col ${styles.marginX} ${styles.marginY}`}>
          <h1 className={`${styles.heading} mb-10`}>Personal information</h1>
          <p className={styles.body}>First name: {profileData.firstName}</p>
          <p className={styles.body}>Last name: {profileData.lastName}</p>
          <p className={styles.body}>E-mail: {profileData.email}</p>
          <p className={styles.body}>Date of birth: {new Date(profileData.dob).toLocaleDateString()}</p>
        </div>
      ) : (
        <div className={`bg-primary flex-1 text-center ${styles.paddingX} ${styles.flexStart}`}>Loading...</div>
      )
    )}
    </div>
  );
};

export default Profile;
