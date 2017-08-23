import React, { Component } from 'react'
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import { Card,Icon } from 'semantic-ui-react'

class Todo extends Component {

  render() {
    return (
        <li style={{marginTop:'20px'}}>
          <Card style={{width:'400px'}}>
            <Card.Content>
              <Icon style={{float:'right'}} name='user'/>
              <Card.Header>
                {this.props.todo.fullName}
              </Card.Header>
              <Card.Meta>
                Complete: <span style={{color:'#404040'}}>{`${this.props.todo.complete}`} </span>
              </Card.Meta>
              <Card.Description style={{color:'#404040'}}>
               {`${this.props.todo.text}`}
              </Card.Description>
            </Card.Content>
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
          </Card>
        </li>
    )
  }
}

export default createFragmentContainer(Todo, graphql`
  fragment Todo_viewer on User {
    id
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