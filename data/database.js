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
import { UserModel, TodoModel, ConversationModel, MessageModel } 
  from '../model';

export function changeTodoStatus(id, complete) {
  const todo = getTodo(id);
  todo.complete = complete;
}

export function getTodo(id) {
  return todosById[id];
}

export async function getTodosOfFriendsByUser(contextUserId) {
  try {
    const { _friendsIds: friendsIds } = await UserModel.findOne({ _id: contextUserId }).select('_friendsIds -_id'); 
    const TodosByFriendsOfUser = await TodoModel.find({ _creatorUserId: { $in: friendsIds }, privacy: { $eq: "friends" } }).populate('_creatorUserId');;
    return TodosByFriendsOfUser;
  } catch(err) {
    console.error(err)
  }
}

export async function getMessagessByUserContext(contextUserId) {
  try {
   const messages = await ConversationModel.find({ participants: contextUserId }) // find conversations of context user id
                                           .select('_id') // select only _id field
                                           .then(idObjects => idObjects.map(idObject => idObject._id.toString() )) // since it will return _id objects we have to convert it to array of _id as string type so we can use it on MessageModel query using $in
                                           .then( async (ids) => {
                                              return  await MessageModel.find({ conversationId: { $in: ids } })
                                                                        .sort({createdAt: 'ascending'})
                                                                        .populate('sender receiver');
                                           });
  return messages
  } catch(err) {
    console.error(err)
  }
}

export async function getFriendsByUser(contextUserId) {
  try {
    const { _friendsIds: friendsIds } = await UserModel.findOne({ _id: contextUserId }).select('_friendsIds -_id');
    const friendsByUser = await UserModel.find({ _id: { $in: friendsIds }});
    return friendsByUser;
  } catch(e) {
    console.error(e)
  }
}

export async function getPublicTodos() {
  try {
    const publicTodos = await TodoModel.find({privacy: "public"}).populate('_creatorUserId').sort({createdAt: 'descending'}); // so we can see the latest todo added
    return publicTodos;
  } catch(e) {
    console.error(e)
  }
}
export async function getTodoByUserContext(contextUserId,todoId) {
  const todo = await TodoModel.findOne({_id:todoId, _creatorUserId:contextUserId }).populate('_creatorUserId');
console.log("todo = ",todo);
return todo;
}
export async function getTodosByUserContext(contextUserId, status = 'any') { // by default, status = 'any'
               try {
                if(status === 'any') {
                  const todos = await TodoModel.find({_creatorUserId: contextUserId}).populate('_creatorUserId').sort({createdAt: 'descending'});;
                  console.log("getTodosByUserContext todos = ",todos)
                  return todos;
                }
                if(status === 'complete') {
                  const { todos: todoIdsByUser } = await UserModel.findOne({ _id: contextUserId }).select('todos -_id'); // destructure todos, it'll return an object containing todos property array. -_id so we do not include _id on return
                    
                  let retrieveTodoObjects = await TodoModel.find()
                                                .where('_id')
                                                .in(todoIdsByUser);
                  const filterCompletedTodos = retrieveTodoObjects.filter( todo.complete === (status === 'complete') ); // (status === 'complete') will return a boolean value
                    
                  return filterCompletedTodos; // todos is an array in mongoose db
                }
               } catch (err) {
                console.error(err)
                 return null;
               }
             }

export function getUser(id) {
  return usersById[id];
}

export async function getViewer(contextUserId) {
               try {
                 const user = await UserModel.findOne({ _id: contextUserId });
                 return { user };
               } catch (err) {
                 return { user: null };
               }
             } 

export function markAllTodos(complete) {
  const changedTodos = [];
  getTodos().forEach(todo => {
    if (todo.complete !== complete) {
      todo.complete = complete;
      changedTodos.push(todo);
    }
  });
  return changedTodos.map(todo => todo.id);
}

export function removeTodo(id) {
  const todoIndex = todoIdsByUser[VIEWER_ID].indexOf(id);
  if (todoIndex !== -1) {
    todoIdsByUser[VIEWER_ID].splice(todoIndex, 1);
  }
  delete todosById[id];
}

export function removeCompletedTodos() {
  const todosToRemove = getTodos().filter(todo => todo.complete);
  todosToRemove.forEach(todo => removeTodo(todo.id));
  return todosToRemove.map(todo => todo.id);
}

export function renameTodo(id, text) {
  const todo = getTodo(id);
  todo.text = text;
}
