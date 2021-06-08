import React from 'react'
import MainNav from './mainNav.js'
import baseUrl from './constant'
import dayjs from 'dayjs'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {FaEnvelope} from "react-icons/fa"
import Footer from './footer.js'

let userid;
let res;
let result;
export default class Dummy extends React.Component{

    
    state = {
        username: '',
        user: {},
        loading: true,
        error: false,
        unread: 0,
        note: 'none',
        post: [],
        image: 'image'
    }

    componentDidMount(){

        this.security();
        this.dummies();
        this.myInterval = setInterval(() => {
            this.unRead();
          }, 1000);
    
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

    dummies = ()=>{

        let ress;
        const dummyy = this.props.match.params.username
        userid = dummyy
        return fetch(`${baseUrl}user/find/${dummyy}`, {method: 'get'})
      .then(res =>{
        ress = res.status
        return res.json()
      })
      .then(data =>{
          if(ress > 300){
              this.setState({error: true})
          }
        this.setState({user: data, loading: false, post: data.post})
      
      })
      .catch(err => console.log(err))
      } 
      
      message = ()=>{

        localStorage.setItem('name', userid)
          this.props.history.push('/chat')
      }

    
    security = ()=>{

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
                  username: data.img, loading: false
              })
          }
          
         
      })
      .catch(err => console.log(err))
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
      const hello = document.getElementById(this.state.image)
      hello.click();
    }

    render(){

        let { user, loading, username, error, note, unread, post, image} = this.state

        let tempRef = (base64Stringuri) => `${base64Stringuri}`;

        let read = unread > 0 && unread

        let poll = loading ? <div style={{width: 300, height: 200, background: "#444"}}> </div>: 

        (<div class="profile-img">
        <img src={tempRef(user.img)} alt='' />
        
        </div>)
     
        let loader = 
        <SkeletonTheme color="#202020" highlightColor="#444">
        <span>
          <Skeleton width={150} />
         </span>
        </SkeletonTheme>

        let joined = <h6 >Joined : <span>{dayjs(user.joined).format('MMM YYYY') } </span></h6>

        console.log(user)

        return(
            <>
            <MainNav fix={username} unread={read} note={note} imgg={image}  click={this.clickMe} upload={this.handleImageChange}  />
            <br/><br/>
            <p style={{color: 'rgb(124, 116, 116)', marginLeft: 50, fontSize: 22, marginTop: -20}}>{result} </p>
           <div class="container emp-profile">
           {error ? <h2 style={{color: 'white'}}>User Not Found</h2> : 
            <form method="post">
            <div class="row">
                <div class="col-md-4">
                   {poll}
                </div>
                <div class="col-md-6">
                    <div class="profile-head">
                                <h5>
                                    {user.username || loader }
                                </h5>
                                <h6>
                                    {user.email || loader}
                                </h6>
                                {joined }
                                <br/>
                                <button className="butty" onClick={this.message}><FaEnvelope/> 
                                <span style={{color: 'rgb(232, 181, 88)'}}> Message</span>
                                </button>
                                <br/>
                      
                    </div>
                </div>
                
            </div>
            <div id="base">
                <h2>Basic Information</h2>
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
                        <h2>Interest</h2>
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
       
           } 
               
           
        </div>
        <section className='services'>
               <h1 >Gallery </h1>
               <br/><br/>
                <div className='services-center'>
                    { post.length < 1 ? <p style={{textAlign: 'center', fontSize: 20}}>This user currently does not have any media yet</p> :
                     post.map((post)=>{
                        return <article key={post.id} >
                           <img src={tempRef(post.media)} alt='picture' />
                           <div className="ican">
                            <h3 style={{color: 'white', fontSize: 16, fontWeight: 'normal'}}>{dayjs(post.pdate).fromNow()}</h3>
                           
                           </div> 
                        </article>
                    })}
                </div>
               
            </section>
            <Footer/>
            </>
        )
    }
}