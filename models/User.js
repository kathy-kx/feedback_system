const mongoose = require('mongoose');
const { Schema } = mongoose; // 相当于const Schema = mongoose.Schema; // 解构Destructure the Schema constructor from mongoose. This allows us to create new schemas for our models.

const userSchema = new Schema({
  googleId: String
});

mongoose.model('users', userSchema);// 2参数可以 Loads a schema into Mongoose ;自动在数据库中创建一个叫 users 的collection。
// 2参数可以 Loads a schema into Mongoose ; 1参数可以 pull a schema out of mongoose。例如passport.js中的const User = mongoose.model('users')