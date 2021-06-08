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
export default class Profile extends React.Component{

    
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


    render(){

        let { user, loading, note, unread, showss, tipp, post, myshow, imagee} = this.state

        let tempRef = (base64Stringuri) => `${base64Stringuri}`;
       
        let read = unread > 0 && unread

        dayjs.extend(relativeTime)

        let image = user.img === null ? <img src={pic} alt='' />  : <img src={tempRef(user.img)} alt='' />

        let poll = loading ? <div style={{width: 300, height: 200, background: "#444"}}> </div>: 

        (<div class="profile-img">
            
        {image }
         <div>
            <span className='chaan'>Change Photo </span> 
            <input type="file" id="imageInput" onChange={this.handleImageChange} />
         </div>
        </div>)
     
        let loader = 
        <SkeletonTheme color="#202020" highlightColor="#444">
        <span>
          <Skeleton width={150} />
         </span>
        </SkeletonTheme>

        let joined = <h6 > <BiCalendar/> Joined : <span>{dayjs(user.joined).format('MMM YYYY') } </span></h6>

        return(
            <>
            <MainNav fix={user.img} unread={read} note={note} imgg={imagee}  click={this.clickMe} upload={this.handleImageChange}  />
            <br/><br/>
            <p style={{color: 'rgb(124, 116, 116)', marginLeft: 50, fontSize: 22, marginTop: -20}}>{result} </p>
           <div className="emp-profile">
                
                <form method="post">
                    <div className='again'>
                       <div >
                    <div >
                       {poll}
                    </div>
                    
                   
                    </div>
                    
                   
                </div><br/><br/>
                <div id="base">
                <div class="profile-head">
                                    <h5>
                                        {user.username || loader }
                                    </h5>
                                    <h6>
                                        {user.email || loader}
                                    </h6>
                                    {joined }
                                    <div className="but">
                                      <input type="submit" className="profile-edit-btn" onClick={this.profile}
                                       name="btnAddMore" value="Edit Profile"/>
                                   </div>
                                    <br/>
                          
                        </div><br/>
                    <h2 className='min'>Basic Information</h2>
                </div>
              <div className="contain">
                  
                    <div className="item-1 item">
                            <h2>Info</h2>
                            <p href="" >Username: <span className="info">{user.username || loader} </span> </p><br/>
                            <p href="">Email: <span className="info">{user.email || loader}</span>  </p><br/>
                            <p href="">Gender: <span className="info">{user.gender || loader}</span>  </p><br/>
                            <p href="">State: <span className="info">{user.states || loader} </span></p><br/>
                            <p href="">City: <span className="info">{user.city || loader}</span> </p><br/>
                            <p href="">Orientation: <span className="info">{user.orientation || loader}</span> </p><br/>
                            <p href="">Relationship Status: <span className="info">{user.relationshipstatus || loader}</span> </p><br/>
                            <p href="">Looking For: <span className="info">{user.lookingfor || loader}</span> </p>
                           
                    </div>
                   
                    <div>
                    <div className="item-2 item">
                            <h2 className="hh">Interest</h2>
                            {user.interest && user.interest.length === 0 ? <p className="info">Empty </p> : (
                                user.interest && user.interest.map(e =>{
                                    
                                    return(
                                        <h3 className="info" key={e} value={e}>{e} </h3>
                                    )
                                })
                            ) || loader }
                    </div>
                    <br/>
                    <div className="ha">
                    <h2 className="hh">Hobbies</h2>
                            {user.interest && user.interest.length === 0 ? <p className="info" >Empty</p> : (
                                user.interest && user.interest.map(e =>{
                                    
                                    return(
                                        <p className="info" key={e} value={e}>{e} </p>
                                    )
                                })
                            )  || loader}
                     </div>       
                    </div>
            
                    <div>
                    <div className="item-2 item">
                        { user.about === null ? <p></p> : (
                            <div>
                                <h2 className="hh">About</h2>
                                <p className='info'>{user.about || loader} </p>
                            </div>
                        ) }  
                    </div>
                    </div>
                 
              </div>
            </form>           
            </div>

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
            
            </>
        )
    }
}