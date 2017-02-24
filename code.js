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
    },50);
    document.getElementById("start").classList.toggle("hidden");
    document.getElementById("pause").classList.toggle("hidden");
});

//pause the simulation
document.getElementById("pause").addEventListener("click", function(){
    clearInterval(start);
    document.getElementById("start").classList.toggle("hidden");
    document.getElementById("pause").classList.toggle("hidden");
});

//clear the board
document.getElementById("clear").addEventListener("click", function(){
    remove();
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
    remove();
    for (let i = line; i >= 1; i--) {
        for (let j = col; j >= 1; j--) { 
            rand = Math.random();
            if (rand > 0.5) {
                document.getElementById(i + "-" + j).classList.add("alive");
            }
        }
    }
});

//randomly populate the matrix
document.getElementById("preset1").addEventListener("click", function(){
    preset1()
});

///////////////////////////////FUNCTIONS///////////////////////////////
///////////////////////////////////////////////////////////////////////


grid = function createGrid(col, line) {
    for (let i = line; i >= 1; i--) {
        for ( let j = col; j >= 1; j--) {            
            
            if (j == col) {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div><br>');
            } else {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div>');
            }
        }
    }
    console.log(document.getElementById("1-1"));
    console.log(document.getElementById("1-" + col));
    document.getElementById("1-1").classList.add("firstRow-first");
    document.getElementById("1-" + col).classList.add("firstRow-last");
    document.getElementById(line + "-1").classList.add("lastRow-first");
    document.getElementById(line + "-" + col).classList.add("lastRow-last");
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

remove = function() {
    var cells = document.getElementById("gridContainer").children;    
    for (let i = 0; i <= (cells.length-1); i++) {        
        cells[i].classList.remove("alive");
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

preset1 = function() {
    //central cell
    document.getElementById((Math.round(line/2) + 0) + "-" + (Math.round(col/2) + 0)).classList.add("alive");
    
    //central line 
    document.getElementById((Math.round(line/2) + 1) + "-" + Math.round(col/2)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 2)  + "-" + Math.round(col/2)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 3)  + "-" + Math.round(col/2)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 4)  + "-" + Math.round(col/2)).classList.add("alive"); 
    document.getElementById((Math.round(line/2) - 1)  + "-" + Math.round(col/2)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 2) + "-" + Math.round(col/2)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 3) + "-" + Math.round(col/2)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 4) + "-" + Math.round(col/2)).classList.add("alive");
    
    // central col
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) + 1)).classList.add("alive");
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) + 2)).classList.add("alive");
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) + 3)).classList.add("alive");
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) + 4)).classList.add("alive");
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) - 1)).classList.add("alive");
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) - 2)).classList.add("alive");
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) - 3)).classList.add("alive");
    document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) - 4)).classList.add("alive");
    
    //line and col terminations
    document.getElementById((Math.round(line/2) + 4)  + "-" + (Math.round(col/2) + 1)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 4)  + "-" + (Math.round(col/2) - 1)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 4) + "-" + (Math.round(col/2) + 1)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 4) + "-" + (Math.round(col/2) - 1)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 1) + "-" + (Math.round(col/2) + 4)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 1) + "-" + (Math.round(col/2) + 4)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 1) + "-" + (Math.round(col/2) - 4)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 1) + "-" + (Math.round(col/2) - 4)).classList.add("alive");
    
    //connecting cells    
    document.getElementById((Math.round(line/2) + 3)  + "-" + (Math.round(col/2) + 2)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 2)  + "-" + (Math.round(col/2) + 3)).classList.add("alive");
    
    document.getElementById((Math.round(line/2) - 3)  + "-" + (Math.round(col/2) - 2)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 2)  + "-" + (Math.round(col/2) - 3)).classList.add("alive");
    
    document.getElementById((Math.round(line/2) - 3)  + "-" + (Math.round(col/2) + 2)).classList.add("alive");
    document.getElementById((Math.round(line/2) - 2)  + "-" + (Math.round(col/2) + 3)).classList.add("alive");
    
    document.getElementById((Math.round(line/2) + 3)  + "-" + (Math.round(col/2) - 2)).classList.add("alive");
    document.getElementById((Math.round(line/2) + 2)  + "-" + (Math.round(col/2) - 3)).classList.add("alive");
    
}

grid(col, line);