
import React, { Component }    from 'react';
import { Button,  Form, Grid } from 'semantic-ui-react'
import UserRegistration        from '../mutations/UserRegistrationMutation';
import LoginEmail              from '../mutations/LoginEmailMutation';


class SignUpAndLogin extends Component {

  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    fullName: ''
  }

     _confirm = () => {
        const { fullName, email, password } = this.state
        if (!this.state.login) {
          UserRegistration.commit(fullName, email, password, (token, error) => { 
            this._saveUserData(token, error);
            window.location.reload(true);
            this.props.history.push(`/`);
          });
        } else {
          LoginEmail.commit(email,password, (token, error) => { 
            this._saveUserData(token, error);
            window.location.reload(true);
            this.props.history.push(`/`);
          });
        }
     }

  _saveUserData = (token, error) => {
    localStorage.setItem('user_token', token);
    localStorage.setItem('email_already_exist', error);
  }

  render() {
    return (
          
      <div className="toLogin-toSignup-container" >
      <Grid
      textAlign="center"
        style={{ height: '100%' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: '450px' }}>

        <Form>
        <h4 className='mv3'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
          <p> You can login with this email: gpbaculio@gmail.com pass: abcd123 </p>
          {!this.state.login && // !this.state.login, not logging in, so signing up, we don't need to display the fullName field
          <Form.Field required>
          <label>Full Name</label>
            <input 
              value={this.state.fullName}
              onChange={(e) => this.setState({ fullName: e.target.value })}
              placeholder='Your Fullname' 
            />
          </Form.Field>}

          <Form.Field required>
          <label >Email Address</label>
            <input 
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
              placeholder='Your email address'
              type="email" 
            />
          </Form.Field>

          <Form.Field required>
          <label>Password</label>
            <input 
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
              type='password'
              placeholder='Your password'
            />
          </Form.Field>
          <Button onClick={() => this._confirm()} > {this.state.login ? 'Login' : 'Sign Up' } </Button>
          
          
         <div className="toLogin-toSignUp-question-container">
          <span className="toLogin-toSignUp-question">{this.state.login ? 'Don\'t have  an account?' : 'Already have an account? '}</span> <span className="toLogin-toSignUp" onClick={() => this.setState({ login: !this.state.login })}>{this.state.login ? ' Sign Up' : ' Login' }</span>
         </div>
      </Form>
      </Grid.Column>
      </Grid>
      </div>
    )
  }

}

export default SignUpAndLogin