 import React, { Component } from "react";
import Navbars from './navbar'
import Nigeria from './address'
import MultiSelect from "react-multi-select-component";
import Interest from './interestJson'
import Hobbies from './hobbies'
import baseUrl from './constant'
import Button from 'react-bootstrap-button-loader';

let myname = [];
let mycity =[];
let years =[];
let dat = [];

export default class SignUp extends Component {

  state ={
    states : [],
    cities : [],
    selectedState: '',
    myList: [],
    city: 'City/Town',
    username: '',
    password: '',
    cpassword: '',
    gender: '',
    lookingfor: '',
    relationshipstatus: '',
    orientation: '',
    year: '',
    month: '',
    day: '',
    email: '',
    error: '',
    respond: 0,
    userid: '',
    emal: '', 
    res: 0,
    resp: 0,
    status: '',
    interest: [],
    hobbies: [], 
    loading: false
  }

  componentDidMount(){

    Nigeria.map(list =>{
      this.setState({myList: list})
     let {name, cities} = list
      myname.push(name)
     cities.map((item)=>{
      mycity.push("City/Town", item)
    })
    })
    
    this.setState({
      states: myname,
      cities: mycity,
      myList: Nigeria
    }) 

    var i;
    for(i = 2002; i>=1945; i--){
      years.push(i)
    }
    var k;
    for(k=1; k<=31; k++){
      dat.push(k)
    }
   // console.log(new Date())
  }

  checkUsername = ()=>{

    return fetch(`${baseUrl}user/find/${this.state.username}`, {method: 'get'})
    .then(res => {
        this.setState({respond: res.status})
        return res.json();
    })
    .then(()=>{
      if(this.state.respond > 300){
        this.setState({userid: ''})
      }
      else{
        this.setState({userid: 'username already in use'})
      }
    })
    .catch(err => console.log(err))
  }

  checkEmail = ()=>{
    return fetch(`${baseUrl}user/findd/${this.state.email}`, {method: 'get'})
    .then(respond => {
        this.setState({res: respond.status})
        
        return respond.json();
    })
    .then(()=>{
      if(this.state.res > 300){
        this.setState({emal: ''})
      }
      else{
        this.setState({userid: 'username already in use'})
      }
    })
    .catch(err => console.log(err))
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    this.setState({loading: true})

    let { selectedState, username, password, cpassword, gender, year, month, day,
      email,lookingfor, orientation, city, relationshipstatus, interest, hobbies} = this.state

      if(selectedState.trim() === '' || username.trim() === '' || password.trim() === '' 
      || email.trim() === '' || lookingfor.trim() === '' || city.trim() === 'City/Town' ||
      relationshipstatus.trim() === '' || gender.trim() === '' || year.trim()=== ''
       || month.trim() === '' || day.trim() === '' || orientation.trim() === ''){

        this.setState(
          {
            error: 'Make sure you fill all the fields',
            loading: false
        })
        return
       }

       if(password.trim() !== cpassword.trim()){
         this.setState(
           {
             error: 'password and confirm password must match',
             loading: false
          })
         return
       }

      let dob = year+"/"+month+"/"+day
      let intt = []
      let hob = []

      interest.map(e =>{
        let {value} = e
        intt.push(value)
      })

      hobbies.map(e =>{
        let {value} = e
        hob.push(value)
      })

      let data = {
        username: username,
        email: email,
        gender: gender,
        lookingfor: lookingfor,
        orientation: orientation,
        password: password,
        city: city,
        states: selectedState,
        relationshipstatus: relationshipstatus,
        bob: dob,
        interest: intt,
        hobbies: hob
      }
      let options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
            }
    }
    return fetch(`${baseUrl}user/newuser`, options)
    .then(res =>{
      this.setState({resp: res.status})
      return res.json();
    })
    .then(data =>{
      if(this.state.resp > 300){
        this.setState(
          {
          status: 'something went wrong, please try again',
          loading: false
        })
      }
      else{
        
        localStorage.setItem('username', this.state.username);
        localStorage.setItem('password', this.state.password)
        localStorage.setItem('id', data.id)
        localStorage.setItem('gender', this.state.gender )
        this.props.history.push('/about')
      }
    })
    .catch(err => console.log(err))
  }

  mainChange = (e)=>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleChange = (e) =>{
     
    this.setState({selectedState: e.target.value})
   
   this.setState({cities: this.state.myList.find(city=> city.name === e.target.value).cities })

}

changeInterest = (interest)=>{
  this.setState({ interest });
}

changeHobbies = (hobbies)=>{
  this.setState({ hobbies });
 
}

    render() {

      const {cities, selectedState, username, password, cpassword, gender, year, month, day, userid, emal,
        email,lookingfor, orientation, city, relationshipstatus,interest, hobbies, error} = this.state; 

      let cal = years && years.map((e,i)=>
        (
        <option key={i} value={e}>{e} </option>
        )
      )

      let dayy = dat && dat.map((e,i)=>(
        <option key={i} value={e}>{e} </option>
      ))

       const myState =  myname.map((item,index)=>{

        return(
          <option key={index} value={item}>
            {item}
          </option>
        )
      })

        return (
            <>
            <Navbars/>
            <div class="main-w3layouts wrapper"><br/><br/>
                  <h1> SignUp Form</h1>
                  <div class="main-agileinfo">
                    <div class="agileits-top">
              <form  >
              <span style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>{userid} </span>
                <input class="text" type="text" name="username" placeholder="Username" onBlur={this.checkUsername}
                 value={username} onChange={this.mainChange} />
                
                <span style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>{emal} </span>
                <input class="text" type="text" name="email" placeholder="email" onBlur={this.checkEmail}
                value={email} onChange={this.mainChange} />
                
                <br/>
                <select onChange={this.handleChange} name="selectedState" value={selectedState}
                 style={{backgroundColor: 'black', color: 'white'}}>
                  <option value=''>State</option>
                    {myState}
                </select> 
                <br/><br/>
                <select value={city} name="city" style={{backgroundColor: 'black', color: 'white'}} onChange={this.mainChange} >
                   {cities.map((e, i)=>(
                
                   <option key={i} value={e}>{e} </option>
                   ))}
               </select>

               <br/><br/>
               <select style={{backgroundColor: 'black', color: 'white'}} name="gender" value={gender} onChange={this.mainChange} >
                 <option value="">Gender</option>
                 <option value="male">Male</option>
                 <option value="female">Female</option>
               </select>
               <br/><br/>
               <select style={{backgroundColor: 'black', color: 'white'}} name="orientation" value={orientation} onChange={this.mainChange}>
                    <option value="">Orientation</option>
                    <option value="straight">Straight </option>
                    <option value="bisexual">Bisexual </option>
                    <option value="lesbian">Lesbian</option>
               </select>
                    <br/><br/>
                <select style={{backgroundColor: 'black', color: 'white'}} name="relationshipstatus" value={relationshipstatus} onChange={this.mainChange} >
                  <option value="">Relationship status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widow">Widow</option>
                  <option value="widowed">Widowed</option>
                  <option value="divorced">Divorced</option>
                  <option value="Separated">Separated</option>
                  <option value="complicated">Complicated</option>
                </select>
                <br/><br/>
                <select style={{backgroundColor: 'black', color: 'white'}} name="lookingfor" value={lookingfor} onChange={this.mainChange}>
                  <option value="">Looking For</option>
                  <option value="relationship">Relationship</option>
                  <option value="friendship">Friendship</option>
                  <option value='love'>Love</option>
                  <option value="fling">Fling</option>
                  <option value="sexmate">Sex mate</option>
                  <option value="companionship">Companionship</option>
                  <option value="soulmate">Soulmate</option>
                </select><br/><br/>
                <p style={{textAlign: 'initial'}}>Date of birth</p>
                <p style={{textAlign: 'initial'}}>
                <select style={{backgroundColor: 'black', color: 'white'}} name="year" value={year} onChange={this.mainChange}>
                    <option value="">Year</option>
                    {cal}
                </select>

                <select style={{backgroundColor: 'black', color: 'white', marginLeft: 5}} name="month" value={month} onChange={this.mainChange}>
                    <option value="">Month</option>
                    <option value="01">Jan</option>
                    <option value="02">Feb</option>
                    <option value="03">Mar</option>
                    <option value="04">Apr</option>
                    <option value="05">May</option>
                    <option value="06">Jun</option>
                    <option value="07">Jul</option>
                    <option value="08">Aug</option>
                    <option value="09">Sept</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                </select>

                <select style={{backgroundColor: 'black', color: 'white', marginLeft: 5}} name="day" value={day} onChange={this.mainChange}>
                    <option value="">Day</option>
                    {dayy}
                </select>
                </p>
                  <br/>
                <div style={{width: 220, color: 'white'}}>
                  <p style={{textAlign: 'initial'}}>Interest</p>
                <MultiSelect
                    options={Interest}
                    value={interest}
                    onChange={this.changeInterest}
                    labelledBy="Interest"
                    className='multi-select'
                />
               
                </div>
                  <br/>
                <div style={{width: 220, color: 'white'}}>
                  <p style={{textAlign: 'initial'}}>Hobbies</p>
                <MultiSelect
                    options={Hobbies}
                    value={hobbies}
                    onChange={this.changeHobbies}
                    labelledBy="Hobbies"
                    className='multi-select'
                />
               
                </div>
                
                 <input class="text" type="password" name="password" placeholder="Password" value={password} onChange={this.mainChange} />
                 <input class="text" type="password" name="cpassword" placeholder="Confirm Password" value={cpassword} onChange={this.mainChange} /><br/><br/>
                 <div class="wthree-text">
                <label class="anim">
                    {/* <input type="checkbox" class="checkbox" required/> */}
                    <span>By Signining Up, You Agree To The <span style={{color: 'orange'}}>Terms & Conditions</span></span>
                 </label>
                <div class="clear"> </div>
            </div>
            <p></p><br/>
            <p >
            <Button loading={this.state.loading} bsStyle='warning' onClick={this.handleSubmit} >Sign Up</Button><br/>
            </p>
           <p style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>{this.state.status} </p>
           <p style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>{error} </p><br/>
           <p >Already registered?<a href="/signin" style={{color: 'orange'}}> Login</a></p>
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
        );
    }
}