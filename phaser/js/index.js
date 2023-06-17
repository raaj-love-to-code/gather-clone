$(document).ready(() => {
    var config = {
        type: Phaser.AUTO,
        width: '100%',
        height: 400,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    
    var game = new Phaser.Game(config);
    
    function preload ()
    {
        this.load.image('sky', '../assets/bg.png');
    }
    
    function create ()
    {
        this.add.image(500, 200, 'sky');
    }
    
    function update ()
    {
    }
});