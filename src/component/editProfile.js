import React from 'react'
import MainNav from './mainNav'
import baseUrl from './constant'
import {InputGroup, FormControl, Col, Row} from 'react-bootstrap'

// var letters = /^[A-Za-z]+$/;  !(surname.match(letters))

export default class EditProfile extends React.Component{
    
    state = {
        user: {}
    }

    componentDidMount(){
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
                  user: data
              })
          }
          
         
      })
      .catch(err => console.log(err))
    }

    render(){

        let {user} = this.state

        return(
           <>
           <MainNav name={user.username} />
           <div className='editt'>
            <div className='item-edit'>
                <button className='prof'>
                    Edit Profile
                </button><br/><br/>
                <div>
                    <p>Email: <input className='ed' value={user.email} onChange={(e)=>{
                        user.email = e.target.value
                        this.setState({user})
                    }} /> </p><br/>
                    <p>State: &nbsp;<input className='ed' value={user.states} onChange={(e)=>{
                        user.states = e.target.value
                        this.setState({user})
                    }} /> </p><br/>
                    <p>City:  &nbsp;&nbsp;&nbsp;<input className='ed' value={user.city} onChange={(e)=>{
                        user.city = e.target.value
                        this.setState({user})
                    }} /> </p>  <br/>
                    <p>Gender: 
                         <select className='gender' 
                         value={user.gender}  onChange={(e) =>{
                             user.gender = e.target.value
                             this.setState({user})
                         }}>
                      <option value="male">Male</option>
                       <option value="female">Female</option>
                     </select>
                     </p><br/>   
                     <p>Orientation: 
                     <select className='orente' value={user.orientation} onChange={(e) =>{
                         user.orientation = e.target.value
                         this.setState({user})
                     }}>
                    <option value="straight">Straight </option>
                    <option value="bisexual">Bisexual </option>
                    <option value="lesbian">Lesbian</option>
                     </select>
                     </p><br/>
                     <p>Relationship status:
                     <select className='relation' value={user.relationshipstatus} onChange={(e) =>{
                         user.relationshipstatus = e.target.value
                         this.setState({user})
                     }} >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="widow">Widow</option>
                      <option value="widowed">Widowed</option>
                      <option value="divorced">Divorced</option>
                      <option value="Separated">Separated</option>
                     <option value="complicated">Complicated</option>
                   </select> 
                    </p> <br/>
                    <p>Looking For:
                    <select className='look' value={user.lookingfor} onChange={(e) =>{
                        user.lookingfor = e.target.value
                        this.setState({user})
                    }}>
                  <option value="friendship">Friendship</option>
                  <option value="fling">Fling</option>
                  <option value="sexmate">Sex mate</option>
                  <option value="companionship">Companionship</option>
                  <option value="soulmate">Soulmate</option>
                </select>
                    </p> <br/>
                    <p>About:
                    <InputGroup>
                     <FormControl className='abt' rows="6" bg="black" value={user.about} onChange={(e)=>{
                         user.about = e.target.value
                         this.setState({user})
                     }}
                       as="textarea"  />
                     </InputGroup>
                    </p> <br/>
                    <Row className="parent">
                     <Col>
                        <button className="butt" onClick={this.skip}>
                            Cancel
                        </button>
                     </Col>
                     <Col>
                      <button className="butt" onClick={this.about}>
                          Update
                      </button>
                     </Col>
                 </Row>         
                </div>
            </div>
           </div>
           </>
        )
    }
}