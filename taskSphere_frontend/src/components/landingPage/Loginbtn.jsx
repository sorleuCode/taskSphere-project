import React from 'react'
import { Link } from 'react-router-dom'

const Loginbtn = () => {
  return (
    
    <Link to="/login"><button className="bg-white text-blue-700 py-1 px-3 rounded transition transform duration-300 hover:bg-yellow-500 hover:text-white hover:scale-110">Log in</button></Link>

  )
}

export default Loginbtn
