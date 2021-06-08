import React, {Component} from 'react'
import Navbars from './navbar'
import baseUrl from './constant'
import {InputGroup, FormControl, Col, Row} from 'react-bootstrap'
import Button from 'react-bootstrap-button-loader';

let id;
export default class Extras extends Component{

    constructor(props){
        super(props)
        this.state = {
            error: '',
            about: '',
            loading: false
        }
    }

    componentDidMount(){

         id = localStorage.getItem('id');
         
    }

    onSet = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }

    skip = ()=>{
        this.props.history.push('/chatapp')
    }

    about = (e)=>{
        e.preventDefault();
        this.setState({loading: true})
       let {about} = this.state;
        let data = {
           about: about
        }

        let res;
        let options = {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
                }
        }
        return fetch(`${baseUrl}user/updateabout/` + id , options)
        .then(response =>{
            res = response.status
            return response.json()
        })
        .then(data =>{
          if(res > 300){
              this.setState({error: 'Something went wrong', loading: false})
             // this.props.history.push('/signin')
          }
          else{
              this.setState({
                  error: ''
         })
           this.props.history.push('/chatapp')
          }
           
        })
        .catch(err => console.log(err))
    }

    render(){

        const { error} = this.state

        return(
            <>
                <Navbars />
                <div class="main-w3layouts wrapper">
                    <br/><br/><br/>
                  <h1> Almost Done!!! </h1>
                  <div class="main-agileinfo">
                    <div class="agileits-top">
              <form >
              <p style={{color: 'red', fontWeight: 'bold'}}>{error} </p>
              <InputGroup>
                <FormControl className='about' name='about' rows="7" bg="black" onChange={this.onSet}
                 as="textarea" placeholder='Tell us about yourself' />
             </InputGroup>
                
                 <Row className="parent">
                     <Col>
                     <p >
                   <Button loading={this.state.loading} bsStyle='warning' style={{width: 80}} onClick={this.skip} >Skip</Button><br/>
                    </p>
                     </Col>
                     <Col>
                     <p >
                      <Button loading={this.state.loading} bsStyle='warning' onClick={this.about} >Submit</Button><br/>
                     </p>
                     </Col>
                 </Row>
        
           
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