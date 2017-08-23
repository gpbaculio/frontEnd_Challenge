import React, { Component } 
  from 'react'
import { Switch, Route }
  from 'react-router-dom';

import TodoListHomePage from './TodoListHomePage'; // displays public and friends todos ordered by latest added todos
import TodoListProfilePage from './TodoListProfilePage';
import HeaderRenderer           from './HeaderRenderer';
import SignUpAndLogin            from './SignUpAndLogin';

class App extends Component {
  render() {
    return (
      <div className='center w85'>
        <HeaderRenderer /> {/* do not put <HeaderRenderer /> on Route */}

        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/(home)?' component={TodoListHomePage} />
            <Route  path='/profile/:userId' component={TodoListProfilePage} /> 
            <Route  path='/login' component={SignUpAndLogin} /> 
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
