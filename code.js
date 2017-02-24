var col = 20,
    line = 30,
    marking,
    action,
    start;



///////////////////////////////LISTENERS///////////////////////////////
//////////////////////////////////////////////////////////////////////

//listener to the cells
document.getElementById("gridContainer").addEventListener("click", function(e){
    var clickedItem;
    if (e.target.classList.contains("cell")) {
        if (e.target !== e.currentTarget) {
            clickedItem = e.target;                    
        }
        e.stopPropagation();
    }
    
    if (e.target.classList.contains("cell")) {        
        e.target.classList.toggle("alive");        
    }             
});

//start the simulation
document.getElementById("start").addEventListener("click", function(){
    start = setInterval(function() {
        marking(col, line);
        action(col, line);
    },100);
});

//pause the simulation
document.getElementById("pause").addEventListener("click", function(){
    clearInterval(start);
});

//clear the board
document.getElementById("clear").addEventListener("click", function(){
   
    var cells = document.getElementById("gridContainer").children; 
    
    for (let i = 0; i <= ((col * line)); i++) {
        console.log(i + "childrens");
        cells[i].classList.remove("alive");
    }
});

//change the width of the matrix
document.getElementById("cols").addEventListener("change", function(){
    col = document.getElementById("cols").value;
    document.getElementById("gridContainer").innerHTML="";
    grid(col, line);
});

//change the height of the matrix
document.getElementById("lines").addEventListener("change", function(){
    line = document.getElementById("lines").value;
    document.getElementById("gridContainer").innerHTML="";
    grid(col, line);
});

//randomly populate the matrix
document.getElementById("random").addEventListener("click", function(){
    for (let i = line; i >= 1; i--) {
        for (let j = col; j >= 1; j--) {            
            
            rand = Math.random();
            if (rand > 0.5) {
                document.getElementById(i + "-" + j).classList.add("alive");
            }
        }
    }
});

///////////////////////////////FUNCTIONS///////////////////////////////
///////////////////////////////////////////////////////////////////////


grid = function createGrid(col, line) {
    for (let i = line; i >= 1; i--) {
        for (let j = col; j >= 1; j--) {            
            
            if (j == col) {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div><br>');
            } else {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div>');
            }
        }
    }
}

marking = function newCicle(col, line) {
    var adjacentLiveCells,    
        IdLine,
        IdColumn,        
        idSplit;
    for (let i = line; i >= 1; i--) { //i = y, j= x / i= linha, j = coluna
        for (let j = col; j >= 1; j--) {            
            adjacentLiveCells = 0;
            
            for (let adjY = -1; adjY <= 1; adjY++) {
                for (let adjX = -1; adjX <= 1; adjX++) {
                    if (adjX != 0 || adjY != 0) {  
                        idSplit = document.getElementById(i + "-" + j).id.split("-");
                        IdLine = Number(idSplit[0]);
                        IdColumn = Number(idSplit[1]);
                        if ( (IdLine + adjY > 0) && (IdColumn + adjX > 0) && (IdLine + adjY <= line) && (IdColumn + adjX <= col) && document.getElementById((IdLine + adjY) + "-" + (IdColumn + adjX)).classList.contains("alive")) {
                            adjacentLiveCells++
                        } 
                    }
                }
            }
            //console.log("adjacent live cells" + adjacentLiveCells);
            if (adjacentLiveCells < 2 || adjacentLiveCells > 3) {
                document.getElementById(i + "-" + j).classList.add("willDie");    
            } else if (adjacentLiveCells == 3) {
                if (!document.getElementById(i + "-" + j).classList.contains("alive")); {
                    document.getElementById(i + "-" + j).classList.add("becomeAlive");
                }
                
            }
        }
    }
}

action = function createGrid(col, line) {
    for (let i = line; i >= 1; i--) {
        for (let j = col; j >= 1; j--) {            
            
            if (document.getElementById(i + "-" + j).classList.contains("willDie")) {
                document.getElementById(i + "-" + j).classList.remove("alive");
                document.getElementById(i + "-" + j).classList.remove("willDie");
                
            } else if (document.getElementById(i + "-" + j).classList.contains("becomeAlive")) {
                document.getElementById(i + "-" + j).classList.add("alive");
                document.getElementById(i + "-" + j).classList.remove("becomeAlive");
            }
        }
    }
}

grid(col, line);