
// 配置passport如何执行Google认证。告诉Passport使用Google OAuth 2.0策略来处理用户认证。
// 提供API密钥，指定回调路径。以及认证成功后做什么。类似SecurityFilterChain
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys'); // Import the keys module. This module contains sensitive information like API keys and secrets.

const User = mongoose.model('users'); // 这一句和上面的const mongoose = require('mongoose');
// pull a schema out of mongoose

// 序列化 user对象 -> id
passport.serializeUser((user, done) =>{
    done(null, user.id); // 这里的id是用户在数据库里的_id主键
});

// 反序列化 id -> user对象
passport.deserializeUser((id, done)=>{
    User.findById(id).then(user => {
        done(null, user); // 告诉Passport可以用cookie查出来的user对象
    });
});


// passport.use()用于注册一个或多个认证策略，并配置
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback', // The URL to which Google will redirect after authentication.
            proxy: true
        }, 
        //第二个参数：回调函数。处理从 Google 返回的用户信息
        (accessToken, refreshToken, profile, done) => { 
            // console.log('access token', accessToken), // Log the access token received from Google.
            // console.log('refresh token', refreshToekn),
            // console.log('profile', profile);// profile includes user information returned by Google.
            User.findOne({googleId: profile.id})
                .then((existingUser) => {
                if (existingUser) {
                    // skip creating a new user if one already exists
                    done(null, existingUser); // 如果用户已存在，直接调用done函数。传入null表示没有错误，并传入现有用户对象。
                }else{
                    // Create a new user if one does not already exist
                    new User({ googleId: profile.id })
                        .save() // 异步保存，返回 Promise
                        .then(user => done(null, user)); // 保存成功后通知 Passport 登录完成
                }
            }); 
        }

    )); // Use the Google OAuth 2.0 strategy for authentication.
