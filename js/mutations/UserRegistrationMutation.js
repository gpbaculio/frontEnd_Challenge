import {
  commitMutation,
  graphql,
} from 'react-relay';
import environment from '../RelayEnvironment'
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql` # easy, just like performing mutation in graphql
  mutation UserRegistrationMutation($input: UserRegistrationInput!) {
    userRegistration(input:$input) {
	    token # token and error will be availale on response. see onCompleted below
	    error
    }
  }`;

let tempID = 0;

function commit( fullName, email, password, callback ) {
  return commitMutation(
  	environment, // = environment: environment
  	{
  		mutation, // = mutation: mutation
  		variables: {
		    input: {
		      fullName,
		      email,
		      password,
		    },
	  	},
	  	onCompleted: (response) => { // response is a default argument in this function
	  		console.log("response = ", response);
	  		const error = response.userRegistration.error;
	        const token = response.userRegistration.token;
	         
	        if(error) {
	        	console.log('email already exist'); 
	        } else { 
	        	callback(token, error) 
	        }
      	},
      	onError: err => console.error(err),
  	})
}

export default {
	commit
};
