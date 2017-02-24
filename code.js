var width = 40,
    height = 40,
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








grid = function createGrid(width, height) {
    for (let i = height; i >= 1; i--) {
        for (let j = width; j >= 1; j--) {            
            
            if (j == width) {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div class = "cell cell-' + i + '-' + j + '      -"></div><br>');
            } else {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div class = "cell cell-' + i + '-' + j + '      -"></div>');
            }
        }
    }
}







marking = function newCicle(width, height) {
    var adjacentLiveCells,    
        line,
        column,        
        classSplit;
    for (let i = height; i >= 1; i--) {
        for (let j = width; j >= 1; j--) {            
            adjacentLiveCells = 0;
            
            for (let adjX = -1; adjX <= 1; adjX++) {
                for (let adjY = -1; adjY <= 1; adjY++) {
                    if (adjX != 0 || adjY != 0) {  
                        classSplit = document.querySelector(".cell-" + i + "-" + j).classList.value.split("-");
                        line = Number(classSplit[1]);
                        column = Number(classSplit[2]);
                        if ( (line + adjX > 0) && (column + adjY > 0) && (line + adjX <= width) && (column + adjY <= height) && document.querySelector(".cell-" + (line + adjX) + "-" + (column + adjY)).classList.contains("alive")) {
                            adjacentLiveCells++
                        } 
                    }
                }
            }
            //console.log("adjacent live cells" + adjacentLiveCells);
            if (adjacentLiveCells < 2 || adjacentLiveCells > 3) {
                document.querySelector(".cell-" + i + "-" + j).classList.add("willDie");    
            } else if (adjacentLiveCells == 3) {
                if (!document.querySelector(".cell-" + i + "-" + j).classList.contains("alive")); {
                    document.querySelector(".cell-" + i + "-" + j).classList.add("becomeAlive");
                }
                
            }
        }
    }
}

action = function createGrid(width, height) {
    for (let i = height; i >= 1; i--) {
        for (let j = width; j >= 1; j--) {            
            
            if (document.querySelector(".cell-" + i + "-" + j).classList.contains("willDie")) {
                document.querySelector(".cell-" + i + "-" + j).classList.remove("alive");
                document.querySelector(".cell-" + i + "-" + j).classList.remove("willDie");
                
            } else if (document.querySelector(".cell-" + i + "-" + j).classList.contains("becomeAlive")) {
                document.querySelector(".cell-" + i + "-" + j).classList.add("alive");
                document.querySelector(".cell-" + i + "-" + j).classList.remove("becomeAlive");
            }
        }
    }
}

grid(width, height);