import React, { useState, useEffect } from 'react'
import axios from 'axios';
import styles from './style'
import { Navbar, Hero, Business, Button, ChatDetails, Footer, Profile, Dashboard, Inbox, LoggedNav, AdminDashboard, CoordinatorDashboard, AuthForms, MainNav } from './components'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setToken } from './redux/actions/AuthActions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const App = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  //const token = useSelector((state) => state.auth.token)
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const history = useHistory();

  const storeEmail = useSelector((state) => state.auth.email)
  const storeToken = useSelector((state) => state.auth.token)

  useEffect(() => {
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
  }, [history, token]);

  useEffect(() => {
    clearExpiredToken();
  }, [])


  const clearExpiredToken = () => {
    dispatch(setToken(token));
    dispatch(setEmail(email));
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token payload
      const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = Date.now(); // Get current time in milliseconds
      if (currentTime > expirationTime) {
        localStorage.removeItem('token');
        dispatch(setToken(null));
      }
    }
  }

  return (
    <Router>
      <div className={`${styles.defaultBackground} w-full overflow-hidden`}>

        {!token && <MainNav />}
        {token && <LoggedNav className={styles.paragraph} />}

        <Switch>
          <Route exact path='/'>

            <div className={`${styles.flexStart}`}>
              <div className={`${styles.boxWidth}`}>
                <Hero />
              </div>
            </div>
            <div className={`${styles.paddingX} ${styles.flexStart}`}>
              <div className={`${styles.boxWidth}`}>
                <Business />
                <Footer />
              </div>
            </div>
          </Route>
          <Route path="/auth">
            <AuthForms />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/dashboard">
            {token && profileData && profileData.role === 3 && <Dashboard />}
            {token && profileData && profileData.role === 2 && <CoordinatorDashboard />}
            {token && profileData && profileData.role === 1 && <AdminDashboard />}
          </Route>
          <Route path="/inbox">
            <Inbox />
          </Route>
        </Switch>

      </div>
    </Router>
  )
}

export default App