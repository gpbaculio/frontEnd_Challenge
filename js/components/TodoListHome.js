import 'babel-polyfill'
import React, { Component } 
  from 'react';
import { createFragmentContainer, graphql, createPaginationContainer } 
  from 'react-relay';
import { ConnectionHandler } 
  from 'relay-runtime';

import 'antd/dist/antd.css';
import Pagination from 'antd/lib/Pagination';
import { Tab, Button } from 'semantic-ui-react'

import Todo            from './Todo';


class TodoListHome extends Component {

  state = {
    getPublicTodosLength:0,
    currentPage:1,
    currentPageArgForFfterCursor:''
  }

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
      return;
    } 
    this.props.relay.loadMore(2)
  }

  onChange = (page) => {
     this.setState({ currentPage: page }, async () => await this._refetchConnection(page));
  }

  _refetchConnection = async (page) => { // query for cursor page
    let pageCursor;
    if (page === 1) {
      pageCursor = null;
    } else {
      const getAfterCursorQueryText = `
        query TodoListHomeQuery {# filename+Query
          viewer {
            publicTodos {
              edges {
                cursor
                node {
                  id
                }
              }               
              pageInfo { # for pagination
                hasPreviousPage
                startCursor 
                hasNextPage
                endCursor 
              }
            }
          }
        }`;
      const cursorForPage = page*10-2; // 10 is pageSize
      const getAfterCursorQuery = { text: getAfterCursorQueryText }
      const  result = await this.props.relay.environment._network.fetch(getAfterCursorQuery, {}) // on the second argument is for variables
      pageCursor = result.data.viewer.publicTodos.edges[cursorForPage].cursor;
    }

    this.props.relay.refetchConnection(null,(e) => null, {
      count:5,
      cursor: pageCursor
    });
    
  }
  getPublicTodosLengthForPagination = async () => { // get publicTodos length since we cannot get it declared on createPaginationContainer
        const getPublicTodosLengthQueryText = `
          query TodoListHomeQuery {# filename+Query
            viewer {
              publicTodos {
                edges {
                  cursor #we don't query for nodes since it'll load longer
                }               
                pageInfo { # for pagination
                  hasPreviousPage
                  startCursor 
                  hasNextPage
                  endCursor 
                }
              }
            }
          }`
    const getPublicTodosLengthQuery = { text: getPublicTodosLengthQueryText }
    const  result = await this.props.relay.environment._network.fetch(getPublicTodosLengthQuery, {}) // 2nd arguments is for variables in ur fragment, in this case: e.g. getPublicTodosLengthQueryText but we dont need it 
    return await result.data.viewer.publicTodos.edges.length; 
  }

  componentDidMount = async () => {
    let result =  await this.getPublicTodosLengthForPagination();
    this.setState((prevState, props) => {
      return { 
        getPublicTodosLength: result 
      }
    });
  }

  render() {
    let { getPublicTodosLength } = this.state;
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
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.publicTodos;
    },
    getFragmentVariables(prevVars, totalCount) { // variables for the fragment. prevVars = is a default object of variables/arguments: e.g. $count, $cursor || totalCount/total rendered nodes
      // this defines the variables passed to the first query.
      return {
        ...prevVars,
         count: totalCount
      };
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      // this defines the variables passed to the refetched 'second query'.
      return {
        count,
        cursor,
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
