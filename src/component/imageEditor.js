import React from 'react'
import MainNav from './mainNav.js'
import baseUrl from './constant'
import pic from '../img/sunshine.jpg'
import relativeTime from 'dayjs/plugin/relativeTime'
import {BsFillTrashFill} from "react-icons/bs"
import dayjs from 'dayjs'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import { BiCalendar } from "react-icons/bi"
import Confirm from './confirm'
import axios from 'axios'
import Footer from './footer.js'
 
let id;
let res;
let result;
export default class ImageEditor extends React.Component {

 
  state = {
    username: '',
    user: {},
    loading: true,
    unread: 0,
    note: 'none',
    imagee: 'image',
    post: [],
    showss: false,
    tipp: 'Are you sure you want to delete this image ?',
    myshow: 'none'
}

componentDidMount(){

   
    this.myInterval = setInterval(() => {
        this.verifyMe();
        this.unRead();
    }, 1500);   
}

handleImageChange = (e)=>{

    e.preventDefault();
    const username = localStorage.getItem('username')
    var image = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(image);
     reader.onload = function () {
    
    let data = {
        media : reader.result
    }
    
    let options = {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
            }
    }
    return fetch(`${baseUrl}post/upload/` + username , options)
    .then(response =>{
        res = response.status
        return response.json()
    })
    .then((data)=>{

       if(res > 300){
         result ='Something went wrong, try again'
        setTimeout(() => {
          result = ''
        }, 3000);
       }
       else{
         result = 'Successfully uploaded'
         setTimeout(()=>{
          result = ''
         }, 3000)
       }
       })
       .catch(err => console.log(err))
     
    }
    
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }

}

 clickMe = ()=>{
  const hello = document.getElementById(this.state.imagee)
  hello.click();
}

verifyMe = ()=>{
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    let data = {
        username: username,
        password: password
    }
    
    let res;
    let options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
            }
    }

    return fetch(`${baseUrl}login/verify`, options)
    .then(response =>{
        res = response.status
        return response.json()
    })
    .then(data =>{
      if(res > 300){
          this.props.history.push('/signin')
      }
      else{
          this.setState({
              user: data,
              loading: false,
              post: data.post
          })
      }
      
     
  })
  .catch(err => console.log(err))
}

profile = ()=>{
    this.props.history.push('/edit-profile')
}

handleShoww = (idd)=>{
    id = idd
    this.setState({showss: true})
    
}

handledelete = ()=>{
   
    axios.delete(`${baseUrl}post/deletepost/${id}`)
    .then(()=>{
        this.setState({
            post: this.state.post.filter(p => p.id !== id),
            showss: false
        })
    })
    .catch(err => console.log(err))
}

handleClose = ()=>{
  this.setState({showss: false})
 
}

handleImageChange = (e)=>{

    e.preventDefault();
    let id = this.state.user.id
    var image = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(image);
     reader.onload = function () {
    let res;
    let data = {
        img : reader.result
    }
    
    let options = {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
            }
    }
    return fetch(`${baseUrl}user/updateimg/` + id , options)
    .then(response =>{
        res = response.status
        return response.json()
    })
    .then(data=>{
       this.setState({user: data})
       
    })
    .catch(err=>console.log(err))
     
    };
    
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };



}
changepic = ()=>{
  const hello = document.getElementById('image')
  hello.click();
}

unRead = ()=>{

    const username = localStorage.getItem('username')
    return fetch(`${baseUrl}send/getnotify/${username}`, {method: 'get'})
    .then(res =>{
      return res.json();
    })
    .then(data =>{
      if(data.length < 1){
        this.setState({note: 'none'})
      }
      else{
        this.setState({note: 'block', unread: data.length})
      }
    })
    .catch(err => console.log(err))
  }

 render() {

  let { user, loading, note, unread, showss, tipp, post, myshow, imagee} = this.state

        let tempRef = (base64Stringuri) => `${base64Stringuri}`;
       
        let read = unread > 0 && unread

        dayjs.extend(relativeTime)

        let image = user.img === null ? < img src={pic} alt='' className='photo' /> :  <img src={tempRef(user.img)} alt='' className='photo' />

        let poll = loading ? <div style={{width: 200, height: 200, background: "#444", borderRadius: 100, marginTop: -190}}> </div>: 

        (<div>
            
        {image }
         <div>
            {/* <span className='chaan'>Change Photo </span>  */}
            {/* <input type="file" id="imageInput" onChange={this.handleImageChange} /> */}
         </div>
        </div>)
     
        let loader = 
        <SkeletonTheme color="#202020" highlightColor="#444">
        <span>
          <Skeleton width={150} />
         </span>
        </SkeletonTheme>

        let joined = loading ? loader : <h6 > <BiCalendar/> Joined : <span>{dayjs(user.joined).format('MMM YYYY') } </span></h6>
  return (
    <div>
      <MainNav fix={user.img} unread={read} note={note} imgg={imagee}  click={this.clickMe} upload={this.handleImageChange}  /><br/><br/>
      <div className="contain">
  <header>
    <i className="fa fa-bars" aria-hidden="true"></i>
  </header>
  
    <div className="row">
      <div className="left col-lg-4">
      <div className="photo-left">
         {poll}
           <input type="file" id="imageInput" hidden='hidden' onChange={this.handleImageChange} />
           <button className='ch'  onClick={this.changepic}>
             Change Photo
           </button>
          <div >
             <button className="editbtn" id='image
             ' onClick={this.profile}
            >
              Edit Profile
              </button>
            </div>
      </div>
        <h4 className="name">{user.username || loader }</h4>
        <p className="name">{user.email || loader}</p>
        <p className="name">{  joined  }</p>
        <div className="stats row">
          
          <div className="stat col-xs-4">
            <p className="desc-stat">About</p>
          </div>
         
        </div>
        <p className='abtt'>{user.about || loader} </p>
       
      </div>
      <div className="right col-lg-8">
        <ul className="nav">
          <li>
            Basic Information<br/><br/>
            <p  >Username: <span >{user.username || loader} </span> </p><br/>
              <p >Email: <span >{user.email || loader}</span>  </p><br/>
               <p >Gender: <span >{user.gender || loader}</span>  </p><br/>
               <p >State: <span >{user.states || loader} </span></p><br/>
               <p >City: <span >{user.city || loader}</span> </p><br/>
               <p >Orientation: <span >{user.orientation || loader}</span> </p><br/>
               <p >Relationship Status: <span >{user.relationshipstatus || loader}</span> </p><br/>
               <p >Looking For: <span >{user.lookingfor || loader}</span> </p>
          </li>
          <li>
            Interest<br/><br/>
            {user.interest && user.interest.length === 0 ? <p >Empty </p> : (
                                user.interest && user.interest.map(e =>{
                                    
                                    return(
                                        <p key={e} value={e}>{e} </p>
                                    )
                                })
               ) || loader
             }
          </li>
          <li> 
            Hobbies <br/><br/>
            {user.hobbies && user.hobbies.length === 0 ? <p  >Empty</p> : (
                                user.hobbies && user.hobbies.map(e =>{
                                    
                                    return(
                                        <p  key={e} value={e}>{e} </p>
                                    )
                                })
               )  || loader
               
            }
          </li>
         
        </ul>
      </div>
 
</div>
<div className='ruller'/>

<section className='services'>
               <h1 >Gallery </h1>
               <br/><br/>
                <div className='services-center'>
                    {post.length < 1 ? <p style={{fontSize: 20, textAlign: 'center'}}>No media yet</p> :
                     post.map((post)=>{
                        return <article key={post.id} >
                           <img src={tempRef(post.media)} />
                           <div className="ican">
                            <h3 style={{color: 'white', fontSize: 16, fontWeight: 'normal'}}>{dayjs(post.pdate).fromNow()}</h3>
                            <button className="butty" onClick={this.handleShoww.bind(this, post.id)} ><BsFillTrashFill/> <span>Trash</span></button>
                           </div> 
                        </article>
                    })}
                </div>
                <Confirm  showss={showss} handleClose={this.handleClose} msg={tipp} del={myshow}
               handleShow={this.handleShoww} handleDelete={this.handledelete}
              />
              <Footer/>
            </section>
     </div>
     </div>
  )
}
}

