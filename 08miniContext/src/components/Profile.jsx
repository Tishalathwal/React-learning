import React, { useContext } from 'react'
import UserContext from '../context/UserContext'

function Profile() {
    const { user } = useContext(UserContext)  // ← Pull user from context

    if (!user) return <div>please login</div>

    return <div>Welcome {user.username}</div>
}

export default Profile