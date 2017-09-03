import React, { Component } from 'react'
import { Link }             from 'react-router-dom';
import { withRouter }       from 'react-router';
import { createFragmentContainer, graphql } 
  from 'react-relay';
import { Menu, Segment, Icon, Dropdown, Button, Grid } 
  from 'semantic-ui-react'


class Header extends Component {

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

   const userId            = this.props.viewer._id; // if there is a logged in user, this should be true
   const localStorageToken = localStorage.getItem('user_token'); // if there is a logged in user, this should be true since we only set token on login and register
   const { activeItem }    = this.state; // this is for semantic ui react
   const NavMenu = (stackable) =>  {// menu is horizontal by default
      let showNavMenuOnClick;
      if(stackable) {
        showNavMenuOnClick = this.state.showNavMenu ? 'flex' : 'none';
      } else {
        showNavMenuOnClick = 'flex';
      }
            return (<Menu stackable={stackable} pointing secondary>   
                      <Menu.Item className={stackable ? '' : "asd"} >

                        createdBy = () => <strong style={{marginLeft: '5px'}}> Glendon Philipp Baculio </strong> {stackable ? <span className="contentIcon" onClick={this.showNavMenuClick}> <Icon name='content' /> </span> : ''}

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
                          {stackable ? (<Menu.Item onClick={this.handleItemClick} >
                                          <Icon name='shutdown' /> Logout
                                        </Menu.Item>) :                                                               
                                      (<Dropdown  className="logout-icon" pointing >
                                        <Dropdown.Menu>
                                          <Dropdown.Item onClick={this.handleItemClick} >
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