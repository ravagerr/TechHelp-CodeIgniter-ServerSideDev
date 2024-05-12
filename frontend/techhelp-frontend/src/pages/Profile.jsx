import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const [profileData, setProfileData] = useState(null)
  const auth = useAuth()

  useEffect(() => {
    if (!auth.user) {
      // User not logged in, handle accordingly
      return
    }

    fetch('http://localhost:6900/api/get_user_profile', {
      credentials: 'include' // Ensure cookies are sent
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setProfileData(data.profile)
      } else {
        console.error('Failed to fetch profile data:', data.message)
        // Optionally handle error, e.g., redirect to login
      }
    })
    .catch(error => console.error('Fetch error:', error))
  }, [auth.user]) // Dependency on the auth.user state

  if (!auth.user) {
    return <p>Please log in to view this page.</p>
  }
  console.log(auth)

  return (
    <div>
      <h1>Profile</h1>
      {profileData ? (
        <div>
          <p>Name: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  )
}
