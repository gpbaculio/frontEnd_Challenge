import React, { Component } 
  from 'react'
import { Switch, Route }
  from 'react-router-dom';

<<<<<<< HEAD
import TodoListHomeRefetchPage from './TodoListHomeRefetchPage'; // TodoListHomeRefetchPage is window pagination
import TodoListProfilePage     from './TodoListProfilePage';
import HeaderRenderer          from './HeaderRenderer'; // header nav
import SignUpAndLogin          from './SignUpAndLogin';
=======
import TodoListHomePage from './TodoListHomePage'; // displays public and friends todos ordered by latest added todos
import TodoListProfilePage from './TodoListProfilePage';
import HeaderRenderer           from './HeaderRenderer';
import SignUpAndLogin            from './SignUpAndLogin';
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098

class App extends Component {
  render() {
    return (
      <div className='center w85'>
<<<<<<< HEAD
        <HeaderRenderer />
        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/(home)?'    component={TodoListHomeRefetchPage} />
            <Route  path='/profile/:userId' component={TodoListProfilePage} /> 
            <Route  path='/login'           component={SignUpAndLogin} /> 
=======
        <HeaderRenderer /> {/* do not put <HeaderRenderer /> on Route */}

        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/(home)?' component={TodoListHomePage} />
            <Route  path='/profile/:userId' component={TodoListProfilePage} /> 
            <Route  path='/login' component={SignUpAndLogin} /> 
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
