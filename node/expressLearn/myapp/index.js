var birds = require('./birds')

const express = require( 'express' )
const app = express()

app.set('view engine', 'pug')

app.get('/', (req, res)=>{
  res.render('index', {title: 'Hey', message: 'hello'})
})
// var myLogger = (req, res, next) => {
//   console.log("logged");
//   next()
// }

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

// app.use('/birds', birds)

// app.use(express.static("./"))
// app.use(myLogger)
// app.use('/user/:id', (req, res, next)=>{
//
//   console.log(req.method, res.req.params);
//   next()
// })
// app.get('/user/:id', (req, res, next)=>{
//
// })
// app.get('/user/:id', function (req, res, next) {
//   res.send('USER')
// })

// app.get('/', (req, res, next)=>{
//   console.log("test");
//   next()
//   console.log("test1");
// }, (req, res)=>{
//   console.log("Test");
//   res.send('hello world')
// })
//
// app.post('/', function (req, res) {
//   res.send('Got a POST request')
// })
//
// app.put('/user', function (req, res) {
//   res.send('Got a PUT request at /user')
// })
//
// app.delete('/user', function (req, res) {
//   res.send('Got a DELETE request at /user')
// })
//
app.listen(3000, ()=>{
  console.log('express app listening on port 3000');
})
