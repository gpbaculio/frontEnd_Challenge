import {
  commitMutation,
  graphql,
} from 'react-relay';
import environment from '../RelayEnvironment'
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql` # easy, just like performing mutation in graphql
  mutation LoginEmailMutation($input: LoginEmailInput!) {
    loginEmail(input:$input) {
	    token # token and error will be availale on response. see onCompleted below
	    error 
    }
  }`;

let tempID = 0;

function commit( email, password, callback ) {
  return commitMutation(
  	environment, // = environment: environment
  	{
  		mutation, // = mutation: mutation
  		variables: {
		    input: {
		      email,
		      password,
		    },
	  	},
	  	onCompleted: (response) => { // response is a default argument in this function
	  		const error = response.loginEmail.error;
	        const token = response.loginEmail.token;
	         
	        if(error) {
	        	console.log('The email or password is incorrect.'); 
	        } else { 
	        	callback(token, error) // callback is function passed as argument when we commit mutation, what it does is save token and error fields on localStorage.
	        }
      	},
      	onError: err => console.error(err),
  	})
}

export default {
	commit
};
