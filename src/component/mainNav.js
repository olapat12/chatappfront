import React, {useState} from 'react'
import {useHistory} from 'react-router'
import {Navbar, Nav,NavDropdown, } from 'react-bootstrap'
import { BiHome, BiMessageDetail, BiUserCircle } from "react-icons/bi"
import { FaRegSun, FaSignOutAlt, FaUsers } from "react-icons/fa"
import Tooltip from '@material-ui/core/Tooltip'
import {faPlusSquare} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import logo from '../images/logo.svg'
import {FaAlignRight} from 'react-icons/fa'
import {Link} from 'react-router-dom'


var tooltip = <Tooltip/>
const MainNav = ({fix, unread, note, upload, click, imgg})=>{

  const history = useHistory();

  const [isOpen, setOpen] = useState(false);

  const handleToggle = ()=>{
     
    setOpen(!isOpen)
  }

  const logout = ()=>{ 
    localStorage.removeItem("username")
    localStorage.removeItem("password")
    localStorage.removeItem("id")
    history.push({pathname: '/signin'});
  }


  return(

  <div className='navbar'>
                <div className='nav-center'>
                    <div className='nav-header'>
                    
                        <Link to='/chatapp'>
                            <img src={logo} alt='Beach Resort' />
                        </Link>
                        <button className='nav-btn' onClick={handleToggle}>
                            <FaAlignRight className='nav-icon' />
                        </button>
                    </div>
                    <ul className={isOpen?"nav-links show-nav":"nav-links"}>
                        
                        <li>
                          <Tooltip placement='top' title='Profile'>
                            <Link to='/profile'><BiUserCircle/> </Link>
                            </Tooltip>
                        </li>
                        <li>
                          <Tooltip placement='top' title='inbox'>

                          <Link to='/chat'><div style={{position: "absolute", background: 'red',
                           width: 16, height: 16, border: 'solid 1px red', borderRadius: '50%', marginLeft: 11, marginTop: -4, textAlign: 'center', display: note
                           }}> <span className='unread'>{unread} </span></div> 
                            <BiMessageDetail/></Link>
                            </Tooltip>
                        </li>
                        <input
                         type='file'
                         hidden='hidden'
                         id={imgg}
                         onChange={upload}
                         />
                         <li>
                           <Tooltip placement="top" title="upload a media" >
                           <Link>
                         <FontAwesomeIcon icon={faPlusSquare} onClick={click}   />
                         </Link>
                         </Tooltip>
                         </li>

                         <li>
                           <Tooltip placement='top' title='fantansy'>
                           <Link to='/sexstories'>
                         <FaUsers/> 
                         </Link>
                         </Tooltip>
                         </li>
                        <li>
                          <Tooltip title='Logout'>
                          <Link>
                        <FaSignOutAlt onClick={logout} />
                        </Link>
                        </Tooltip>
                        </li>
                    </ul>
                </div>
            </div>
 
// </Navbar>
  )
}

export default MainNav;