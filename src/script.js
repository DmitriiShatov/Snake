import _ from 'lodash';
import { Food,Snake } from "./snake.js";
function useStrict(){
    return 'use strict';
}
console.log(useStrict());

    //get document elements
let color = document.getElementById("color");   // get data from HTML
let field = document.getElementById("field");
let width = document.getElementById("width");
let score = document.getElementById("score");
let speed = document.getElementById("speed");
let button = document.getElementById("start_pause");
let best_score = document.getElementById('best');
let saved_best_score = localStorage.getItem('best');
if(saved_best_score){
    best_score.innerHTML = saved_best_score;
}
let isPausa = false;
let box = 16;
let game;

width.addEventListener("change",function(){         // set new width and height when resizing
    let wid = this.value;
    field.style["width"] = wid + 'px';
    field.style["height"] = wid / 2 + 'px';
});

function setFailed(ctx, button, width, speed, color){
    ctx.fillStyle = "red";
    ctx.font = "30px Verdana"           // set text when lose
    ctx.fillText("YOU LOSE!",65,65);

    button.innerHTML = "START";

    width.disabled = false;
    speed.disabled = false;
    color.disabled = false;

    let best = localStorage.getItem('best');
    let new_score = score.innerHTML;
    if(best != null){
        if(Number(new_score) > Number(best)){
            localStorage.setItem('best',new_score);     // set best score
            best_score.innerHTML = new_score;
        }
        else{
            best_score.innerHTML = best;
        }
    }
    else{
        localStorage.setItem('best',new_score);
        best_score.innerHTML = new_score;
    }
}



button.addEventListener("click", function(){
    if(this.innerHTML.toLocaleLowerCase() == 'start'){
        this.innerHTML = 'PAUSE';
        width.disabled = true;
        speed.disabled = true;
        color.disabled = true;
        if(isPausa){                // if it was not pausa - cleare local storage
            isPausa = false;
        }
        else{
            localStorage.removeItem('snake');
            localStorage.removeItem('direction');
            localStorage.removeItem('food_x');
            localStorage.removeItem('food_y');
            localStorage.removeItem('score');
        }

        let field_width = field.width;
        let field_height = field.height;
        let snake_color = color.value;

        let ctx = field.getContext("2d");

        let storage_snake = localStorage.getItem('snake');              // recieve storage data
        let storage_direction = localStorage.getItem('direction');
        let storage_food_x = localStorage.getItem('food_x');
        let storage_food_y = localStorage.getItem('food_y');
        let storage_score = localStorage.getItem('score');

        let food = new Food(field_width,field_height,box);              // initializang data
        let currentSpeed = 500 - (speed.value * 20);
        let snake = new Snake(field_width,field_height,box,snake_color,currentSpeed,ctx);
        
        if(storage_snake !== null 
            && storage_direction !== null 
            && storage_food_x !== null          //check was data in storage
            && storage_food_y !== null 
            && storage_score !== null)
        {
            snake.snake = JSON.parse(storage_snake);
            snake.direction = storage_direction;        //set position of food and snake leng with position
            food.x = Number(storage_food_x);
            food.y = Number(storage_food_y);   
            snake.score = Number(storage_score);
        }
        

        document.addEventListener("keydown",snake.moveSnake); 
        ctx.clearRect(0,0,field_width,field_height);    

        let rect;

        let changePositionOfFood = (field_width,field_height,food,snake) => {
            for(let i = 0; i < snake.snake.length; i++){                     // change position food if coodi
                if(snake.snake[i].x == food.x && snake.snake[i].y == food.y){
                     
                    food = new Food(field_width,field_height,box);
                    return changePositionOfFood(field_width,field_height,food,snake);
                }
                else{
                    
                    return food;
                }
            }
        }

        function drawGame(){                                // draw game 
            if(rect != undefined){
                ctx.clearRect(rect.x, rect.y, box, box);    
            }
            
            
            ctx.drawImage(food.foodImg,food.x,food.y);
            
        
            snake.changeColor();
            
        
            let snakeX = snake.snake[0].x;
            let snakeY = snake.snake[0].y;
            
            if(snakeX == food.x && snakeY == food.y){
                score.innerHTML = ++snake.score;
                food = changePositionOfFood(field_width,field_height,food,snake);
            }
            else{
                rect = snake.sneakPop();
            }
        
            if(snakeX < 0 || snakeX > field_width - box                 //stop game if we beat wall
                || snakeY < 0 || snakeY > field_height - box){
                    clearInterval(game);
                    setFailed(ctx, button,width,speed,color);
                    score.innerHTML = 0;
                }
        
            if(snake.direction == 'left') snakeX -= box;
            if(snake.direction == 'right') snakeX += box;
            if(snake.direction == 'up') snakeY -= box;
            if(snake.direction == 'down') snakeY += box;
        
            for(let i = 0; i < snake.snake.length; i++){                        //stop game if we eat tail
                if(snakeX == snake.snake[i].x && snakeY == snake.snake[i].y){
                    clearInterval(game);
                    setFailed(ctx, button,width,speed,color);
                    score.innerHTML = 0;
                }
            }
        
            snake.setHead(snakeX,snakeY);
            localStorage.setItem('snake',JSON.stringify(snake.snake));
            localStorage.setItem('direction', snake.direction);
            localStorage.setItem('food_x',food.x);
            localStorage.setItem('food_y',food.y);
            localStorage.setItem('score',snake.score);
        }

        game = setInterval(drawGame,currentSpeed);

    }
    else{
        this.innerHTML = 'START';
        width.disabled = false;
        speed.disabled = false;
        color.disabled = false;
        
        isPausa = true;

        clearInterval(game);
    }
})






