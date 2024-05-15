import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserProvider'

export default function Profile() {
  const [profileData, setProfileData] = useState(null)
  const { user, setUser } = useUser()
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:6900/api/get_user/${params.id}`, {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.Username) {
        setProfileData(data)
      } else {
        console.error('Failed to fetch profile data:', data.message)
      }
    })
    .catch(error => console.error('Fetch error:', error))
  }, [params.id])

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:6900/logout', {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        setUser(null) 
        navigate('/')
      } else {
        console.error('Failed to log out')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div>
      {profileData ? (
        <div>
          <div className="question-user-section-container profile">
            <img src="../src/assets/user_avatar.png" alt="Avatar" />
            <h1><b>{profileData.Username}</b> | <span style={{fontWeight: 'normal'}}>{profileData.ReputationPoints} points</span></h1>
          </div>
          <p><b>Member Since: </b> {profileData.JoinDate}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  )
}
