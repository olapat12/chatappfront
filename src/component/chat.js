import React, {Component} from 'react'
import SockJS from 'sockjs-client'
import MainNav from './mainNav'
import axios from 'axios'
import relativeTime from 'dayjs/plugin/relativeTime'
import Stomp from 'stompjs'
import baseUrl from './constant'
import dayjs from 'dayjs'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import Loading from './Loading'
import Tooltip from '@material-ui/core/Tooltip'
import Confirm from './confirm'
import Footer from './footer'
import {  FaUsers } from "react-icons/fa"
import EmojiPicker from './emojiPicker'



let url = 'http://localhost:10/chat'
let protocols = ['v10.stomp', 'v11.stomp']
let stomp;
let body = {}
let msg = []
let id = 0, result;
let pics;
let corn = '', res;
export default class Chat extends Component{

    constructor(){
        super()

        this.state = {
          sender: false,
          clientConnected: false,
          into: [],
          userid: '',
          username: '',
          text: '',
          users: [],
          messages: [],
          income: '',
          inbox: [],
          lol: '',
          user: {},
          senderimg: '',
          loading: true,
          search: '',
          show: 'none',
          searchimg: '',
          name: '',
          active: 'none',
          convo: '',
          convoimg: '',
          basket: 'none',
          showss: false,
          unread: 0, note: 'none',
          tipp: 'Are you sure you want to delete this conversation ?',
          image: 'image',
          displayy: 'none'
        }
    }

    onEmoji = ()=>{
      if(this.state.displayy === 'none'){
        this.setState({displayy: 'block'})
      }
      else{
        this.setState({displayy: 'none'})
      }
    }

   async componentDidMount(){
      
    const name = localStorage.getItem('name')
    this.setState({username: name})
      this.security();
      
      this.myInterval = setInterval(() => {
        this.unRead();
        this.getInbox();
      }, 1000);
      
      
     
     this.incoming(name)

      let id = localStorage.getItem('username')
      this.setState({
       userid: id
     })

       try{
  
      const response= await fetch(`${baseUrl}send/inbox/${id}/${name}`);
      const bodies= await response.json();
      this.setState({messages :bodies});
       }catch (error) {
       
      }
     
      let sockect = new SockJS(url);
      stomp = Stomp.over(sockect, protocols)
      stomp.connect({}, ()=>{

        stomp.subscribe('/topic/direct/' + this.state.userid , function(message){
          body = JSON.parse(message.body)
          let send = body.username
          
          let inbox = {
            text: body.message,
            sender: body.username,
            date: body.date
          }
         if(send.trim() !== this.state.username){
           this.getInbox()
           this.unRead()
         }
         else{
          this.setState({
            messages: [...this.state.messages, inbox]
          })
          this.updateRead()
          this.getInbox()
          this.updateSeen()
         }
         }.bind(this)
        ) 
      })
    }

    componentWillUnmount(){
      this.setState({username: '', messages: []})
    }

    searching = (e)=>{
      this.setState({search: e.target.value})
    }

     incoming =  (name)=>{
      if(name === null){
      return
      }
      else{
        this.selectedUser(name)
        localStorage.removeItem('name')
      }
   
    }

    convoImg = ()=>{

      return fetch(`${baseUrl}user/find/${this.state.username}`, {method: 'get'})
      .then(res => res.json())
      .then(data =>{
        this.setState({convoimg: data.img})
      })
      .catch(err => console.log(err))
    }

    searchUser = ()=>{

      let ress;
      
      return fetch(`${baseUrl}user/find/` + this.state.search, {method: 'get'})  
      .then(res => {
        ress = res.status
        return res.json()
      })
      .then(data =>{
        
        if(ress <= 300){
          this.setState({show: 'block', searchimg: data.img, name: data.username})
          corn = data.img
        }
        else{
          this.setState({show: 'none'})
        }
      })
      .catch(err => console.log(err))
    }

    onSelect = (userName)=>{

      let {search, userid} = this.state

      if(search.trim() === userid.trim()){
        this.props.history.push(`/profile`)
      }

      this.setState({
        username: userName,
        convoimg: corn,
        show: 'none',
        search: '',
        active: 'block',
        convo: '',
        basket: 'block'
        })
       
  
        axios.get(`${baseUrl}send/inbox/${this.state.userid}/${userName}`)
        .then(res =>{
          msg.push(res.data)
          this.setState({
            messages: res.data
          })
    })
    .catch(err => console.log(err))
  }

    changeText = (e)=>{
      this.setState({
        text: e.target.value
      })
    }

    //function to conversation list
    getInbox = ()=>{
      const username = localStorage.getItem('username')
      axios.get(`${baseUrl}send/inbox/${username}`)
      .then(res =>{
        this.setState({into : res.data, loading: false})
      })
      .catch(err => console.log(err))
    }

    sendInbox = ()=>{

      let data = {
        id: id,
        body: this.state.text,
        sender: this.state.userid,
        receiver: this.state.username
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
    return fetch(`${baseUrl}send/update`, options)
    .then(res =>{
      return res.json()
    })
    .then(data =>{
      id = data.id
    })
    .catch(err => console.log(err))
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
                user: data, loading: true
            })
           
        }
       
    })
    .catch(err => console.log(err))
    }

    viewProfile = ()=>{
      this.props.history.push(`/profile/${this.state.username}`)
    }

    outbox = ()=>{
      let data={
        text: this.state.text,
        recipient: this.state.username
      }

      let options = {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
          }
      }

      return fetch(`${baseUrl}send/sent/` + this.state.userid, options)
      .then(res =>{
        return res.json();
      })
      .catch(err => console.log(err))
    }


    //function to update inbox convo
    updateRead = ()=>{

      let data={
        id: id
      }

      let options = {
        method: "Put",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
          }
      }
      return fetch(`${baseUrl}/send/updateread`, options)
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
    }


    sendMessage=(messag)=>{

      let {userid, text, username} = this.state
      messag ={
        username: userid,
        message: text,
        date: new Date()
      }
      let ok = {
        text: text,
        recipient: username,
        date: new Date().toISOString(),
        sender: userid
      }
      if(text.trim() === ''){
        return
      }
      this.sendMsg(messag)
      this.outbox();
      this.sendInbox();
      this.notify();
      this.setState({text: ''})
      let options = {method: 'get'}
      return fetch(`${baseUrl}send/inbox/${this.state.userid}/${this.state.username}`, options)
      .then(res => {
        return res.json();
      })
      .then(()=>{
        this.setState({
          messages: [...this.state.messages, ok]
        })
      })
      .catch(err => console.log(err))
    }

    sendText = (e)=>{

      let {userid, text, username} = this.state
      let messag = {}
      if(e.key === 'Enter'){
        messag ={
          username: userid,
          message: text,
          date: new Date()
        }
        let ok = {
          text: text,
          recipient: username,
          date: new Date().toISOString(),
          sender: userid
        }
        if(text.trim() === ''){
          return
        }
        this.sendMsg(messag)
        this.outbox();
        this.sendInbox();
        this.notify();
        this.setState({text: ''})
        let options = {method: 'get'}
        return fetch(`${baseUrl}send/inbox/${this.state.userid}/${this.state.username}`, options)
        .then(res => {
          return res.json();
        })
        .then(()=>{
          this.setState({
            messages: [...this.state.messages, ok]
          })
        })
        .catch(err => console.log(err))
      }

    }

    sendMsg = (message) => {
     stomp.send("/app/chat/" + this.state.username , {}, JSON.stringify(message))
    }

    checkMe = ()=>{

      return fetch(`${baseUrl}user/find/${this.state.username}`, {method: 'get'})
      .then(res =>{
        return res.json()
      })
      .then(data =>{
        this.setState({senderimg: data.img})
      })
      .catch(err => console.log(err))
    }

    clearConvo = ()=>{

      let data={
        id: id
      }

      let options = {
        method: "put",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
          }
      }

      return fetch(`${baseUrl}send/clear/${this.state.userid}`, options)
      .then(res => res.json())
      .then(() =>{
        this.setState({
          into: this.state.into.filter(inbox => inbox.id !== id ),
          showss: false,
          active: 'none',
          messages: [],
          username: '',
          convoimg: '',
          basket: 'none'
        })
      })
      .catch(err => console.log(err))
    }

    selectedUser = (userName, ids)=>{
      id = ids
      this.setState({
        username: userName,
        active: 'block',
        convo: '',
        basket: 'block'
      })
     
      axios.get(`${baseUrl}send/inbox/${this.state.userid}/${userName}`)
      .then(res =>{
        msg.push(res.data)
        this.setState({
          messages: res.data
        })
        this.checkMe();
        this.convoImg();
        this.updateRead();
        this.updateSeen();
        this.getInbox();
        this.unRead();
      })
      .catch(err => console.log(err))
    }
    

handleShoww = ()=>{
    this.setState({showss: true})
    
}

handleClose = (id)=>{
  this.setState({showss: false})
 
}

updateSeen = ()=>{
  let {username, userid} = this.state
 
  return fetch(`${baseUrl}send/notify/${username}/${userid}`, {method: 'delete'})
  .then(res =>{
    return res.json();
  })
  .catch(err => console.log(err))
}

notify = ()=>{

  let data={
    sender: this.state.userid,
    receiver: this.state.username
  }

  let options = {
    method: "put",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*'
      }
  }

  return fetch(`${baseUrl}send/updatenotify`, options)
  .then(res =>{
    return res.json();
  })
  .catch(err => console.log(err))

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
                
        let {text, username, messages, userid, into,income, user, searchimg, name,basket,showss,unread,note,
          convo, active, senderimg, search , show,convoimg, tipp, image, loading, displayy} = this.state;

          convoimg = convoimg === '' ? <p></p> : <img src={convoimg} alt='' />

        let tempRef = (base64Stringuri) => `${base64Stringuri}`;

        let read = unread > 0 && unread

        dayjs.extend(relativeTime)

        into && into.sort((a,b)=>{
          var dateA = new Date(a.stime)
          var dateB = new Date(b.stime)

          return dateB - dateA
          
        })

        let loader = 
        <SkeletonTheme color="#202020" highlightColor="#444">
        <span>
          <Skeleton width={150} />
         </span>
        </SkeletonTheme>

       let inbox = into && into.length < 1 ? <p></p> : into && into.map(inbox => {

        let{sender, receiver, simg, rimg, body, stime, rread, id, sendercolor, receivercolor} = inbox


        function damola(){
          if(sender === user.username){
            
            return receiver;
          }
          return sender;
        }

        function jide(){

          if(sender !== user.username && rread !== true){

            return(
              <p style={{fontSize:14, color: receivercolor , margin:'auto', marginTop: 5, 
              whiteSpace: 'nowrap',overflow:'hidden', textOverflow: 'ellipsis'}}>{body} </p>
            )
          }
          return <p style={{fontSize:14, color: sendercolor, margin:'auto', marginTop: 5,
           whiteSpace: 'nowrap',overflow:'hidden', textOverflow: 'ellipsis'}}>{body} </p>
        }
        
         pics = sender === user.username ? (<img src={tempRef(rimg)} alt=''
         style={{borderRadius: '50%', height: 50, width: 50, objectFit: 'cover'}}  />) :

        (<img src={tempRef(simg)}alt='' style={{borderRadius: '50%', height: 50, width: 50, objectFit: 'cover'}} />)
        

        return(
          <div key={id} onClick={this.selectedUser.bind(this, damola(), id)} >
          	<div id="contacts">
		    	<ul>
		  		<li class="contact">
					<div class="wrap">
            
						{pics}
						<div class="meta">
							<p class="namee">{damola()} </p>
							<p>{jide()}</p>
              <p className="stime">{dayjs(stime).fromNow()}</p>
						</div>
					</div>
		  		</li>
				
		    	</ul>
		    </div>
       </div>
        )
       })

       let chats = messages && messages.length < 1 ? 
       <p style={{color: 'white', textAlign: 'center', marginTop: '30%', fontSize: 25 }}>Start a conversation</p> :
        messages && messages.map((msg, i)=>{
         let {text, sender, date} = msg
        return(
          
          sender === userid ? (
           
            <ul key={i}
            key={i}>
              <li class="replies" >
                
                <p>
                   {text}
                   <br/>
                   <span>{dayjs(date).fromNow()}</span>
                </p>
                
              </li>
            </ul>
        
          ) : (
             
                <ul key={i}
                key={i}>
                <li class="sent" >
                <img src={tempRef(senderimg)} alt="" />
                <p>
                   {text}
                   <br/>
                   <span>{dayjs(date).fromNow()}</span>
                </p>
               
              </li>
                </ul>
              
          )
          
          )
       })

        return(
            <>
                <MainNav  fix={user.img} unread={read} note={note} imgg={image}  click={this.clickMe} upload={this.handleImageChange}  />
                <br/>
                {loading ? <Loading/> : (
                  <div>
                     <br/><br/><br/><br/><br/><br/>
                     
                     {/* <p>{chosenEmoji && <span> {chosenEmoji.emoji} </span>} </p><br/> */}
                   
                <p style={{color: 'rgb(124, 116, 116)', marginLeft: 50, fontSize: 22, marginTop: -20}}>{result} </p>
                <h1 style={{color: 'orange'}}>Direct Message</h1>   
                
        <div id="frame">
	       <div id="sidepanel">
	      	<div id="profile">
		      	<div class="wrap">
		      		<img id="profile-img" src={tempRef(user.img)} class="online" alt="" />
              <p>{userid} </p>
				
		       	</div>
	      	</div>

	     	 <input type="text" class='text' placeholder="Search contacts..."
       name="search" value={search} onChange={this.searching} onKeyUp={this.searchUser} />

    <div id="profile">
		      	<div style={{display: show}}>
              <button onClick={this.onSelect.bind(this, name)} className="butty" >
		      		<img style={{width: 35, height: 35, borderRadius: '50%'}} src={tempRef(searchimg)} class="online" alt="" />
              <p style={{position: 'absolute', marginTop: -30, marginLeft: 45}}>{name} </p>
              </button>
		       	</div>
	      	</div>
       
		<br/>
      	{inbox}
  	</div>
    
	<div class="content">
  
		<div class="contact-profile">
      
    <Tooltip title="view profile" placement="top">
    <button onClick={this.viewProfile} className='butty'  >
			{convoimg}
        {username} 
     </button>
     </Tooltip>
     <Confirm del={basket} showss={showss} handleClose={this.handleClose} msg={tipp}
         handleShow={this.handleShoww.bind(id)} handleDelete={this.clearConvo}
       />
		</div>
    <div class="messages">
      
		{chats}
    {income}
    <p style={{color: 'white', textAlign: 'center', marginTop: '30%', fontSize: 25 }}>{convo} </p>
    </div>
    <div style={{display: active, background: 'black', height: 40}}>
		<div class="message-input">
			<div class="wrap">
      <input type="text" placeholder="Write your message..." 
        value={text}
        name='text'
        onChange={this.changeText}
        onKeyPress={this.sendText}
      />
		
      
			<button class="submit" onClick={this.sendMessage.bind(this, userid, text)}>Send </button>
     
			</div>
     
		</div>
    </div>
	</div>
</div>
<Footer/>
                  </div>
                )}
               
            </>
        )
    }
}
