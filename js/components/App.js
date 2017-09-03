import React, { Component } 
  from 'react'
import { Switch, Route }
  from 'react-router-dom';

import TodoListHomeRefetchPage from './TodoListHomeRefetchPage'; // TodoListHomeRefetchPage is window pagination
import TodoListProfilePage     from './TodoListProfilePage';
import HeaderRenderer          from './HeaderRenderer'; // header nav
import SignUpAndLogin          from './SignUpAndLogin';

class App extends Component {
  render() {
    return (
      <div className='center w85'>
        <HeaderRenderer />
        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/(home)?'    component={TodoListHomeRefetchPage} />
            <Route  path='/profile/:userId' component={TodoListProfilePage} /> 
            <Route  path='/login'           component={SignUpAndLogin} /> 
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
