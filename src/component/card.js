
import React from 'react'
import {FaEnvelope} from "react-icons/fa"
import {useHistory} from 'react-router'

const Card = ({property,dm, index}) =>{

    const history = useHistory();
    
    const {img, city, states, dob, username} = property

    const tempRef = (base64Stringuri) => `${base64Stringuri}`

    const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime())/ 3.15576e+10)

    const viewProfile = (username)=>{
        history.push(`/profile/${username}`)
      }

    return(
        <div id={`card-${index}`} className='card' onClick={viewProfile.bind(this, username)}>
            <img src={tempRef(img)} alt={username}  />
            <div className='details'>
               <p className='location'>
                {username}, {getAge(dob)} <br/>
                {city}, {states}
               </p>
               <p className='location'>
               <button className="butty" onClick={dm}><FaEnvelope/> <span>Message</span></button>
               </p>
            </div>
        </div>
    )
}
export default Card;