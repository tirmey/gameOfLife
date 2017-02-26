

var col = 20,
    line = 30,
    actionVelocity = 50,
    marking,
    random,
    action,
    getPresetPosition,
    insertPreset,   
    start,
    blink;
    
    var presets = {
        
        selectedPreset: "",        
        
        
        presetList: [
        
            {
                src: "img/circleCross.jpg",

                coordinates:
                [[-3,0], [-4,0], [-5,0], [-2,1], [-4,1], [-6,1], [-1,2], [-4,2], [-7,2], [0,3], [-4,3], [-8,3], [0,4], [-1,4], [-2,4], [-3,4], [-4,4], [-5,4], [-6,4], [-7,4], [-8,4], [0,5], [-4,5], [-8,5], [-1,6], [-4,6], [-7,6], [-2,7], [-4,7], [-6,7], [-3,8], [-4,8], [-5,8]],//initialPosition,

                limits: {
                    dX: 8,
                    dY: 8
                }
            },
            
            {
                src: "img/gosperGlider.jpg",
                coordinates:
                [[-4,0], [-5,0], [-4,1], [-5,1], [-3,10], [-4,10], [-5,10], [-2,11], [-6,11], [-1,12], [-7,12], [-1,13], [-7,13], [-4,14], [-2,15], [-6,15], [-3,16], [-4,16], [-5,16], [-4,17], [-5,20], [-6,20], [-7,20], [-5,21], [-6,21], [-7,21], [-4,22], [-8,22], [-3,24], [-4,24], [-8,24], [-9,24], [-6,34], [-7,34], [-6,35], [-7,35]],

                limits: {
                    dX: 35,
                    dY: 9
                }
            }
        ]
    };
///////////////////////////////LISTENERS//////////////////////////////
//////////////////////////////////////////////////////////////////////

//listener apply to the cell container
document.getElementById("gridContainer").addEventListener("click", function(e){
    var clickedItem;
        
    if (e.target.classList.contains("cell")) {
        if (e.target !== e.currentTarget) {
            clickedItem = e.target;                    
        }
        e.stopPropagation();
    }
    
    if(presets.selectedPreset == "") { 
        if (e.target.classList.contains("cell")) {        
            e.target.classList.toggle("alive");        
        }
    } else {
        insertPreset(presets.selectedPreset, clickedItem.id);
    }
});

// to change the color of the cells when hovering to insert pattern
document.getElementById("gridContainer").addEventListener("mouseover", function(e){
    var hoveredItem,
        idSplit,
        idLine,
        preset,
        presetNumber,
        idColumn;
    
    if (e.target.classList.contains("cell")) {
        if (e.target !== e.currentTarget) {
            hoveredItem = e.target;                    
        }
        e.stopPropagation();
    }

    if (hoveredItem) {
        idSplit = hoveredItem.id.split("-");
        idLine = Number(idSplit[0]);
        idColumn = Number(idSplit[1]);
    }

    preset = presets.selectedPreset.split("-")[1];
    presetNumber = Number(preset);
    
    if (presets.selectedPreset != "") {
        if (idLine - presets.presetList[presetNumber].limits.dY > 0 && idColumn + presets.presetList[presetNumber].limits.dX <= col) {
            for (let i = 0; i <= presets.presetList[presetNumber].limits.dX; i++) {
                for (let j = 0; j <= presets.presetList[presetNumber].limits.dY; j++) {                    
                    document.getElementById((idLine - j) + "-" + (idColumn + i)).classList.add("inboard");
                     
                }
            }
        } else {
            for (let i = 0; i <= presets.presetList[presetNumber].limits.dX; i++) {
                for (let j = 0; j <= presets.presetList[presetNumber].limits.dY; j++) {  
                    if ((idLine - j > 0) && (idColumn + i <= col)) {
                        document.getElementById((idLine - j) + "-" + (idColumn + i)).classList.add("outboard");
                    }
                }
            }
        }
    } else {
        if (hoveredItem) {
            document.getElementById(idLine + "-" + idColumn).classList.add("inboard");
        }
    }
});

// to refresh the color of the cells when hovering to insert pattern
document.getElementById("gridContainer").addEventListener("mouseout", function(e){
    var hoveredItem,
        idSplit,
        idLine,
        idColumn,
        preset,
        presetNumber,    
        idLine,
        idColumn;
    
    if (e.target.classList.contains("cell")) {
        if (e.target !== e.currentTarget) {
            hoveredItem = e.target;                    
        }
        e.stopPropagation();
    }

    if (hoveredItem) {
        idSplit = hoveredItem.id.split("-");
        idLine = Number(idSplit[0]);
        idColumn = Number(idSplit[1]);
    }

    preset = presets.selectedPreset.split("-")[1]
    presetNumber = Number(preset);
        
    if (presets.selectedPreset != "") { 
        for (let i = 0; i <= presets.presetList[presetNumber].limits.dX; i++) {
            for (let j = 0; j <= presets.presetList[presetNumber].limits.dY; j++) {  
                if ((idLine - j > 0) && (idColumn + i <= col)) {
                    document.getElementById((idLine - j) + "-" + (idColumn + i)).classList.remove("inboard");
                    document.getElementById((idLine - j) + "-" + (idColumn + i)).classList.remove("outboard");
                    console.log("apagando");
                }
            }
        }
    } else {
        if (hoveredItem) {
            document.getElementById(idLine + "-" + idColumn).classList.remove("inboard");
        }
        
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

//OPEN PRESETS WINDOW 
document.getElementById("preset").addEventListener("click", function(e) {
    document.getElementById("presets-div").classList.toggle("fade");
    presets.selectedPreset = "";    
    var removeAll = document.getElementById("presets-div").children;
    for (let i = 0; i < removeAll.length; i++) {        
        removeAll[i].classList.remove("preset-selected");
    }
});

//SELECT PRESETS 
document.getElementById("presets-div-items").addEventListener("click", function(e) {   
    
    //removing the selection from all other preset icons
    removeAll = document.getElementById("presets-div-items").children;
    for (let i = 0; i < removeAll.length; i++) {
        if (removeAll[i] == e.target) {
            continue;
        } else {
            removeAll[i].classList.remove("preset-selected");
        }
    }
    
    //clicking on an icon toggles the "select-preset" class
    if (e.target.id != "presets-div-items") {
        e.target.classList.toggle("preset-selected");
    }
    
    //defining the selectedPreset object property
    if (e.target != document.getElementById("presets-div") && e.target.classList.contains("preset-selected") ) {
        presets.selectedPreset = e.target.id; 
    } else {
        presets.selectedPreset = "";
    }
    
});

//MENU - give acess to menu items
document.getElementById("menu").addEventListener("click", function(e){
    var clickedItem;
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
    
    if (clickedItem.id != "menu") {
        document.getElementById("menu").classList.add("fade");
        console.log(clickedItem);
    }    
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

//MENU - closing windows - closing the menu windows 
document.getElementById("main-navigation").addEventListener("click", function(e){
    var clickedItem;
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
    //closing windows
    if (clickedItem.id == "close-options") {
        document.getElementById("options").classList.add("fade"); 
        document.getElementById("menu").classList.remove("fade");
    } else if (clickedItem.id == "close-about-game") {
        document.getElementById("about-game").classList.add("fade");
        document.getElementById("menu").classList.remove("fade");
    } else if (clickedItem.id == "close-about-author") {
        document.getElementById("about-author").classList.add("fade");
        document.getElementById("menu").classList.remove("fade");
    }
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
        idLine,
        idColumn,        
        idSplit;
    for (let i = line; i >= 1; i--) { //i = y, j= x / i= linha, j = coluna
        for (let j = col; j >= 1; j--) {            
            adjacentLiveCells = 0;
            
            for (let adjY = -1; adjY <= 1; adjY++) {
                for (let adjX = -1; adjX <= 1; adjX++) {
                    if (adjX != 0 || adjY != 0) {  
                        idSplit = document.getElementById(i + "-" + j).id.split("-");
                        idLine = Number(idSplit[0]);
                        idColumn = Number(idSplit[1]);
                        if ( (idLine + adjY > 0) && (idColumn + adjX > 0) && (idLine + adjY <= line) && (idColumn + adjX <= col) && document.getElementById((idLine + adjY) + "-" + (idColumn + adjX)).classList.contains("alive")) {
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
    },actionVelocity);
}

insertPreset = function(selectedPreset, initialPosition) {
    //initial position is the id of the cell (remebering, I-J, or line-col)
    var idSplit,
        presetSplit,   
        idLine,
        idColumn,
        presetNumber;
    
    idSplit = initialPosition.split("-");
    presetSplit = selectedPreset.split("-"); //presetsplit[0] is the word "preset" and presetSplit[1] is the index of the preset
    
    idLine = Number(idSplit[0]);
    idColumn = Number(idSplit[1]);
    presetNumber = Number(presetSplit[1]); 
    
    
    console.log("ID split1 - coluna: " + (idColumn));
    console.log("incremento coluna: " + presets.presetList[presetSplit[1]].limits.dX);
    console.log("ID split0 - linha: " + (idLine));
    console.log("decremento linha: " + presets.presetList[presetSplit[1]].limits.dY);
    // generating the shape, based on the initial position
    if (idColumn + presets.presetList[presetNumber].limits.dX <= col && idLine - presets.presetList[presetNumber].limits.dY > 0) {            
        for (let i = 0; i < presets.presetList[presetNumber].coordinates.length; i++) {                
            document.getElementById((idLine + presets.presetList[presetNumber].coordinates[i][0]) + "-" + (idColumn + presets.presetList[presetNumber].coordinates[i][1])).classList.add("alive")
        }
    } else {
        console.log("no room to insert this shape");
    }
}

writePattern = function() {
    var newArrayCoord,
        idSplit;
    
    
    for(let i = 0; i <= line; i++) {
        for (let j = 0; j <= col; j++) {
            if (document.getElementById(i + "-" + j).classList.contains("alive")) {
                newArrayCoord.push([i,j]);
            }
        }
    } 
    presets.presetList.push(newArrayCoord);   
    document.getElementById("presets-div").insertAdjacentHTML("beforeend", "new array");
}
grid(col, line);