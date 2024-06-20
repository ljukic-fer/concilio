import React, { useEffect, useState } from 'react'
import styles from '../style';
import ManageUsers from './ManageUsers';
import ManageAccess from './ManageAccess';

const AdminDashboard = () => {
  const [usersScreen, setUsersScreen] = useState(false);
  const [rolesScreen, setRolesScreen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [usersScreen, rolesScreen])

  const handleUsers = () => {
    setUsersScreen(true);
  }

  const handleBackClick = () => {
    setUsersScreen(false);
    setRolesScreen(false);
  }

  const handleRoles = () => {
    setRolesScreen(true);
  }

  return (
    <div>{!usersScreen && !rolesScreen &&
      <div className={`${styles.marginX} ${styles.marginY}`}>
        <h1 className={`${styles.heading} ${styles.marginY} divide-y`}>Welcome administrator</h1>
        <hr class="h-[1px] my-8 border-t-[1px] border-stone-500"></hr>
        <p className={`${styles.body}`}>Use these buttons to access and manage the list of users and assign roles.</p>
        <div className={`${styles.defaultBackground} min-h-screen flex flex-row px-12`}>
          <div className={`${styles.paragraph} ${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex flex-col bg-black-gradient-2 ml-auto hover:cursor-pointer hover:scale-110 transition hover:shadow-2xl rounded-[20px] box-shadow h-full w-1/3`}
            onClick={handleUsers}
            style={{ boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.9)' }}>
            Manage users
          </div>
          <div className={`${styles.paragraph} ${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex flex-col bg-black-gradient-2 rounded-[20px] hover:cursor-pointer hover:scale-110 transition hover:shadow-2xl box-shadow h-full w-1/3 m-auto`}
            onClick={handleRoles}
            style={{ boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.9)' }}>
            Manage roles
          </div>
        </div>
      </div>
    }
      {usersScreen && <ManageUsers onBackClick={handleBackClick} />}
      {rolesScreen && <ManageAccess onBackClick={handleBackClick} />}
    </div>
  )
}

export default AdminDashboard