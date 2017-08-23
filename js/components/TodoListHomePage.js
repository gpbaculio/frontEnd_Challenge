import React, { Component } 
  from 'react'
import { QueryRenderer, graphql } 
  from 'react-relay';

import TodoListHome from './TodoListHome';
import environment  from '../RelayEnvironment';


const TodoListHomePageQuery = graphql` #CONFIGURE GRAPHQL QUERY FOR THIS TOMORROW
  query TodoListHomePageQuery(  $count: Int! $cursor:String ) {
    viewer { #viewer query on graphql, the component TodoListHomePage will receive this.props.viewer if configured properly on schema.js
      ...TodoListHome_viewer #fragment on TodoListHome component, that's why we import it here.
    }
  }
`;

class TodoListProfilePage extends Component {

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={TodoListHomePageQuery}
         variables={{
          count: 1,
        }}
        render={({error, props}) => {
          if (error) {
            console.log(error)
            return <div>{error.message}</div> 
          } else if (props) { // props is destructured from the default function argument above 
            console.log("props = ",props);
            return <TodoListHome viewer={props.viewer} />
          }
          return <div className="onLoading-icon">Loading... </div>
        }}
      />
    )
  }

}

export default TodoListProfilePage