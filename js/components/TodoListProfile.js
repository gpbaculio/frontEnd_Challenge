import React, { Component } 
  from 'react';
import { createFragmentContainer, graphql } 
  from 'react-relay';
import { ConnectionHandler } 
  from 'relay-runtime';
import Input from 'antd/lib/input';  // for js
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import { Tab, Card } from 'semantic-ui-react'
import Todo from './Todo';
import AddTodoMutation from '../mutations/AddTodoMutation';

class TodoListProfile extends Component {

  state = {
    text: '',
  }

  _renderTodos() {
    if(this.props.viewer.allTodosByUser.edges.length === 0) {
      return "Ain't got nothing to do yet?"
    }
    return this.props.viewer.allTodosByUser.edges.map((edge) => {// TodoListProfile is declared on the TodoListProfile(its' parent) and it has been passed viewer props there.
        return (
          <Todo // below are props we pass on Todo component
            key={edge.node.id}
            todo={edge.node}
            viewer={this.props.viewer}
          />
        )
      }
    )
  }

  _confirm = () => {
    const { text, privacy } = this.state;
    AddTodoMutation.commit(
      this.props.relay.environment,
      text,
      privacy,
      this.props.viewer,
    );
    this.setState({text: ''});
  }

  render() {
const menu = (
      <Menu onClick={({key}) => this.setState({ privacy: key })}>
        <Menu.Item key="public"  > Publiic </Menu.Item>
        <Menu.Item key="friends" > Friends </Menu.Item>
        <Menu.Item key="onlyMe"  > Only Me </Menu.Item>
      </Menu>
    );

    const showPrivacy = (privacy) => {
      if(privacy === 'public') {
        return 'Public';
      } else if(privacy === 'friends') {
        return 'Friends';
      } else if(privacy === 'onlyMe') {
        return 'Only Me';
      }
    }
    const panes = [
      { menuItem: 'Todos', render: () => {
        return (<Tab.Pane>
                <section className="createTodo-box">
                                     <div className="createTodo-inside">
                                       <div className="createTodo-title">
                                       Create Todo
                                       </div>
                                       <Input
                                         value={this.state.text}
                                         style={{ width: '200px' }}
                                         onChange={(e) => this.setState({ text: e.target.value })}
                                         type='text'
                                         placeholder='What needs to be done?'
                                       />
                                       <Button className="createTodo-button" onClick={() => this._confirm()} type="primary"> Create </Button>
                          
                                   </div> 
                                 </section>
                <ul style={{ listStyle: 'none'}}>      
                  {this._renderTodos()}
                </ul> 
                </Tab.Pane>)
      } },
      { menuItem: 'About the developer', render: () => <Tab.Pane>Can't think of anything else. I enjoy javascript and planting/farming. I am from Philippines. Mabuhay! I'll add more info here soon since I am not a criminal anyway, my email is gpbaculio@gmail.com ^____^ </Tab.Pane> },
    ]

    return (
      <div>
        <span style={{position: 'relative', top:'30px', bottom:'30px', width: 'auto', marginRight:'30px', marginLeft:'30px', fontSize:'27px', marginTop:'30px',marginBottom:'30px'}} > {`${this.props.viewer.fullName}`} </span>
        <Tab style={{position:'relative', top:'30px', marginTop:'30px', width: 'auto', marginRight:'30px', marginLeft:'30px'}} panes={panes} />     
      </div>
    )
  }

}

export default createFragmentContainer(TodoListProfile, graphql`# not sure, but i believe the queries below is to make sure that the data is available before THIS component renders?
  fragment TodoListProfile_viewer on User { # User is a name of a GraphQL type on ../data/schema.js
    allTodosByUser( first: 100 ) @connection(key: "TodoListProfile_allTodosByUser") { #this is a relay connection
      edges {
        node {
          ...Todo_todo # the data dependency of Todo component
          id
          text 
          complete 
          privacy
          fullName
        }
      }
      pageInfo {
        hasPreviousPage 
        hasNextPage
      }
    }
    id
    fullName
    ...Todo_viewer
  }
`)
