import React, { Component } 
  from 'react'
import { QueryRenderer, graphql } 
  from 'react-relay';

import TodoListProfile from './TodoListProfile';
import environment  from '../RelayEnvironment';

const TodoListProfilePageQuery = graphql` 
  query TodoListProfilePageQuery(
       $count: Int!, $cursor: String
      )  {
    viewer { #viewer query on graphql, the component TodoListProfilePage will receive this.props.viewer if configured properly on schema.js
      ...TodoListProfile_viewer #fragment on TodoListProfile component, that's why we import it here.
    }
  }
`

class TodoListProfilePage extends Component {

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={TodoListProfilePageQuery}
         variables={{
          count: 4,
        }}
        render={({error, props}) => {
          if (error) {
            console.log(error)
            return <div>{error.message}</div> //CONFIGURE ANT.DESIGN STYLING TOMORROW CAN BE HWNE USER LOGS IN/OUT !!!!!!!!
          } else if (props) { // props is destructured from the default function argument above 
            console.log("props = ",props);
            return <TodoListProfile viewer={props.viewer} />
          }
          return <div className="onLoading-icon">Loading... </div>
        }}
      />
    )
  }

}

export default TodoListProfilePage