## Create an HTTP Transaction
1. import the http module
2. create the Server (`createServer`) and emit a 'request' listener
3. process request (method, url , headers, body)
4. process response
5. process error
6. listening a port
```
const http = require('http');

http.createServer((request, response) => {
  const { headers, method, url } = request;
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // BEGINNING OF NEW STUFF

    response.on('error', (err) => {
      console.error(err);
    });

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    // Note: the 2 lines above could be replaced with this next one:
    // response.writeHead(200, {'Content-Type': 'application/json'})

    const responseBody = { headers, method, url, body };

    response.write(JSON.stringify(responseBody));
    response.end();
    // Note: the 2 lines above could be replaced with this next one:
    // response.end(JSON.stringify(responseBody))

    // END OF NEW STUFF
  });
}).listen(8080);
```

## `server = http.createServer([requestListener])`
1. **requestListener** is called once for every HTTP request that's made against that server, it is automatically added to the 'request' event
3. `server` is an **EventEmitter**
4. also, you can create a server object, and adding the listener later
  ```
  const server = http.createServer()
  server.on('request', (request, response)=>{
    //magic happens here!
  })
  ```

## Request and Response
* `request` object is a `ReadableStream`, `response` object is a `WritableStream`

### Request
* method
* url: is the full URL without the server, protocol or port
* headers
* rawHeaders: the even-numbered offsets are key values, and the odd-numbered offsets are the associated values.
* body: grab the data right out of the stream by listening to the stream's 'data' and 'end' events
  - The chunk emitted in each 'data' event is a Buffer

### Response
* `response.statusCode`: set the HTTP status code
* `response.setHeader`
* `response.writeHead`
* `response.write`
* `response.end`

## Error
* If you don't have a listener for that event, the error will be thrown, which could crash your Node.js program.
