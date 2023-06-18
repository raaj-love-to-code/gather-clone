// var localVideo;
// var remoteVideo;
// var name;
// var connectedUser; 

// var yourConn; 
// var stream;
// $(document).ready(() => {
//     const connection = initWebSocket();

//     localVideo = document.querySelector('#localVideo'); 
//     remoteVideo = document.querySelector('#remoteVideo');

//     const userData = localStorage.getItem('userData');

//     if (!userData) {
//         alert('Something went wrong!, login again');
//         window.location.href = 'http://localhost:8000/src/html/gather.html';
//     } else {
//         setMembers(JSON.parse(userData));
//     }

//     initClickListner(JSON.parse(userData).activeUsers);

//     // Logout click
//     $('#btnLogout').click(() => {
//         console.log('log out', JSON.parse(userData).email);
//         connection.send(JSON.stringify({
//             type: 'disconnect',
//             email: JSON.parse(userData).email
//         }));
//     });
// });

// const initClickListner = (activeUsers) => {
//     activeUsers.forEach((data) => {
//         $(`#${data}`).click(() => {
//             handleClick(data);
//         });
//     })
// }

// const handleClick = (data) => {
//     console.log('click handle', data);
//     connectedUser = data;
//     yourConn.createOffer(function (offer) { 
//         send(JSON.stringify({ 
//            type: "offer", 
//            offer: offer 
//         })); 
           
//         yourConn.setLocalDescription(offer); 
           
//      }, function (error) { 
//         alert("Error when creating an offer"); 
//      });  
// }

// // Set members
// const setMembers = (userData) => {
//     let activeUserMarkup = ``;
//     let offlineUserMarkup = ``;
//     console.log(userData.activeUsers);
//     userData.activeUsers.forEach((data) => {
//         activeUserMarkup += `<p id="${data}" class="members">${data}</p>`
//     });
//     userData.offlineUsers.forEach((data) => {
//         offlineUserMarkup += `<p class="members">${data}</p>`
//     });
//     $('#online-members-container').html(activeUserMarkup);
//     $('#offline-members-container').html(offlineUserMarkup);
// }

// // Initiate web socket
// const initWebSocket = () => {
//     const connection = new WebSocket('ws://localhost:9000');

//     connection.onopen = () => {
//         console.log('connected to signalling server');
//     }

//     connection.onmessage = (msg) => {
//         console.log('message from web socket server');
        
//         let message = {};
//         try {
//             message = JSON.parse(msg.data);
//         } catch (e) {
//             console.log('Parse error', e);
//             return;
//         }
//         console.log(message);

//         if (message.type === 'disconnect') {
//             if (message.status === 'success') {
//                 window.location.href = 'http://localhost:8000/src/html/gather.html';
//             } else {
//                 alert('somthing went wrong, try again');
//             }
//         } else if (message.type === 'offer') {
//             handleOffer(data.offer, data.email); 
//         } else if (message.type === 'answer') {
//             handleAnswer(data.answer);
//         } else if (message.type === 'candidate') {
//             handleCandidate(data.candidate); 
//         }
//     }

//     return connection;
// }

// // Offer
// const handleOffer = (offer, email) => {
//     connectedUser = email; 
//     yourConn.setRemoteDescription(new RTCSessionDescription(offer));
     
//     //create an answer to an offer 
//     yourConn.createAnswer(function (answer) { 
//        yourConn.setLocalDescription(answer); 
         
//        send(stringify({ 
//           type: "answer", 
//           answer: answer 
//        })); 
         
//     }, function (error) { 
//        alert("Error when creating an answer"); 
//     }); 
// }

// // answer
// function handleAnswer(answer) { 
//     yourConn.setRemoteDescription(new RTCSessionDescription(answer));
//  }

//  function handleCandidate(candidate) { 
//     yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
//  };

// // Start streaming
// const startStreaming = () => {

//      navigator.webkitGetUserMedia({ video: true }, (myStream) => {
//         stream = myStream; 
//         localVideo.src = window.URL.createObjectURL(stream);
			
//         var configuration = { 
//             "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }] 
//         }; 
			
//         yourConn = new webkitRTCPeerConnection(configuration);
			
//         yourConn.addStream(stream); 

//         yourConn.onaddstream = function (e) { 
//             remoteVideo.src = window.URL.createObjectURL(e.stream); 
//         };
//         yourConn.onicecandidate = function (event) {
			
//             if (event.candidate) { 
//                send(JSON.stringify({ 
//                   type: "candidate", 
//                   candidate: event.candidate 
//                })); 
//             } 
//          };
//      })
// }

$(document).ready(() => {
    var email;
    var connectedUser;

    var conn = new WebSocket('ws://localhost:9000');

    var userData = localStorage.getItem('userData');

    if (!userData) {
        alert('Something went wrong!, login again');
        window.location.href = 'http://localhost:8000/src/html/gather.html';
    }

    userData = JSON.parse(userData);

    email = userData.email;

    conn.onopen = () => console.log('Connection extablished with signaling server');

    conn.onmessage = (msg) => {
        console.log('got messgae', msg);

        var data = JSON.parse(msg.data);

        if (data.type === 'login') {
            handleLogin(data.success);
        } else if (data.type === 'offer') {
            handleOffer(data.offer, data.email);
        } else if (data.type === 'answer') {
            handleAnswer(data.answer);
        } else if (data.type === 'candidate') {
            handleCandidate(data.candidate);
        }
    };

    conn.onerror = (err) => console.log('got error', err);

    const send = (message) => {
        if (connectedUser) {
            message.name = connectedUser;
        }
        conn.send(JSON.stringify(message));
    }

    var localVideo = document.querySelector('#localVideo'); 
    var remoteVideo = document.querySelector('#remoteVideo');

    var yourConn; 
    var stream;

    navigator.webkitGetUserMedia({ video: true, audio: true}, (myStream) => {
        stream = myStream;

        localVideo.srcObject = stream;
        var configuration = { 
            "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]  
        }; 

        yourConn = new webkitRTCPeerConnection(configuration);

        yourConn.addStream(stream); 

        yourConn.onaddstream = function (e) { 
            remoteVideo.srcObject = e.stream;
        };

        yourConn.onicecandidate = function (event) {
                
            if (event.candidate) { 
            send({ 
                type: "candidate", 
                candidate: event.candidate 
            }); 
            }       
        };
    }, function (error) { 
        console.log(error); 
    });

    $('#call').click(() => {
        connectedUser = 'raaj';
        console.log('clicked calll button');
        yourConn.createOffer(function (offer) { 
            send({ 
                type: "offer", 
                offer: offer 
            }); 
            
            yourConn.setLocalDescription(offer); 
            
        }, function (error) { 
            alert("Error when creating an offer", error); 
        });  
    });

    function handleOffer(offer, name) { 
        connectedUser = name; 
        yourConn.setRemoteDescription(new RTCSessionDescription(offer));
        
        yourConn.createAnswer(function (answer) { 
        yourConn.setLocalDescription(answer); 
            
        send({ 
            type: "answer", 
            answer: answer 
        }); 
            
        }, function (error) { 
        alert("Error when creating an answer", error); 
        }); 
    };

    function handleAnswer(answer) { 
        yourConn.setRemoteDescription(new RTCSessionDescription(answer));
    }; 
    
    function handleCandidate(candidate) { 
        yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
    };

});