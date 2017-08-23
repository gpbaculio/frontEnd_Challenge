import React, { Component } 
  from 'react';
import { createFragmentContainer, graphql, createPaginationContainer } 
  from 'react-relay';
import { ConnectionHandler } 
  from 'relay-runtime';

import { Tab, Button } from 'semantic-ui-react'

import Todo            from './Todo';


class TodoListHome extends Component {

  // _getPageCount() {
  //   const totalBookCount = this.props.viewer.publicTodos.edges.length;
  //   const bookPageSize = this.props.relay.variables.bookPageSize;

  //   let pageCount = totalBookCount / bookPageSize >> 0;

  //   if (totalBookCount % bookPageSize !== 0) {
  //       pageCount++;
  //   }

  //   return pageCount;
  // }

  _renderTodos() {
    if(this.props.viewer.publicTodos.edges.length === 0) {
      return <p style={{ fontSize: '28px', position: 'absolute', top: '35%', left: '38%', }}> no ones' got something to do </p>
    }
      return (this.props.viewer.publicTodos.edges.map((edge) => {
              return (
                <Todo // below are props we pass on Todo component
                  key={edge.node.id}
                  todo={edge.node}
                  viewer={this.props.viewer}
                />
              );
             }));
  }

  _loadMore() {
    if(!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      console.log("invoked in")
      return;
    } 
    console.log("invoked out")
    this.props.relay.loadMore(1)
  }
  render() {
    return (<div style={{marginLeft: 'auto', marginRight: 'auto', width: '100%', height: '100%',textAlign: 'center'}}>
              <div><ul style={{listStyle: 'none',marginLeft: 'auto', marginRight: 'auto', textAlign: 'left',width:'32%'}}>      
                {this._renderTodos()}
              </ul></div>
              <Button primary onClick={()=>this._loadMore()}> Load More </Button>
            </div>)
  }
}

export default createPaginationContainer(
  TodoListHome, 
    graphql`# not sure, but i believe the queries below is to make sure that the data is available before THIS component renders?
    fragment TodoListHome_viewer on User { # User is a name of a GraphQL type on ../data/schema.js
      publicTodos( first: $count after: $cursor ) @connection(key: "TodoListHome_publicTodos") { #this is a relay connection, made it so that if no user is logged in, there's todos to display. first is set to that number for querying max/all todos 
        edges {
          cursor
          node {
            ...Todo_todo # the data dependency of Todo component
            id
            text 
            complete 
            privacy
            fullName
          }
        }
        pageInfo { # for pagination
          hasPreviousPage
          startCursor 
          hasNextPage
          endCursor 
        }
      }
      id
      ...Todo_viewer
    }`,
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.publicTodos;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count,
        cursor
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        // orderBy: fragmentVariables.orderBy,
      };
    },
    query: graphql`
      query TodoListHomePaginationQuery(
        $count: Int! $cursor:String
      ) {
        viewer { #on mongoose query specify how many u need to return, maybe start with 10?
          # You could reference the fragment defined previously.
          ...TodoListHome_viewer
        }
      }
    `
  })
