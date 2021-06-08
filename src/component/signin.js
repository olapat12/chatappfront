import React, {Component} from 'react'
import Navbars from './navbar'
import Button from 'react-bootstrap-button-loader';
import baseUrl from './constant'


export default class Signin extends Component{

    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            error: '', 
            loading: false
        }
    }

    onSet = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }

    login = (e)=>{
        e.preventDefault();
        this.setState({loading: true})
        let {username, password} = this.state;
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
              this.setState({
                  error: 'Invalid credentials',
                  loading: false
                })
              this.props.history.push('/signin')
          }
          else{
              this.setState({
                  error: ''
         })
           localStorage.setItem('username', this.state.username)
           localStorage.setItem('password', this.state.password)
           localStorage.setItem('gender', data.gender )
           this.props.history.push('/chatapp')
          }
           
        })
        .catch(err => console.log(err))
    }

    render(){

        const {username, password, error} = this.state

        return(
            <>
                <Navbars /><br/><br/><br/>
                <div class="main-w3layouts wrapper">
                    <br/><br/>
                  <h1> Login </h1>
                  <div class="main-agileinfo">
                    <div class="agileits-top">
              <form >
              <p style={{color: 'red', fontWeight: 'bold'}}>{error} </p>
                <input class="text" type="text" name="username"
                 value={username} onChange={this.onSet} placeholder="Username" />
                
                 <input class="text" type="password" name="password"
                 value={password} onChange={this.onSet}  placeholder="Password" /><br/>

            <p>
            <Button loading={this.state.loading} bsStyle='warning' onClick={this.login} >Sign In</Button><br/>
            </p><br/>
        
           <p>Don't have an account?<a href="/signup"> Register here!</a></p>
            </form>
           </div>
    
          </div>
          <ul class="colorlib-bubbles">
          <li></li>
          <li></li>
           <li></li>
           <li></li>
          <li></li>
         <li></li>
         <li></li>
          <li></li>
          <li></li>
           <li></li>
        </ul>
       </div>
    
            </>
        )
    }
}