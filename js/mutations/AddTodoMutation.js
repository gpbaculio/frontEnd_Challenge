/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { commitMutation, graphql, } 
  from 'react-relay';
import { ConnectionHandler } 
  from 'relay-runtime';

const mutation = graphql`
  mutation AddTodoMutation($input: AddTodoInput!) {
    addTodo(input:$input) {
      todoEdge {
        __typename
        cursor
        node {
          complete
          id
          text
          privacy
          fullName
        }
      }
      viewer {
        fullName
        id
      }
    }
  }
`;

let tempID = 0;

function commit(
  environment,
  text,
  privacy,
  user
) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          text,
          privacy,
          clientMutationId: tempID++,
        },
      },
      updater: (store) => {
        const payload = store.getRootField('addTodo');
        const newEdge = payload.getLinkedRecord('todoEdge');
        const viewer = payload.getLinkedRecord('viewer');
        const viewerFullname = viewer.getValue('fullName');
              newEdge.setValue(viewerFullname, 'fullName');
        const userProxy = store.get(user.id);

        const conn = ConnectionHandler.getConnection(
          userProxy,
          'TodoListProfile_allTodosByUser',
        );
        
        ConnectionHandler.insertEdgeBefore(conn, newEdge);
      },
      optimisticUpdater: (store) => {
        const userProxy = store.get(user.id);
        const fullNameProxy = userProxy.getValue('fullName');

        const id = 'client:newTodo:' + tempID++;
        const node = store.create(id, 'Todo');
              node.setValue(text, 'text');
              node.setValue(id, 'id');
              node.setValue(false, 'complete');
              node.setValue(fullNameProxy, 'fullName');
              
        const newEdge = store.create(
          'client:newEdge:' + tempID++,
          'TodoEdge',
        );

        newEdge.setLinkedRecord(node, 'node');

        const conn = ConnectionHandler.getConnection(
          userProxy,
          'TodoListProfile_allTodosByUser',
        );

        ConnectionHandler.insertEdgeBefore(conn, newEdge);
        userProxy.setValue(
          userProxy.getValue('totalCount') + 1,
          'totalCount',
        );
      },
    }
  );
}

export default {commit};