import React, { Component } 
  from 'react'
import { QueryRenderer, graphql } 
  from 'react-relay';

import TodoListHome from './TodoListHomeRefetch';
import environment  from '../RelayEnvironment';


const TodoListHomeInfiniteScrollPageQuery = graphql` #CONFIGURE GRAPHQL QUERY FOR THIS TOMORROW
  query TodoListHomeInfiniteScrollPageQuery {
    viewer { 
      ...TodoListHome_viewer 
    }
  }
`;

class TodoListHomeInfiniteScrollPage extends Component {

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={TodoListHomeInfiniteScrollPageQuery}
         variables={{
          count: 10,
        }}
        render={({error, props}) => {
          if (error) {
            console.log(error)
            return <div>{error.message}</div> 
          } else if (props) { 
            console.log("props = ",props);
            return <TodoListHome viewer={props.viewer} />
          }
          return <div className="onLoading-icon">Loading... </div>
        }}
      />
    )
  }

}

export default TodoListHomeInfiniteScrollPage