

class Snake{
    constructor(field_x,field_y,box_size, color, speed, _ctx){
        this.snake = [];
        this.snake[0] = {
            x: Math.floor((field_x / 32)) * box_size,
            y: Math.floor((field_y / 32)) * box_size
        };
        this.snake_color = color;
        this.snake_speed = speed;
        this.score = 0;
        this.ctx = _ctx;
        this.box = box_size;
        this.direction = '';
    };

    moveSnake = (event) =>{
        if(event.keyCode == 37 && this.direction != 'right'){
            this.direction = 'left';
        }
        else if(event.keyCode == 38 && this.direction != 'down'){
            this.direction = 'up';
        }
        else if(event.keyCode == 39 && this.direction != 'left'){
            this.direction = 'right';
        }
        else if(event.keyCode == 40 && this.direction != 'up'){
            this.direction = 'down';
        }
    };

    changeColor = () => {
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        if(this.direction == '' || this.direction == 'up'){
            this.ctx.roundRect(this.snake[0].x,this.snake[0].y,this.box,this.box,[10,10,0,0]);
        }
        else if(this.direction == 'left'){
            this.ctx.roundRect(this.snake[0].x,this.snake[0].y,this.box,this.box,[10,0,0,10]);
        }
        else if(this.direction == 'right'){
            this.ctx.roundRect(this.snake[0].x,this.snake[0].y,this.box,this.box,[0,10,10,0]);
        }
        else if(this.direction == 'down'){
            this.ctx.roundRect(this.snake[0].x,this.snake[0].y,this.box,this.box,[0,0,10,10]);
        }
        this.ctx.fill();
        this.ctx.stroke();
        for(let i = 1; i < this.snake.length; i++){
            this.ctx.fillStyle = this.snake_color;
            this.ctx.fillRect(this.snake[i].x,this.snake[i].y,this.box,this.box);
        }
    };

    setHead = (headX, headY) => {
        let newHead = {
            x:headX,
            y:headY
        }
        this.snake.unshift(newHead);
    }

    sneakPop = () => {
        return this.snake.pop();
    }
}

class Food{
    foodImg = new Image();
    x;
    y;
    constructor(field_x,field_y,box_size){
        this.foodImg.src = "../img/food.png"
        this.x = Math.floor((Math.random() * Math.floor((field_x / 16)))) * box_size;
        this.y = Math.floor((Math.random() * Math.floor((field_y / 16)))) * box_size;
    };
}

export {Food, Snake};