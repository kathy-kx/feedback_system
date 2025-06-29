// 类似controller

const passport = require('passport'); // Import the original passport npm module. Not ../services/passport.js 

// app is not defined yet when reconfigured. We want to use the same 'app' instance in index.js. Use trick here to pass the app instance to this module.
module.exports = (app) =>{
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'] 
    }));
    
    app.get('/auth/google/callback', passport.authenticate('google'));

    app.get('/api/current_user', (req, res) =>{
        res.send(req.user); // Send the current user information as a response.
    });

    app.get('/api/logout', (req, res) => {
        req.logout((err) => {
            if (err){
                return res.status(500).send({ error: 'Logout failed' }); // Handle logout error
            }
            res.send(req.user); // 登出后 req.user 为 undefined
    });
        }); // Passport 提供的方法，清除用户 session.kill the cookie
        
}
// module.exports: Node.js(使用CommonJS模块系统)中,指定当其他文件 require 这个文件时应该返回什么值。
// 即，定义一个文件向外提供什么内容
// = (app) => {...} 导出了一个箭头函数。这个函数接受一个参数，我们将其命名为app（期望接收来自index.js的Express应用实例app）。
// （如何与index.js连接）：当index.js执行const authRoutes = require('./routes/authRoutes');时，authRoutes常量被赋予了导出的函数
// 然后index.js调用authRoutes(app)，执行了导出函数内部的代码，并将Express的app对象传进去。

// app.get(path, handler):为指定path的HTTP GET请求注册一个handler。
// 告诉 Passport 使用名为 'google' 的策略，我们将在passport.js中定义它。
// {scope: ['profile', 'email']}：指定我们希望从Google获取的用户信息范围。

// app.get('/auth/google/callback', passport.authenticate('google'));这次会查找Google在URL中返回的授权码，
// 用这个code与google交换access token和用户个人资料

// initial setup
// app.get('/', (req, res) => {
//     res.send({ hi: 'there' });
// });