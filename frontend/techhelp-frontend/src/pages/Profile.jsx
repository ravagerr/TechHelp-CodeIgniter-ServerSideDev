import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const [profileData, setProfileData] = useState(null)
  const params = useParams()

  useEffect(() => {

    fetch(`http://localhost:6900/api/get_user/${params.id}`, {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
      if (data.Username) {
        setProfileData(data)
      } else {
        console.error('Failed to fetch profile data:', data.message)
      }
    })
    .catch(error => console.error('Fetch error:', error))
  }, [])

  return (
    <div>
      <h1>Profile</h1>
      {profileData ? (
        <div>
          <p>Name: {profileData.Username}</p>
          <p>Join Date: {profileData.JoinDate}</p>
          <p>Reputation Points: {profileData.ReputationPoints}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  )
}
