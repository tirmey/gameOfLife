var col = 20,
    line = 30,
    marking,
    action,
    start;

///////////////////////////////LISTENERS///////////////////////////////
//////////////////////////////////////////////////////////////////////

//listener apply to the cell container the cells
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

//BUTTON START - start the simulation
document.getElementById("start").addEventListener("click", function(){
    startPause();
    document.getElementById("start").classList.toggle("hidden");
    document.getElementById("pause").classList.toggle("hidden");
});

//BUTTON PAUSE - pause the simulation
document.getElementById("pause").addEventListener("click", function(){
    clearInterval(start);
    document.getElementById("start").classList.toggle("hidden");
    document.getElementById("pause").classList.toggle("hidden");
});

//SPACEBAR - start and pause the simulation
document.addEventListener("keypress", function(e){
    
    if (e.keyCode == 32) {
        if (document.getElementById("start").classList.contains("hidden")) {
            clearInterval(start)
            document.getElementById("start").classList.toggle("hidden");
            document.getElementById("pause").classList.toggle("hidden");
        } else {
            startPause();
            document.getElementById("start").classList.toggle("hidden");
            document.getElementById("pause").classList.toggle("hidden");
        }
    }
});

//BUTTON CLEAR - clear the board
document.getElementById("clear").addEventListener("click", function(){
    remove();
});

//BUTTON RANDOM - randomly populate the matrix
document.getElementById("random").addEventListener("click", function(){
    remove();
    random();
});

//BUTTON INVERT - randomly populate the matrix
document.getElementById("invert").addEventListener("click", function(){
    invert();
});

//BUTTON PRESET 1 - PReset Pattern 1
document.getElementById("preset1").addEventListener("click", function(){
    preset1()
});


//MENU - give acess to menu items
//listener apply to the cell container the cells
document.getElementById("menu").addEventListener("click", function(e){
    var clickedItem;
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
    
    document.getElementById("menu").classList.add("fade");
    
    console.log (clickedItem);
    if (clickedItem.id == "open-options") {        
        document.getElementById("options").classList.remove("fade"); 
        document.getElementById("about-game").classList.add("fade");
        document.getElementById("about-author").classList.add("fade");
    } else if (clickedItem.id == "open-about-game") {
        document.getElementById("about-game").classList.remove("fade");
        document.getElementById("options").classList.add("fade");
        document.getElementById("about-author").classList.add("fade");
    } else if (clickedItem.id == "open-about-author") {  
        document.getElementById("about-author").classList.remove("fade");
         document.getElementById("options").classList.add("fade");
        document.getElementById("about-game").classList.add("fade");
    }
});

//MENU - closing windows - closing the window
document.getElementById("main-navigation").addEventListener("click", function(e){
    var clickedItem;
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
    
    if (clickedItem.id == "close-options") {
        document.getElementById("options").classList.add("fade"); 
    } else if (clickedItem.id == "close-about-game") {
        document.getElementById("about-game").classList.add("fade");       
    } else if (clickedItem.id == "close-about-author") {
        document.getElementById("about-author").classList.add("fade");
    }
      
    document.getElementById("menu").classList.remove("fade");
});

//INPUT COLUMS - change the width of the matrix
document.getElementById("cols").addEventListener("change", function(){
    col = document.getElementById("cols").value;
    document.getElementById("gridContainer").innerHTML="";
    grid(col, line);
});

//INPUT LINES - change the height of the matrix
document.getElementById("lines").addEventListener("change", function(){
    line = document.getElementById("lines").value;
    document.getElementById("gridContainer").innerHTML="";
    grid(col, line);
});

//SELECT PRESETS
document.getElementById("presets").addEventListener("click", function(e){
    var clickedItem;
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
  
    if (clickedItem.id = "preset1") {   
        remove();
        preset1();      
    } else if (clickedItem.id = "preset2") {
        remove();
       preset2();
    } else if (clickedItem.id = "preset3") { 
        remove();
        preset3();
    } else if (clickedItem.id = "preset4") {
        remove();
        preset4(); 
    }
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

random = function() {
    for (let i = line; i >= 1; i--) {
        for (let j = col; j >= 1; j--) { 
            rand = Math.random();
            if (rand > 0.5) {
                document.getElementById(i + "-" + j).classList.add("alive");
            }
        }
    }
}

invert = function() {
    for (let i = line; i >= 1; i--) {
        for (let j = col; j >= 1; j--) {
            document.getElementById(i + "-" + j).classList.toggle("alive");
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

startPause = function() {
    start = setInterval(function() {
        marking(col, line);
        action(col, line);
    },100);
}



preset1 = function() {
    
    remove();
    //central cell
    document.getElementById((Math.round(line/2) + 0) + "-" + (Math.round(col/2) + 0)).classList.add("alive");
    
    //central line 
    for (let i = 1; i <= 4; i++) {
        document.getElementById((Math.round(line/2) + i) + "-" + Math.round(col/2)).classList.add("alive"); 
        document.getElementById((Math.round(line/2) - i)  + "-" + Math.round(col/2)).classList.add("alive");
    }
    
    // central col
    for (let i = 1; i <= 4; i++) {
        document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) + i)).classList.add("alive");
        document.getElementById(Math.round(line/2) + "-" + (Math.round(col/2) - i)).classList.add("alive");
    }
    
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