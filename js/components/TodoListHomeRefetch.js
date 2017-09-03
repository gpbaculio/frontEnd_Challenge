import 'babel-polyfill'
import React, { Component } 
  from 'react';
import { createRefetchContainer, graphql } 
  from 'react-relay';
import { ConnectionHandler } 
  from 'relay-runtime';
import 'antd/dist/antd.css';
import Pagination      from 'antd/lib/Pagination';
import { Tab, Button } from 'semantic-ui-react'
import Todo            from './Todo';


class TodoListHome extends Component {

  state = {
    getPublicTodosLength:0,
    currentPage:1,
  }

  _renderTodos() {

  if(this.props.viewer.publicTodos.edges.length === 0) {
    return <p style={{ fontSize: '28px', position: 'absolute', top: '35%', left: '38%', }}> no ones' got something to do </p>
  }

  return (this.props.viewer.publicTodos.edges.map((edge) => {
          return (<Todo // below are props we pass on Todo component
                    key={edge.node.id}
                    todo={edge.node}
                    viewer={this.props.viewer}
                  />);
                }));
  }

  onChange = async (page) => {
    await this._refetchConnection(page);
  }

 _refetchConnection = async (page) => { // query for cursor page
    let pageCursor;
    if (page === 1) {
      pageCursor = null;
    } else {
      const getAfterCursorQueryText = `
        query TodoListHomeRefetchQuery {# filename+Query
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
      const cursorForPage = page*5-6; // 5 is pageSize
      const getAfterCursorQuery = { text: getAfterCursorQueryText };
      const  result = await this.props.relay.environment._network.fetch(getAfterCursorQuery, {}); // on the second argument is for variables
      pageCursor = result.data.viewer.publicTodos.edges[cursorForPage].cursor;
    }
    const refetchVariables = fragmentVariables => {
      return {
        cursor: pageCursor,
        count:5 // 5 is pageSize
      }
    };
    await this.props.relay.refetch(refetchVariables, null);

    setTimeout(() => this.setState({ currentPage: page }), 1000);
  }


  getPublicTodosLengthForPagination = async () => { // get publicTodos length since we cannot get it declared on createPaginationContainer
        const getPublicTodosLengthQueryText = `
          query TodoListHomeQuery { # filename+Query
            viewer {
            fullName
            _id
              publicTodos {
                edges {
                  cursor #we don't query for nodes since it'll load longer
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
    return (<div style={{marginLeft: 'auto', marginTop:'10px', marginRight: 'auto', width: '100%', height: '100%',textAlign: 'center'}}>
      <span style={{ fontSize: '20px', marginTop:'6px'}}> Windowed Pagination </span>
              <ul style={{listStyle: 'none',marginLeft: 'auto', marginRight: 'auto', textAlign: 'left',width:'25%'}}>      
                {this._renderTodos()}
              </ul>
              <Pagination style={{marginTop:'15px'}} current={this.state.currentPage} pageSize={5} total={getPublicTodosLength} onChange={this.onChange} />
            </div>)
  }

}

export default  createRefetchContainer(
  TodoListHome,
  {
    viewer: graphql.experimental`
      fragment  TodoListHomeRefetch_viewer on User 
      @argumentDefinitions(
        count: {type: "Int", defaultValue: 5},
        cursor: {type: "String"}
      ) {
        publicTodos(first: $count, after: $cursor) {
          edges {
            node {
              id
               ...Todo_todo
            }
          }
        }

      id
      _id
      fullName
      ...Todo_viewer
      }
    `
  },
  graphql.experimental`
    query TodoListHomeRefetchQuery($count: Int!, $cursor:String) {
      viewer {
        ...TodoListHomeRefetch_viewer @arguments(count: $count, cursor: $cursor)
      }
    }
  `,
);