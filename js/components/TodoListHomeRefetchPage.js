import React, { Component } 
  from 'react';
import { QueryRenderer, graphql } 
  from 'react-relay';

import TodoListHomeRefetch from './TodoListHomeRefetch';
import environment         from '../RelayEnvironment';


const TodoListHomeRefetchPageQuery = graphql`
  query TodoListHomeRefetchPageQuery {
    viewer {
      ...TodoListHomeRefetch_viewer 
    }
  }
`;

class TodoListHomeRefetchPage extends Component {

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={TodoListHomeRefetchPageQuery}
         variables={{
          count: 5,
        }}
        render={({error, props}) => {
          if (error) {
            console.log(error)
            return <div>{error.message}</div> 
          } else if (props) {
            return <TodoListHomeRefetch viewer={props.viewer} />
          }
          return <div className="onLoading-icon">Loading... </div>
        }}
      />
    )
  }

}

export default TodoListHomeRefetchPage