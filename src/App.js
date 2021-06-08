import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from './component/homepage'
import SignIn from './component/signin'
import SignUp from './component/signup'
import Chat from './component/chat'
import './signup.css'
import './profile.css'
import './index.css'
import Welcome from './component/welcome'
import Profile from './component/profile'
import Extras from './component/about'
import EditProfile from './component/editProfile'
import Dummy from './component/dummy'
import './editprofile.css'
import './chatt.css'
import Story from './component/stories'
import ImageEditor from './component/imageEditor'
import './bloom.css'
import './man.css'



class App extends React.Component{

  render(){

    return(
    
      <Router>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/signin' exact component={SignIn} />
          <Route path='/signup' exact component={SignUp} />
          <Route path='/chat' exact component={Chat}/>
          <Route path='/chatapp' exact component={Welcome}/>
          <Route path='/profile' exact component={ImageEditor}/>
          <Route path="/about" exact component={Extras}/>
          {/* <Route path='/image' exact component={ImageEditor}/> */}
          <Route path='/sexstories' exact component={Story}/>
          <Route path="/profile/:username" exact component={Dummy}/>
          <Route path='/edit-profile' exact component={EditProfile}/>
        </Switch>
       
      </Router>
      
    )
  }
}

export default App;
