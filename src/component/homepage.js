import React,{Component} from 'react'
import Navbars from './navbar'

export default class Home extends Component{

    constructor(props){
        super(props)
        this.state ={}
    }

    signIn = ()=>{

        //  e.preventDefault();
        this.props.history.push('/signin');
      }
  
      signUp = (e) =>{
  
          e.preventDefault();
          this.props.history.push("/signup")
      }

    render(){

        return(
            <>
            <Navbars signin={this.signIn} signup={this.signUp} />
            <div className='back'>
                
            </div>
            </>
        )
    }
}