import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import { Card,Icon } from 'semantic-ui-react'

class Todo extends Component {

  render() {
    return (
<<<<<<< HEAD
        <li style={{marginTop:'20px',marginRight:'0',marginLeft:'auto',position:'relative',display:'block'}}>
=======
        <li style={{marginTop:'20px'}}>
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
          <Card style={{width:'400px'}}>
            <Card.Content>
              <Icon style={{float:'right'}} name='user'/>
              <Card.Header>
                {this.props.todo.fullName}
              </Card.Header>
              <Card.Meta>
<<<<<<< HEAD
                Complete: <span style={{color:'#404040'}}>{`${this.props.todo.complete}`} </span>  
=======
                Complete: <span style={{color:'#404040'}}>{`${this.props.todo.complete}`} </span>
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
              </Card.Meta>
              <Card.Description style={{color:'#404040'}}>
               {`${this.props.todo.text}`}
              </Card.Description>
            </Card.Content>
<<<<<<< HEAD
=======
            <Card.Content extra>
              <span>
                <Icon name='like outline' />
                Like
              </span>
              <span style={{marginLeft:'20px'}}>
                <Icon name='comment' />
                Comment
              </span> 
            </Card.Content>
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
          </Card>
        </li>
    )
  }
}

export default createFragmentContainer(Todo, graphql`
  fragment Todo_viewer on User {
    id
<<<<<<< HEAD
    _id
=======
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
    fullName
  }
  fragment Todo_todo on Todo {
    id
    text
    complete
    privacy
    fullName
  }
`);