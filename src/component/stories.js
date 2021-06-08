import React from 'react'
import MainNav from './mainNav'
import baseUrl from './constant'

export default class Story extends React.Component{

    state = {
        allstories: [],
        unread: 0,
        note: 'none',
        user: {}
    }

    componentDidMount(){
        this.verify();
        this.unRead();
    }

    verify = ()=>{
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
              this.setState({  user: data  })
          }
         
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

    render(){

        let {user, unread, note} = this.state
        let read = unread > 0 && unread
        return(
            <>
            <MainNav fix={user.img} unread={read} note={note} />
            <div className='story'>
              <h2>Share your sex story and fantansy, don't worry we will keep you anonymous !!!</h2>
            </div>
            </>
        )
    }
}