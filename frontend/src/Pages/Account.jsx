import React, { useContext } from 'react'
import Login from './Login.jsx'
import { UserContext } from '../UserContext.jsx'
import Accountcenter from './AccountCenter.jsx'

export default function Account() {

  const {user} = useContext(UserContext)
  return (
    <div className=''>
      {user ? <Accountcenter /> : <Login />}
    </div>
  )
}
