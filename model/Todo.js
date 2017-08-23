import mongoose from 'mongoose';
import bcrypt from 'bcrypt-as-promised'; // A promisified version of bcrypt
import { UserModel } from './User';

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  privacy: {
    type: String,
    default: 'public',
  },
  _creatorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' }
},{
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  collection: 'todo',
});

todoSchema.pre('save', function(next) {
    // Don't do anything unless this is a new Post being created
    // If a todos' author can be changed you would also need to check for that here
    if (!this.isNew) {
        return next();
    }

    UserModel.update({_id: this._creatorUserId}, {
        $push: {todos: this._id}
    })
    .then(function() {
        next();
    })
    .then(null, function(err) {
        // Whoops! Something broke. You may want to abort this update.
        next(err);
    });
});

export const TodoModel = mongoose.model('todoModel', todoSchema);