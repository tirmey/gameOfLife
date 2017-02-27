

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
                name: "DiCross",
                coordinates:
                [[-3,0], [-4,0], [-5,0], [-2,1], [-4,1], [-6,1], [-1,2], [-4,2], [-7,2], [0,3], [-4,3], [-8,3], [0,4], [-1,4], [-2,4], [-3,4], [-4,4], [-5,4], [-6,4], [-7,4], [-8,4], [0,5], [-4,5], [-8,5], [-1,6], [-4,6], [-7,6], [-2,7], [-4,7], [-6,7], [-3,8], [-4,8], [-5,8]],//initialPosition,

                limits: {
                    dX: 8,
                    dY: 8
                }
            },
            
            {
                name: "GosperGl",    
                coordinates:
                [[-4,0], [-5,0], [-4,1], [-5,1], [-3,10], [-4,10], [-5,10], [-2,11], [-6,11], [-1,12], [-7,12], [-1,13], [-7,13], [-4,14], [-2,15], [-6,15], [-3,16], [-4,16], [-5,16], [-4,17], [-5,20], [-6,20], [-7,20], [-5,21], [-6,21], [-7,21], [-4,22], [-8,22], [-3,24], [-4,24], [-8,24], [-9,24], [-6,34], [-7,34], [-6,35], [-7,35]],

                limits: {
                    dX: 35,
                    dY: 9
                }
            },
            
            {
                name: "Pulsar",
               
                coordinates:
                [[-12,2], [-12,3], [-12,4], [-12,8], [-12,9], [-12,10], [-10,0], [-10,5], [-10,7], [-10,12], [-9,0], [-9,5], [-9,7], [-9,12], [-8,0], [-8,5], [-8,7], [-8,12], [-7,2], [-7,3], [-7,4], [-7,8], [-7,9], [-7,10], [-5,2], [-5,3], [-5,4], [-5,8], [-5,9], [-5,10], [-4,0], [-4,5], [-4,7], [-4,12], [-3,0], [-3,5], [-3,7], [-3,12], [-2,0], [-2,5], [-2,7], [-2,12], [0,2], [0,3], [0,4], [0,8], [0,9], [0,10]], 
            
                limits: {
                    dX: 12,
                    dY: 12
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
    console.log("selcted preset vale" + presets.selectedPreset);
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

// ADD PRESET
document.getElementById("presets-div-new").addEventListener("click", function() {
    writePattern();
});

//SELECT PRESETS 
document.getElementById("presets-div-items").addEventListener("click", function(e) {   
    
    var selected;
    
    if (e.target.classList.contains("icon-cluster")) {
        selected = e.target.parentElement
        console.log("tem icon-cluster!");
    } else if (e.target.classList.contains("fa")) {
        selected = e.target.parentElement.parentElement;  
        console.log("tem fa!");
    } else if (e.target.classList.contains("preset-item")) {
        selected = e.target;
    }
    console.log(selected);
    
    
    
    removeAll = document.getElementById("presets-div-items").children;
    for (let i = 0; i < removeAll.length; i++) {
        if (removeAll[i] == selected) {
            continue;
        } else {
            removeAll[i].classList.remove("preset-selected");
        }
    }
    
    //clicking on an icon toggles the "select-preset" class
    if (selected.id != "presets-div-items") { //to exclude the DIV itself
        selected.classList.toggle("preset-selected");
    }
    
    //defining the selectedPreset object property
    if (selected != document.getElementById("presets-div") && selected.classList.contains("preset-selected") ) {
        presets.selectedPreset = selected.id; 
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
    var newArrayCoord =[],
        arrLines = [],
        arrLinesSorted = [],
        arrLinesTransposed = [],
        arrCols = [],
        arrColsSorted = [],
        arrColsTransposed = [],
        formattedCoordinates = [],
        newPreset = {},
        name,
        dL, //delta line
        dC, // delta column
        idSplit;
    
    function transpose(array, type) { //type shouuld be "lines" ou "cols"
        
        if (type == "lines") {
            for (let i = 0; i < array.length; i++) {
                array[i] -= arrLinesSorted[arrLinesSorted.length - 1];//each element will be subtracted from the max line value
            }
        } else if (type == "cols") {
            for (let i = 0; i < array.length; i++) {
                array[i] -= arrColsSorted[0];//each element will be subtracted from the max line value
            }
        }
        return array;
    }
    
    // getting the recorded points
    for(let i = 1; i <= line; i++) {
        for (let j = 1; j <= col; j++) {
            if (document.getElementById(i + "-" + j).classList.contains("alive")) {
                newArrayCoord.push([i,j]);
            }
        }
    } 
    
    //separating the lines and columns in other arrays to sorting
    for (let i = 0; i<newArrayCoord.length; i++) {
        arrLines.push(newArrayCoord[i][0]); //array with all the lines
        arrCols.push(newArrayCoord[i][1]); //array with all the columns
    }
    
    //copying the values of the original arrays for sorting
    for (let i = 0; i < newArrayCoord.length; i++) {
        arrLinesSorted[i] = arrLines[i];
        arrColsSorted[i] = arrCols[i];
    }
    
    //sorting the arrays to determine dL and dC:
    arrLinesSorted.sort(function(a, b){return a-b}); //sorting in ascending order
    arrColsSorted.sort(function(a, b){return a-b}); //sorting in ascending order
    
    //determining dL and dC
    dL = arrLinesSorted[arrLinesSorted.length-1] - arrLinesSorted[0];
    dC = arrColsSorted[arrColsSorted.length-1] - arrColsSorted[0];
    
 
    //transposing the points
    arrLinesTransposed = transpose(arrLines, "lines");
    arrColsTransposed = transpose(arrCols, "cols");
    
 
    //joining the points
    for (let i = 0; i < arrLines.length; i++) {
        let joined = [arrLinesTransposed[i], arrColsTransposed[i]];
        formattedCoordinates.push(joined);
    }
    
    
  
    if (formattedCoordinates[0] != undefined) {
        name = prompt("please inform the name of the new preset (8 char max.)");
        newPreset = { 
                name: name,
                coordinates: formattedCoordinates,
                limits: {
                    dX: dC,
                    dY: dL
                }   
        };
        presets.presetList.push(newPreset); 
        document.getElementById("presets-div-items").insertAdjacentHTML("afterbegin", "<div id = 'preset-" + (presets.presetList.length - 1) + "' class='preset-item'><div class='icon-cluster'><i class='fa fa-ellipsis-v' aria-hidden='true'></i><i class='fa fa-ellipsis-v' aria-hidden='true'></i><i class='fa fa-ellipsis-v' aria-hidden='true'></i></div>" + presets.presetList[presets.presetList.length - 1].name + "</div>");
        console.log(presets.presetList);
        
    } else {
        alert("draw some cells to record a new preset");
    }
}



grid(col, line);

//writing the presets
(function(){
    for (let i = 0; i < presets.presetList.length; i++) {
        document.getElementById("presets-div-items").insertAdjacentHTML("afterbegin", "<div id = 'preset-" + i + "' class='preset-item'><div class='icon-cluster'><i class='fa fa-ellipsis-v' aria-hidden='true'></i><i class='fa fa-ellipsis-v' aria-hidden='true'></i><i class='fa fa-ellipsis-v' aria-hidden='true'></i></div>" + presets.presetList[i].name + "</div>");
    }
})();