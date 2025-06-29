const express = require('express'); // require()这是Node.js导入外部库或其他文件（模块）的方式。这里导入了express库，它是Node.js中用于构建Web服务器的框架。Import the express module. Use "require" keyword to get access to the Express library.
// const express= ... 声明一个常量，将导入的express库的功能赋值给这个常量。

const mongoose = require('mongoose'); // Import the mongoose module. Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.

const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys'); // Import the keys module. This module contains configuration keys, such as database connection strings and API keys.

require('./models/user'); // Import the user model. Ensure the user model is loaded and registered with Mongoose.

require('./services/passport'); // Ensure configuration in `passport.js` can be executed and run by server
// 它没有赋值给一个变量，这通常意味着passport.js文件在被导入时会立即执行一些初始化代码

mongoose.connect(keys.mongoURI);
//console.log(".....testing  nodemon");

const app = express(); // Create an  instance of an Express application. This app instance will be used to configure the server and define routes.
// express(): 调用 Express 库提供的主函数,来创建 Express 应用程序的一个实例，并存在app常量中。
// app相当于Spring的ApplicationContext

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // Set the maximum age of the session cookie to 24 hours.
        keys: [keys.cookieKey] // Use the cookie key from the keys module to sign the session cookie.
    })
);

// 添加这段兼容性代码，解决req.session.regenerate is not a function问题
app.use((req, res, next) => {
    if (!req.session.regenerate) {
        req.session.regenerate = (callback) => {
            callback();
        };
    }
    if (!req.session.save) {
        req.session.save = (callback) => {
            callback();
        };
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/authRoutes'); // Import the authRoutes module. This module contains the routes related to authentication.
// 找到并执行authRoutes.js文件，该文件通过module.exports导出了一个值，是一个函数，被赋给了authRoutes常量。

authRoutes(app);
// authRoutes变量持有从authRoutes.js导出的函数。这里，调用了这个函数，并将app实例作为参数传递给它。
// JavaScript中，函数可以被赋值给变量、作为参数传递给其他函数、也可以作为函数的返回值。
// 前面的require('./routes/authRoutes') 得到一个函数，authRoutes(app)则用app作为输入来执行这个函数。
// 也可以合并写为：require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5001; // Look at the underlying environment and see if they have declared a port for us to use.
//Node.js 提供一个全局的 process 对象。process.env 包含了环境变量。
// 这行代码意思是从名叫PORT的环境变量中获取端口号（部署平台分配的），如果没有设置这个环境变量，则使用默认的5001端口。

// console.log(`Received PORT from environment: ${process.env.PORT}, Effective PORT: ${PORT}`);

app.listen(PORT);
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`); // Log a message to the console indicating that the server is running and on which port.
// });
// app.listen(PORT, ...): 这个方法启动 Web 服务器，使其在指定的 PORT 上监听传入的 HTTP 连接。
// 这个方法是异步的，意味着它不会阻塞代码的执行，而是立即返回，并在服务器准备好后，执行回调函数。
// () => {...} 传递给 listen 的第二个参数是一个箭头函数，表示一个匿名函数。
// 这个回调函数会在服务器成功启动并开始监听端口后被执行，打印出服务器正在运行的端口号。
// 


//1. 我们只是调用了这个函数，并将 app 实例作为参数传递给它。这是什么意思？怎么做到的。const authRoutes = require('./routes/authRoutes');这里authRoutes不是一个常量吗？为什么又成了一个函数 还可以传参数给它？是不是也可以写作：也可以合并写为：require('./routes/authRoutes')(app);如何理解？2.app.listen(PORT, ...): 这个方法启动 Web 服务器，使其在指定的 PORT 上监听传入的 HTTP 连接。这是一个异步操作。什么是异步操作？