$(document).ready(() => {
    var config = {
        type: Phaser.AUTO,
        // width: 1000,
        // height: 580,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
        this.load.image('background', '../../assets/background.png');

        // this.load.spritesheet('dude','../../assets/dude.png', { frameWidth: 58, frameHeight: 120 });
        this.load.spritesheet('dude','../../assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('single-front', '../../assets/single-front.png', {frameWidth: 32, frameHeight: 48});
    }

    var player1;
    var player2;
    function create ()
    {
        this.add.image(400,200, 'background');

        // platforms = this.physics.add.staticGroup();
        // player = this.physics.add.sprite(100, 450, 'dude');
        player1 = this.physics.add.sprite(100, 450, 'dude');
        player2 = this.physics.add.sprite(500, 450, 'single-front');
        player1.setPosition(200,300);
        player2.setPosition(150,300);
        player1.setBounce(0);
        // player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('single-front', { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'single-front', frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'up',
        //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        //     // frames: [ { key: 'dude', frame: 4 } ],
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'down',
        //     frames: this.anims.generateFrameNumbers('dude', { start: 10, end: 12 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        cursors = this.input.keyboard.createCursorKeys();
    }

    function update ()
    {
        const speed = 160;
        // const prevVelocity = player.body.velocity.clone();
        // player.body.setVelocity(0);

        if (cursors.left.isDown) {
            console.log("left");
            // player.setVelocityX(-100);
            player1.setVelocityX(-speed);

            player1.anims.play('left', true);
        } else if (cursors.right.isDown) {
            // player.setVelocityX(80);
            player1.setVelocityX(speed);

            player1.anims.play('right', true);
        }
        // else if (cursors.up.isDown) {
        //     // player.setVelocityX(-150);
        //     player.setVelocityX(-speed);

        //     player.anims.play('up', true);
        // }
        // else if (cursors.down.isDown) {
        //     // player.setVelocityX(80);
        //     // player.setVelocityX(speed);

        //     player.anims.play('down', true);
        // }
        else {
            player1.setVelocityX(0);
            player2.setVelocityX(0);

            player1.anims.play('turn');
            player2.anims.play('turn');
        }

        // if (cursors.up.isDown && player.body.touching.down)
        // {
        //     player.setVelocityY(-330);
        // }
    }
});