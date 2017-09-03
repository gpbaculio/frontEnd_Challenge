import React, { Component } from 'react'
<<<<<<< HEAD
import { Link }             from 'react-router-dom';
import { withRouter }       from 'react-router';
import { createFragmentContainer, graphql } 
  from 'react-relay';
import { Menu, Segment, Icon, Dropdown, Button, Grid } 
  from 'semantic-ui-react'


class Header extends Component {

=======
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { createFragmentContainer, graphql } 
  from 'react-relay';
import { Menu, Segment, Icon, Dropdown, Button, Grid } from 'semantic-ui-react'


class Header extends Component {
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
  state = { 
    activeItem: '', 
    showNavMenu: false 
  }

  handleItemClick = (e, {name}) => {
      this.props.history.push(name);
      this.setState({ activeItem: name });
  }

  handleProfileClick = (e, {name}) => {
      this.setState({ activeItem: name }); 
      this.props.history.push("/" + name.concat('/'.concat(this.props.viewer._id.toString())));
  }

  handleLogoAndLoginClick = (e, { name }) => {
    if(!name) {
      name="/"
    } 
    this.props.history.push(name);
    this.setState({ activeItem: '' });
  }

  showNavMenuClick = () => {
    this.setState({showNavMenu: !this.state.showNavMenu});
  }

  render() {
<<<<<<< HEAD

   const userId            = this.props.viewer._id; // if there is a logged in user, this should be true
   const localStorageToken = localStorage.getItem('user_token'); // if there is a logged in user, this should be true since we only set token on login and register
   const { activeItem }    = this.state; // this is for semantic ui react

=======
   const userId = this.props.viewer._id; // if there is a logged in user, this should be true
   const localStorageToken = localStorage.getItem('user_token'); // if there is a logged in user, this should be true since we only set token on login and register
   console.log("userId = ",userId)
   console.log("localStorageToken = ",localStorageToken)
   const { activeItem } = this.state; // this is for semantic ui react
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
   const NavMenu = (stackable) =>  {// menu is horizontal by default
      let showNavMenuOnClick;
      if(stackable) {
        showNavMenuOnClick = this.state.showNavMenu ? 'flex' : 'none';
      } else {
        showNavMenuOnClick = 'flex';
      }
            return (<Menu stackable={stackable} pointing secondary>   
                      <Menu.Item className={stackable ? '' : "asd"} >
<<<<<<< HEAD
                        createdBy = () => <strong style={{marginLeft: '5px'}}> Glendon Philipp Baculio </strong> {stackable ? <span className="contentIcon" onClick={this.showNavMenuClick}> <Icon name='content' /> </span> : ''}
=======
                        (createdBy) => <strong style={{marginLeft: '5px'}}> Glendon Philipp Baculio </strong> {stackable ? <span className="contentIcon" onClick={this.showNavMenuClick}> <Icon name='content' /> </span> : ''}
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
                      </Menu.Item>
                      <Menu.Menu position="right">
                      </Menu.Menu>
                                
                      { Boolean(localStorageToken && userId) ? (
                        <Menu.Menu style={{display: showNavMenuOnClick }} className={stackable  ? '' : 'right-nav'} position='right'>               
                                                            
                          <Menu.Item name='Profile'  active={activeItem === '/profile'} onClick={this.handleProfileClick} >
                            <Icon name='user' /> Profile
                          </Menu.Item>

                          <Menu.Item name='/home'  active={activeItem === '/home'} onClick={this.handleItemClick} > 
                            <Icon name='home' /> Home
                          </Menu.Item>
                                                            
<<<<<<< HEAD
=======
                          <Menu.Item name='Messages'  active={activeItem === '/friendRequests'} onClick={this.handleItemClick} >
                            <Icon name='users' /> { stackable ? 'Friend Requests' : ''}
                          </Menu.Item>

                          <Menu.Item name='Messages'  active={activeItem === '/messages'} onClick={this.handleItemClick} >
                            <Icon name='chat' /> { stackable ? 'Messages' : ''}
                          </Menu.Item>
                                                            
                          <Menu.Item name='Notifications' active={activeItem === '/notifications'} onClick={this.handleItemClick} >
                            <Icon name='world' /> { stackable ? 'Notifications' : ''}
                          </Menu.Item>
                                                            
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
                          {stackable ? (<Menu.Item onClick={this.handleItemClick} >
                                          <Icon name='shutdown' /> Logout
                                        </Menu.Item>) :                                                               
                                      (<Dropdown  className="logout-icon" pointing >
                                        <Dropdown.Menu>
                                          <Dropdown.Item onClick={this.handleItemClick} >
<<<<<<< HEAD
                                             <span className='logout-text'><span
                                                                              onClick={() => {
                                                                                localStorage.removeItem('user_token');
                                                                                localStorage.removeItem('email_already_exist');
                                                                                this.props.history.push('/');
                                                                              }}
                                                                            >
                                                                            Logout
                                                                          </span>
                                             </span>
=======
                                             <span className='logout-text'>Logout</span>
>>>>>>> e5f35113fc03dec2f9f71eaaf0de4e03c27f9098
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>)}

                        </Menu.Menu>) : 
                        (<Menu.Menu style={{display: showNavMenuOnClick }} className={stackable  ? '' : 'right-nav'} position='right'>               
                            <Menu.Item name='/home'  active={activeItem === '/home'} onClick={this.handleItemClick} > 
                              <Icon name='home' /> Home
                            </Menu.Item>
                            <Menu.Item name="/login" onClick={this.handleLogoAndLoginClick} >
                              <Button>Login</Button>
                            </Menu.Item> 
                          </Menu.Menu>) } 
                                
                    </Menu>)
         }

    return (
      <div >
        <Grid>
          <Grid.Column
            only='mobile'
            width={16}
          >
            {NavMenu(true)}
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column
            only='computer tablet'
            width={16}
          >
            {NavMenu(false)}
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(Header, graphql`
  fragment Header_viewer on User { # we declare dependency on _id here it means the user is logged in
    _id 
  }`));