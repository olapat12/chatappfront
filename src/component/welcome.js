import React from 'react'
import MainNav from './mainNav.js'
import baseUrl from './constant'
import Loading from './Loading'
import Nigeria from './address'
import axios from 'axios';
import Pagination from 'react-js-pagination'
import {FaEnvelope} from "react-icons/fa"
import Footer from './footer'
import Card from './card'





let myusers = {
  properties: []
}
let myname = [], mycity = [], mystate = [],  ilu = 'all', town = 'all', looking = 'all', res; 
let result = ''

export default class Welcome extends React.Component{

    state = {
        properties: myusers.properties,
        property: {}, 
        user: {},
        count: 0,
        unread: 0,
        note: 'none',
        allusers: [],
        every: [],
        postPerPage: 8,
        currentPage: 1,
        myList: [],
        states: [],
        cities: [],
        city: 'all',
        selectedState: 'all',
        age: '',
        lookingfor: 'all',
        loading: true,
        newUsers: {},
        image: 'image',
        
    }

    componentDidMount(){

        
        this.verify();
        this.myInterval = setInterval(() => {
          this.unRead();
        }, 1500);
        this.allUsers();
        this.newUsers();
      

        Nigeria.map(list =>{
            this.setState({myList: list})
           let {name, cities} = list
            myname.push(name)
           cities.map((item)=>{
            mycity.push("all", item)
          })
          })
          
          this.setState({
            states: myname,
            cities: mycity,
            myList: Nigeria
          }) 
    
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
      .then(()=>{

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
  
     
    nextUser = ()=>{
      const nextPerson = this.state.count + 1
      this.setState({count: nextPerson})
      this.setState({property: this.state.properties[nextPerson] })
    }

    prevUser = ()=>{
      const nextPerson = this.state.count - 1
      this.setState({count: nextPerson})
      this.setState({property: this.state.properties[nextPerson] })
    }

    newUsers = ()=>{
     
        const gender = localStorage.getItem('gender')
        axios.get(`${baseUrl}user/newuser/${gender}`)
        .then(res =>{
           this.setState({properties: res.data})
           myusers.properties = res.data
           this.setState({newUsers: myusers, property: res.data[5], loading: false})
           
        })
        .catch(err => console.log(err))
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

      allUsers = ()=>{

        const gender = localStorage.getItem('gender')
       
        axios.get(`${baseUrl}user/allusers`)
        .then(res =>{
           this.setState({allusers: res.data})
           if(gender === 'male'){
               this.setState({allusers: res.data.filter(e => e.gender === 'female')})
           }
           else{
            this.setState({allusers: res.data.filter(e => e.gender === 'male')})
           }
           this.setState({every: this.state.allusers})
        
         })
        .catch(err => console.log(err))
      }

      paginate = (pageNumber) =>{
        this.setState({currentPage: pageNumber})
    }

    handleState = (e) =>{
        let newcity = ['------']
        this.setState({selectedState: e.target.value, city: 'all'})
        ilu = e.target.value
        ilu = ilu.toLowerCase()
        town = 'all'

       if(e.target.value === 'all' && looking === 'all'){
           this.setState({allusers: this.state.every, cities: newcity, city: 'all'})
         }
        else if(e.target.value === 'all' && looking !== 'all'){
            this.setState({allusers: this.state.every.filter(user => user.lookingfor === looking)})
        }
        else if(e.target.value !== 'all' && town !== 'all' && looking === 'all'){
            
            this.searchMore(ilu, town)
            let allcity = ['all', ...this.state.myList.find(city => city.name === e.target.value).cities]
             this.setState({cities: allcity})
        }
        else if(e.target.value !== 'all' && town !== 'all' && looking !== 'all'){
            this.lookingFor(town, looking)
            let allcity = ['all', ...this.state.myList.find(city => city.name === e.target.value).cities]
           this.setState({cities: allcity})
        }
        else if(e.target.value !== 'all' && looking !== 'all'){
            this.searchMe(e.target.value,looking)
            let allcity = ['all', ...this.state.myList.find(city => city.name === e.target.value).cities]
            this.setState({cities: allcity})
        }
       else{
        this.setState({allusers: this.state.every.filter(user => user.states === e.target.value)})
        let allcity = ['all', ...this.state.myList.find(city => city.name === e.target.value).cities]
        this.setState({cities: allcity})
        mystate = this.state.allusers
       
       }
    
    }

    handleCity = (e) => {
           
        this.setState({city: e.target.value})
        town = e.target.value
        town = town.toLowerCase()
       
        if(e.target.value === 'all' && looking === 'all'){
            this.searchState(ilu)
           // console.log(this.state.allusers)
        
        }
        else if(e.target.value !== 'all' && looking !== 'all'){
            this.lookingFor(e.target.value, looking)
        }
        else{
            this.searchMore(ilu, e.target.value)
        }

       }

       lookingFor = (city, look) =>{

        const gender = localStorage.getItem('gender')
        axios.get(`${baseUrl}user/search/${city}/${look}`)
        .then(res =>{
            if(gender === 'male'){
                this.setState({allusers: res.data.filter(e => e.gender === 'female')})
            }
            else{
             this.setState({allusers: res.data.filter(e => e.gender === 'male')})
            }
        })
        .catch(err => console.log(err))
       }

       searchMe = (state, look) =>{

        const gender = localStorage.getItem('gender')
        axios.get(`${baseUrl}user/searchme/${state}/${look}`)
        .then(res => {
          if(gender === 'male'){
            this.setState({allusers: res.data.filter(e => e.gender === 'female')})
        }
        else{
         this.setState({allusers: res.data.filter(e => e.gender === 'male')})
        }
        })
        .catch(err => console.log(err))
       }

       searchMore = (state, city) =>{

        const gender = localStorage.getItem('gender')
        axios.get(`${baseUrl}user/searchmore/${state}/${city}`)
        .then(res => {
            if(gender === 'male'){
                this.setState({allusers: res.data.filter(e => e.gender === 'female')})
            }
            else{
             this.setState({allusers: res.data.filter(e => e.gender === 'male')})
            }
        })
        .catch(err => console.log(err))
       }

       searchState = (state) =>{
        const gender = localStorage.getItem('gender')
        axios.get(`${baseUrl}user/searchh/${state}`)
        .then(res => {
         if(gender === 'male'){
            this.setState({allusers: res.data.filter(e => e.gender === 'female')})
        }
        else{
         this.setState({allusers: res.data.filter(e => e.gender === 'male')})
        }
        })
        .catch(err => console.log(err))
       }

    handleLookingFor = (e)=>{

        this.setState({lookingfor: e.target.value})
        looking = e.target.value

        if(ilu === 'all' && e.target.value === 'all'){
            this.setState({allusers: this.state.every})
        }
        else if(ilu !== 'all' && town === 'all' && e.target.value === 'all'){
            this.searchState(ilu)
        }
        else if(ilu !== 'all' && town === 'all' &&  e.target.value !== 'all'){
           this.searchMe(ilu,e.target.value)
        }
        else if(ilu !== 'all' && town !== 'all' && e.target.value === 'all' ){
            this.searchMore(ilu, town)
        }
        else if(ilu !== 'all' && town !== 'all' && e.target.value !== 'all'){
            this.lookingFor(town, e.target.value)
        }
        else if(ilu === 'all' && e.target.value !== 'all'){
            this.setState({allusers: this.state.every.filter(user => user.lookingfor === e.target.value)})
        }
    }

    viewProfile = (username)=>{
        this.props.history.push(`/profile/${username}`)
      }

      message = (username)=>{

        localStorage.setItem('name', username)
          this.props.history.push('/chat')
      }

    render(){

        let { user, unread, note, allusers, currentPage, postPerPage, cities,city, age, properties,
          selectedState, lookingfor, every, property, count, loading, image} = this.state

        let tempRef = (base64Stringuri) => `${base64Stringuri}`;

        let read = unread > 0 && unread
   

        const indexoflastPost = currentPage * postPerPage;
        const indexoffirstPost = indexoflastPost - postPerPage;
        allusers = allusers.slice(indexoffirstPost, indexoflastPost);

        const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime())/ 3.15576e+10)


        const myState =  myname.map((item,index)=>{

            return(
              <option key={index} value={item}>
                {item}
              </option>
            )
          })

        return(
            <>
            <MainNav fix={user.img}   unread={read} note={note} imgg={image}  click={this.clickMe} upload={this.handleImageChange} /><br/><br/><br/><br/><br/>
            {loading ? <Loading/> : (
              <div>
                
            <section >

              <div>
              
                <div className='page'>
                  <p style={{color: 'rgb(124, 116, 116)', marginLeft: 50, fontSize: 22, marginTop: -20}}>{result} </p>
                  <h1>New Users</h1><br/><br/>
                  <div className={`cards-slider active-slide`}>
                    <div className='cards-slider-wrapper'style={{transform: `translateX(-${this.state.count*(100/properties.length)}%)`}}>

                      {properties && properties.map((property, index) => <Card key={property.id} property={property} index={index} /> )}
                    </div>
                     
                  </div>
               
                </div>
               
              </div>

         <div className='fitt'>
           <div className='next'>
         <button className='nu'
                onClick={this.nextUser}
                disabled={count === properties.length-1}
                >
                  Next
                </button>
              

              <button className='nu'
                onClick={this.prevUser}
               disabled={count === 0}
                >
                  Back
                </button>
                </div>
            <div className='item-f'>
               <p className='filt'>Filter By: </p>
            </div>

            <div className='item-f'>
                <p>State &nbsp;&nbsp;&nbsp;
                <select value={selectedState} onChange={this.handleState}>
                    <option value='all'>all</option>
                    {myState}
                </select>
                </p>
            </div>

            <div className='item-f'>
                <p>City &nbsp;&nbsp;&nbsp;
                    <select value={city} onChange={this.handleCity}>
                     {selectedState === 'all' ? <option>-------</option> : cities.map((e, i)=>(
                
                <option key={i}>{e} </option>
                ))}
                    </select>
                </p>
            </div>

            <div className='item-f'>
                <p>Looking For &nbsp;&nbsp;&nbsp;
                <select value={lookingfor} onChange={this.handleLookingFor}>
                    <option value='all'> all </option>
                    <option value="relationship">Relationship</option>
                  <option value="friendship">Friendship</option>
                  <option value='love'>Love</option>
                  <option value="fling">Fling</option>
                  <option value="sexmate">Sex mate</option>
                  <option value="companionship">Companionship</option>
                  <option value="soulmate">Soulmate</option>
                </select>
            </p>
            </div>
            
            <div className='item-f'>
                <p>Age &nbsp;&nbsp;&nbsp;
                    <select value={age}>
                        <option value='all'> all </option>
                        <option value='1'>18-25</option>
                        <option value='2'>26-32</option>
                        <option value='3'>33-39</option>
                        <option value='4'>40-47</option>
                        <option value='5'>48-55</option>
                        <option value='6'>55-65</option>
                        <option value='7'>66-75</option>
                    </select>
                </p>
            </div>
         </div>
        </section>
            <section className='services'>
               <h1 >Browse Users </h1>
               <br/><br/>
                <div className='services-center'>
                    {allusers && allusers.map((user)=>{
                        return <article key={user.id} >
                           <button className="butty" onClick={this.viewProfile.bind(this, user.username)}><span><img src={tempRef(user.img)} /> </span></button>
                           <div className="ican">
                            <h3>{user.username},
                             <span style={{color: 'white', fontWeight: 'normal', fontSize: 14}}> {getAge(user.dob)  } </span> </h3>
                            <p>{user.city}, {user.states} </p>
                            <p style={{marginLeft: 6, fontSize: 14, color: 'rgb(212, 164, 74)'}}>Looking For:
                            <span style={{color: 'white'}}> {user.lookingfor} </span>  </p>
                            
                            <button className="butty" onClick={this.message.bind(this, user.username)}><FaEnvelope/> <span>Message</span></button>
                           </div> 
                        </article>
                    })}
                </div>
            </section>
            
            <Pagination
              itemClass="page-item"
              linkClass="page-link"
              activePage={currentPage}
              itemsCountPerPage={postPerPage}
              totalItemsCount={every.length}
              pageRangeDisplayed={3}
              onChange={this.paginate}
              prevPageText="Prev"
              firstPageText="First"
              lastPageText="Last"
              nextPageText="Next"
            />
            <Footer/>
              </div>
            )}
          
            </>
        )
    }
}