var height = 50,
    width = 30,
    marking,
    action;



///////////////////////////////listeners
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

document.getElementById("start").addEventListener("click", function(){
    marking(width, height);
    action(width, height);
});

document.getElementById("clear").addEventListener("click", function(){
   
    var cells = document.getElementById("gridContainer").children;
    
    for (let i = width*height; i >= 1; i--) {
        cells[i].classList.remove("alive");
    }
});






grid = function createGrid(width, height) {
    for (let i = width; i >= 1; i--) {
        for (let j = height; j >= 1; j--) {            
            
            if (j == height) {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div><br>');
            } else {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div>');
            }
        }
    }
}

marking = function newCicle(width, height) {
    var adjacentLiveCells,    
        line,
        column,        
        idSplit;
    for (let i = width; i >= 1; i--) {
        for (let j = height; j >= 1; j--) {            
            adjacentLiveCells = 0;
            
            for (let adjX = -1; adjX <= 1; adjX++) {
                for (let adjY = -1; adjY <= 1; adjY++) {
                    if (adjX != 0 || adjY != 0) {  
                        idSplit = document.getElementById(i + "-" + j).id.split("-");
                        console.log()
                        line = Number(idSplit[0]);
                        column = Number(idSplit[1]);
                        if ( (line + adjX > 0) && (column + adjY > 0) && (line + adjX <= width) && (column + adjY <= height) && document.getElementById((line + adjX) + "-" + (column + adjY)).classList.contains("alive")) {
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

action = function createGrid(width, height) {
    for (let i = width; i >= 1; i--) {
        for (let j = height; j >= 1; j--) {            
            
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

grid(width, height);