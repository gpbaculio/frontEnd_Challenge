import { Environment, Network, RecordSource, Store, } 
  from 'relay-runtime';

const store = new Store(new RecordSource())
const user_token = localStorage.getItem('user_token');

const fetchQuery = (operation, variables) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': user_token,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

const network = Network.create(fetchQuery)

const environment = new Environment({
  network,
  store,
})

export default environment

