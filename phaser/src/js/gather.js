$(document).ready(() => {
    var cameraState = false;
    // var login = false;
    $('#error').attr('hidden', 'true');

    const ws = initWebSocket();
    // To turn On and Off the video
    $('#video-btn').click(() => {
        console.log('clicked');
        if (cameraState) {
            $('#video-btn').attr('src', '../../assets/video-turn-off.png');
            cameraState = false;
            stopCamera();
        } else {
            $('#video-btn').attr('src', '../../assets/video-turn-on.png');
            cameraState = true;
            startCamera();
        }
    })

    $('#btnSubmit').click(async () => {
        // Validation must be done here
        ws.send(JSON.stringify({
            type: 'login',
            email: $('#userid').val()
        }));
    })

    $('#userid').click(() => {
        $('#error').attr('hidden', 'true');
    })

    const startCamera = () => {
        console.log('started');
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then((stream) => {
                    console.log('found');
                    document.querySelector('#my-video').srcObject = stream;
                })
                .catch((error) => {
                    console.log('error playing media', error);
                })
        }
    }

    const stopCamera = () => {
        console.log('stopped');
        const tracks = document.querySelector('#my-video').srcObject.getTracks();
        tracks[0].stop();
    }

});

const initWebSocket = () => {
    const connection = new WebSocket('ws://localhost:9000');

    connection.onopen = () => {
        console.log('connected to signalling server');
    }

    connection.onmessage = (msg) => {
        console.log('message from web socket server');
        
        let message = {};
        try {
            message = JSON.parse(msg.data);
        } catch (e) {
            console.log('Parse error', e);
            return;
        }
        console.log(message);
        if (message.type === 'login') {
            if (message.status === 'success') {
                message.email = $('#userid').val();
                localStorage.setItem('userData', JSON.stringify(message));
                window.location.href = 'http://localhost:8000/src/html/ground.html';
            } else if (message.status === 'already_active'){
                $('#error').attr('hidden', false);
                $('#error').text('Already user is active');
            }
        } else if (message.type === 'register') {
            if (message.status === 'success') {
                $('#error').attr('hidden', false);
                $('#error').css('color', 'green');
                $('#error').text('New user registered success, login to continue');
            } else {
                $('#error').attr('hidden', 'false');
                $('#error').css('color', 'red');
                $('#error').val = 'SOmething went wrong! try again';
            }
        }
    }

    return connection;
}