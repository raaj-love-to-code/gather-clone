const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 9000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// Total users
const users = {};

// Active users
const active = {};

// Send
const send = (con, msg) => {
    console.log('sending message', msg);
    con.send(JSON.stringify(msg));
}

// register
const register = (con, email) => {
    if (users[email]) {
        send(con, {
            type: 'register',
            status: 'already_exists',
        });
    } else {
        users[email] = {
            createdAt: new Date().getTime(),
        };

        send(con, {
            type: 'register',
            status: 'success',
        });
    }
}

// login, if register set to true, the new user will be registered if not present
const login = (con, email, instantRegister = false) => {

    // Check for existing user
    if(users[email]) {
        if (active[email]) {
            send(con, {
                type: 'login',
                status: 'already_active'
            });
        } else {
            active[email] = {
                connection: con,
                loggedInAt: new Date().getTime()
            }
            send(con, {
                status: 'success',
                type: 'login',
                ...getUsers()
            });
        }
    } else if (instantRegister) {
        register(con, email);
    } else {
        send(con, {
            type: 'login',
            status: 'user_not_found'
        });
    }
}

// disconnect
const disconnect = (con, email) => {
    if(active[email]) {
        delete active[email];
        console.log(active);
        send(con, {
            type: 'disconnect',
            status: 'success'
        });
    } else {
        send(con, {
            type: 'disconnect',
            status: 'invalid'
        });
    }
}

// msg
const msg = (con, data) => {
    const {
        email,
        receiver,
        message,
    } = data;

    if (users[receiver]) {
        if (active[receiver]) {
            send(active[receiver].connection, {
                type: 'request',
                from: email,
                message: 'message from' + email + ' : ' + message,
            })
            send(con, {
                type: 'offer',
                status: 'success',
            });
        } else {
            send(con, {
                type: 'offer',
                status: 'offline',
            })
        }
    } else {
        send(con, {
            status: 'invalid_userid'
        });
    }
}

const getUsers = () => {
    const offlineUsers = [];
    const activeUsers = [];
    Object.keys(users).forEach(element => {
        if (Object.keys(active).includes(element)) {
            activeUsers.push(element);
        } else {
            offlineUsers.push(element);
        }
    });
    return {
        activeUsers,
        offlineUsers,
    }
}

const candidate = (email, candidate) => {
    var conn = active[email];
				
    if(conn != null) { 
       send(conn, { 
          type: "candidate", 
          candidate: candidate 
       }); 
    } 
}

const offer = (email, offer, conEmail) => {
    var conn = active[email]; 
				
    if(conn != null) { 
            
       send(conn, { 
          type: "offer", 
          offer: offer, 
          email: conEmail.email, 
       }); 
    }
}

// hand shake
const answer = (email, answer) => {
    var conn = active[email]; 
				
    if(conn != null) { 
        send(conn, { 
            type: "answer", 
            answer: answer 
        }); 
    } 
}

wss.on('connection', (connection) => {
    console.log('connection established');

    connection.on('message', (msg) => {
        var data = {};
        try {
            data = JSON.parse(msg);
        } catch(e) {
            console.log('unable to parse data', msg);
            data = {};
            return;
        }

        if (data.type === 'register') {
            register(connection, data.email);
        } else if (data.type === 'login') {
            login(connection, data.email, true);
            if (!active[data.email]) {connection.email = data.email; console.log('from ',data.email);}
        } else if (data.type === 'disconnect') {
            console.log('disconnect from base', data);
            disconnect(connection, data.email);
        } else if (data.type === 'msg') {
            msg(connection, data);
        } else if (data.type === 'candidate') {
            candidate(data.email, data.candidate);
        } else if (data.type === 'offer') {
            offer(data.email, data.offer, connection.email);
            if (active[data.email] != null) connection.otherName = data.email; 
        } else if (data.type === 'answer') {
            answer(data.email, answer);
            if (active[data.email] != null) connection.otherName = data.email; 
        }
    });

    connection.on('close', () => {
        console.log(connection.email);
        if (connection.email) {
            console.log('discv from');
            disconnect(connection, connection.email);
        }
    })

    connection.send(JSON.stringify({
        status: 'success',
        message: 'Message from socket server'
    }));
});

server.listen(port, () => {
    console.log('started listening port');
})



// Send to single user
// function sendTo(connection, message) { 
//     connection.send(JSON.stringify(message)); 
// }

// wss.on('connection', (connection) => {
//     var data; 
    
//     // on message
//     connection.on('message', msg => {

//         // validatinf the data is valid json
//         try {
//             data = JSON.parse(msg);
//         } catch (e) {
//             console.log(e);
//             data = {};
//         }

//         // Login
//         if (data.type === 'login') {
//             console.log('user logged', data.name);

//             if (users[data.name]) {
//                 sendTo(connection, {
//                     type: "login",
//                     success: false,
//                 });
//             } else {
//                 users[data.name] = connection; 
//                 connection.name = data.name;
//                 sendTo(connection, { 
//                     type: "login", 
//                     success: true 
//                  });
//             }
//         } 

//         // Offer the user
//         else if (data.type === 'offer') {
//             console.log('sending offer');

//             var conn = users[data.name]; 
	
//             if(conn != null) { 

//                connection.otherName = data.name; 
//                sendTo(conn, { 
//                   type: "offer", 
//                   offer: data.offer, 
//                   name: connection.name 
//                });
//             }	
//         }

//         // answer
//         else if (data.type === 'answer') {
//             console.log("Sending answer to: ", data.name); 
            
//             var conn = users[data.name]; 
//             if(conn != null) { 
//                 connection.otherName = data.name;
//                 sendTo(conn, { 
//                     type: "answer", 
//                     answer: data.answer 
//                 }); 
//             }
//         }

//         // candidate
//         else if (data.type === 'candidate') {
//             console.log("Sending candidate to:",data.name); 
            
//             var conn = users[data.name];
//             if(conn != null) { 
//                 sendTo(conn, { 
//                     type: "candidate", 
//                     candidate: data.candidate 
//                 }); 
//             }
//         }
         
//         // leave
//         else if (data.type === 'leave') {
//             console.log("Disconnecting from", data.name); 

//             var conn = users[data.name]; 
//             conn.otherName = null; 
				
//             if(conn != null) { 
//                sendTo(conn, { 
//                   type: "leave" 
//                }); 
//             }  
//         }
//         // Something went wrong
//         else {
//             sendTo(connection, { 
//                 type: "error", 
//                 message: "Command no found: " + data.type 
//              });
//         }

//         // }
//     })

//     // on close
//     connection.on('close', () => {
//         console.log('closed connection', connection.name);

//         if(connection.name) { 
//             delete users[connection.name]; 
               
//             if(connection.otherName) { 
//                console.log("Disconnecting from ", connection.otherName); 
//                var conn = users[connection.otherName]; 
//                conn.otherName = null;  
                   
//                if(conn != null) { 
//                   sendTo(conn, { 
//                      type: "leave" 
//                  }); 
//                }  
//             } 
//         }
//     })

//     // On send
//     connection.send(
//         JSON.stringify({
//             type: 'connect',
//             message: new Date().getTime(),
//         })
//     );
// })



// app.get('/', (req, res) => {
//     res.send('<h1>Ready to build to gather man!!!!!!</h1>');
// })

// app.get('/techbuddies', (req, res) => {
//     res.send('<h1>Awesome buddies!!!!!!</h1>');
// })

// app.listen(port, () => {
//     console.log(`Gather node app listening ${port}`);
// })