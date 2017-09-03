import React, { Component } 
  from 'react'
import { QueryRenderer, graphql } 
  from 'react-relay';

import Header from './Header';
import environment  from '../RelayEnvironment';


const HeaderRendererQuery = graphql` #CONFIGURE GRAPHQL QUERY FOR THIS TOMORROW
  query HeaderRendererQuery {
    viewer { #viewer query on graphql, the component TodoListHomePage will receive this.props.viewer if configured properly on schema.js
      ...Header_viewer #fragment on TodoListHome component, that's why we import it here.
    }
  }
`;

class HeaderRenderer extends Component {

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={HeaderRendererQuery}
        render={({error, props}) => {
          if (error) {
            console.log(error)
            return <div>{error.message}</div> 
          } else if (props) { // props is destructured from the default function argument above 
            return <Header viewer={props.viewer} />
          }
          return <p style={{display: 'none'}}> Loading </p> // display set to none since we do not need to display loading state for header. that'd be dumb, dunno why use else on if dont work, it works only this way
        }}
      />
    )
  }

}

export default HeaderRenderer