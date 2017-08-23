import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInputObjectType
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  offsetToCursor,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  Todo,
  User,
  addTodo,
  changeTodoStatus,
  getTodo,
  getTodoByUserContext,
  getTodosByUserContext,
  getFriendsByUser,
  getPublicTodos,
  getUser,
  getViewer,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo,
} from './database';


import { // mongoose models
  UserModel,
  TodoModel,
} from '../model';

import {
  generateToken
} from '../auth';

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId, context) => { // globalId and context is a default args
    const { type, id } = fromGlobalId(globalId); // type and id is destructured from the return value of fromGlobalId(globalId)
    if (type === 'Todo') {
      return getTodoByUserContext(id,context.user._id);
    } else if (type === 'User') {
      const { user } = await getViewer(context.user._id);
      return user;
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Todo) {
      return GraphQLTodo;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    text: {
      type: GraphQLString,
      resolve: (root) => root.text,
    },
    privacy: {
      type: GraphQLString,
      resolve: (root) => root.privacy,
    },
    complete: {
      type: GraphQLBoolean,
      resolve: (root) => root.complete,
    },
    fullName: {
      type: GraphQLString,
      resolve: (root) => {
        return root._creatorUserId.fullName;
      },
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: TodosConnection,
  edgeType: GraphQLTodoEdge,
} = connectionDefinitions({
  name: 'Todo',
  nodeType: GraphQLTodo,
});

const GraphQLFriendByUser = new GraphQLObjectType({
  name: 'FriendByUser',
  fields: {
    id: globalIdField('FriendByUser'),
    _id: {
      type: GraphQLString,
      resolve: (root) => root._id,
    },
    email: {
      type: GraphQLString,
      resolve: (root) => root.email,
    },
    fullName: {
      type: GraphQLString,
      resolve: (root) => {
        return root.fullName;
      },
    },
    _friendsIds: { // so we can get the length of how many friends, the friend of the user context has.
      type: GraphQLString,
      resolve: (root) => {
        return root._friendsIds;
      },
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: FriendsByUserConnection,
  edgeType: GraphQLFriendByUserEdge,
} = connectionDefinitions({
  name: 'FriendByUser',
  nodeType: GraphQLFriendByUser,
});

const GraphQLSenderAndReceiverType = new GraphQLObjectType({ 
        name: 'SenderAndReceiver', 
        fields: {
          _id: { // _id in the database
          type: GraphQLString,
          resolve: (root) => {
            return root._id;
          },
        },
        fullName: {
          type: GraphQLString,
          resolve: (root) => {
            return root.fullName;
          },
        } 
      }
    });

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    _id: {
      type: GraphQLString,
      resolve: ({_id}, args, context) => {
        if(_id.toString() === context.user._id.toString()) {
          return  _id // _id of context
        }
      return null;
    }
    },
    fullName: {
      type: GraphQLString,
      resolve: (root, args, context) => {
        if(root._id.toString() === context.user._id.toString()) {
          return  root.fullName // _id of context
        }
      return null;
    }
    },
    allTodosByUser: {
      type: TodosConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs, // connectionArgs is a default argument we use for pagination
      },
      resolve: async ({_id}, {status, ...args}, context) => {
        // {_id} destructure _id property on root
        if(_id.toString() === context.user._id.toString()) {
          const todos = await getTodosByUserContext(context.user._id, status)
          return connectionFromArray(todos, args)
        }
        return null;
      },
    },
    publicTodos: {
      type: TodosConnection,
      args: {
        ...connectionArgs, // connectionArgs is a default argument we use for pagination
      },
      resolve: async (root, {...args}, context) => {
        
        const todos = await getPublicTodos();
        return connectionFromArray(todos, args)
      },
    },
    totalCount: {
      type: GraphQLInt,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
      },
      resolve: async ({_id}, {status}, context) => { 
        if(_id.toString() === context.user._id.toString()){
          const todos = await getTodosByUserContext(context.user._id, status)
          return todos.length 
        }
        return null;
      },
    },
    completedCount: {
      type: GraphQLInt,
      resolve: async (root, args, context) => { 
        if(root.user && context.user) {
          const completedTodos = await getTodosByUserContext(context.user._id, 'complete')
          return completedTodos.length;
        }
      },
    },
  },
  interfaces: [nodeInterface],
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: async (root, args, context) => {
        const { user } = await getViewer(context.user._id);
        if(user) { 
          return user;
        }
        return 'guest'; 
      },
    },
    node: nodeField,
  },
});

const GraphQLAddTodoMutation = mutationWithClientMutationId({ 
  name: 'AddTodo',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    privacy: { type: GraphQLString },
  },
  mutateAndGetPayload: async ({text,privacy}, context) => {
      let newTodo = new TodoModel({
                    text,
                    privacy,
                    _creatorUserId: context.user._id
                  });
      await newTodo.save(); 
      return { newTodo }; 
  },
  outputFields: {
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: async ({newTodo}, args,context) => {
        const todos = await getTodosByUserContext(context.user._id, 'any');
        return {
          cursor: offsetToCursor([...todos], newTodo),
          node: newTodo,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: async (root, args, context) => {
        const { user } = await getViewer(context.user._id);
        return user;  
      }
    },
  },
});
const GraphQLReceiverInputType = new GraphQLInputObjectType({ // <-- e.g. of object input
  name: 'Receiver',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  }
});
const GraphQLChangeTodoStatusMutation = mutationWithClientMutationId({
  name: 'ChangeTodoStatus',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: ({localTodoId}) => getTodo(localTodoId),
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id, complete}) => {
    const localTodoId = fromGlobalId(id).id;
    changeTodoStatus(localTodoId, complete);
    return {localTodoId};
  },
});

const GraphQLMarkAllTodosMutation = mutationWithClientMutationId({
  name: 'MarkAllTodos',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    changedTodos: {
      type: new GraphQLList(GraphQLTodo),
      resolve: ({changedTodoLocalIds}) => changedTodoLocalIds.map(getTodo),
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({complete}) => {
    const changedTodoLocalIds = markAllTodos(complete);
    return {changedTodoLocalIds};
  },
});

// TODO: Support plural deletes
const GraphQLRemoveCompletedTodosMutation = mutationWithClientMutationId({
  name: 'RemoveCompletedTodos',
  outputFields: {
    deletedTodoIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({deletedTodoIds}) => deletedTodoIds,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: () => {
    const deletedTodoLocalIds = removeCompletedTodos();
    const deletedTodoIds = deletedTodoLocalIds.map(toGlobalId.bind(null, 'Todo'));
    return {deletedTodoIds};
  },
});

const GraphQLRemoveTodoMutation = mutationWithClientMutationId({
  name: 'RemoveTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedTodoId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localTodoId = fromGlobalId(id).id;
    removeTodo(localTodoId);
    return {id};
  },
});

const GraphQLUserRegistrationMutation = mutationWithClientMutationId({
  name: 'UserRegistration',
  inputFields: {
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ fullName, email, password }) => {
    let user = await UserModel.findOne({ email: email.toLowerCase() }); // assign value for the user, this will check if the supplied email(from parameter) is on the database

    if (user) {
      return {
        token: null,
        error: 'EMAIL_ALREADY_IN_USE',
      };
    }

    user = new UserModel({
      fullName,
      email,
      password,
    });

    await user.save();
    return {
      token: generateToken(user),
      error: null,
    };
  },
  outputFields: { // my advice is to not add fields to Relay mutations until you need them, it can be a lot of work for very little gain
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

const GraphQLLoginEmailMutation = mutationWithClientMutationId({
  name: 'LoginEmail',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }) => {
    const user = await UserModel.findOne({ email: email.toLowerCase() }); // check if email is existing in the database

    if (!user) { // check if user is falsy
      return { // then return token null value and error is truthy
        token: null,
        error: 'INVALID_EMAIL_PASSWORD',
      };
    }

    const correctPassword = user.authenticate(password); // .authenticate is configured upon creating the UserModel. take a look at it on the ../model/User.js

    if (!correctPassword) { // correctPassword is falsy
      return {
        token: null, // token is null, and error is truthy
        error: 'INVALID_EMAIL_PASSWORD',
      };
    }

    return { // everything is good. ok, generateToken for token field and error is null
      token: generateToken(user),
      error: null,
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

const GraphQLRenameTodoMutation = mutationWithClientMutationId({
  name: 'RenameTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: ( {localTodoId} ) => getTodo(localTodoId),
    },
  },
  mutateAndGetPayload: ({id, text}) => {
    const localTodoId = fromGlobalId(id).id;
    renameTodo(localTodoId, text);
    return { localTodoId };
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTodo: GraphQLAddTodoMutation,
    changeTodoStatus: GraphQLChangeTodoStatusMutation,
    markAllTodos: GraphQLMarkAllTodosMutation,
    removeCompletedTodos: GraphQLRemoveCompletedTodosMutation,
    removeTodo: GraphQLRemoveTodoMutation,
    renameTodo: GraphQLRenameTodoMutation,
    userRegistration: GraphQLUserRegistrationMutation,
    loginEmail: GraphQLLoginEmailMutation
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
