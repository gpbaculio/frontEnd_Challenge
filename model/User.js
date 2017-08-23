// @flow


import mongoose from 'mongoose';
import bcrypt from 'bcrypt-as-promised'; // A promisified version of bcrypt

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    hidden: true,
  },
  email: {
    type: String,
    required: false,
    index: true,
  },
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'todoModel' }] // todoModel can be anything, can be Todo as long as it is relevant to other mongoose Model
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  collection: 'user',
});

// .pre -> Define a middleware function to be invoked before 'save'
userSchema
  .pre('save', function (next) {
	// Hash the password 
	// .isModified -> Returns true if this document was modified, else false. */}
    if (this.isModified('password')) {
      this.encryptPassword(this.password) // invoke the encryptPassword method here with the this.password argument
        .then((hash) => { // using this.encryptPassword creates hash for the this.password, the result is passed as default first argument on .then(), it assigns the result, hash, on this.password, it's the same but hashed.
           this.password = hash;
          next();
        })
        .catch(err => next(err));
    } else {
      return next();
    }
  });

userSchema.methods = {
  async authenticate(plainTextPassword) { // a function/method to be invoked with the plain password
    try {
      // comparing
      return await bcrypt.compare(plainTextPassword, this.password); // check encryption and password if matched
    } catch (err) {
      return false;
    }
  },
  encryptPassword(password) {
  	// hashing the password argument
    return bcrypt.hash(password, 8); 
  },
};


export const UserModel = mongoose.model('userModel', userSchema);
