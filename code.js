

var col,
    line,
    actionVelocity = 75, 
    grid = new Array(line),
    tempGrid = new Array(line),
    getPresetPosition,     
    start,
    blink;



    

    var presets = {
        
        selectedPreset: "",  
        
        presetList: [
            
            {
                name: "flower",
                coordinates:
                [[-4,2],[-3,0],[-3,2],[-3,4],[-2,1],[-2,3],[-1,0],[-1,2],[-1,4],[0,2]],//initialPosition,

                limits: {
                    dX: 4,
                    dY: 4
                }
            },
            
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
                name: "LWSS",    
                coordinates:
                [[-3,1], [-3,2], [-3,3], [-3,4], [-3,5], [-2,0], [-2,5], [-1,5], [0,0], [0,4]],

                limits: {
                    dX: 5,
                    dY: 3
                }
            },
            
            {
                name: "GospGlid",    
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
            },
            
            {
                name: "glider",
               
                coordinates:
                [[-2,1], [-2,2], [-1,0], [-1,2], [0,2]], 
            
                limits: {
                    dX: 2,
                    dY: 2
                }
            }
        
        ],
        
        addOrRemove: function(e) {
            var selected,
                arrIndex,
                removeAll,
                allPresetsArray = [],
                allPresets = [];

            //deleting a preset
            if (e.target.classList.contains("fa-trash")) {

                //getting the index of the clicked preset on the object arrayList    
                arrIndex = e.target.parentElement.id.split("-")[1];

                //erasing the preset from object
                presets.presetList.splice(arrIndex, 1);

                //erasing object from DOM
                e.target.parentElement.outerHTML = "";

                //getting all the DOM presets and transform the nodeList to an array
                allPresets = document.querySelectorAll(".preset-item");
                allPresetsArray = Array.prototype.slice.call(allPresets);
                 //rearranging the id's
                for (let i = 0; i < allPresetsArray.length; i++) {
                    allPresetsArray[i].id = "preset-" + (allPresetsArray.length - (i+1));            
                }

                presets.selectedPreset = "";
            }

            //selecting presets
            if (e.target.id == "preset-icon" || e.target.id == "preset-text") {
                selected = e.target.parentElement;
            } else if (e.target.classList.contains("preset-item")) {
                selected = e.target;
            }

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
                
                //automatically closes the side bar (if applicable) to insert the preset
                console.log("heyy!!!!");
                windowControl("all", "remove", "close");
            }

            //defining the selectedPreset object property
            if (selected != document.getElementById("presets-div") && selected != document.getElementById("presets-div-items") && selected.classList.contains("preset-selected") ) {
                presets.selectedPreset = selected.id; 
            } else {
                presets.selectedPreset = "";
            }
        },
        
        writePattern: function() { //preset method
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

            function transpose(array, type) { //type should be "lines" ou "cols"

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
            for(let i = 0; i < line; i++) {
                for (let j = 0; j < col; j++) {
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
                name = document.getElementById("input-preset-name").value;
                newPreset = { 
                        name: name,
                        coordinates: formattedCoordinates,
                        limits: {
                            dX: dC,
                            dY: dL
                        }   
                };
                presets.presetList.push(newPreset); 
                document.getElementById("presets-div-items").insertAdjacentHTML("afterbegin", "<div id = 'preset-" + (presets.presetList.length - 1) + "' class='preset-item'><img id='preset-icon' src='img/presets.png'><i class='fa fa-trash' aria-hidden='true' class = 'fade'></i><p id='preset-text'>" + presets.presetList[presets.presetList.length - 1].name + "</p></div>");

            } else {
                alert("draw some cells first to record a new preset");
            }
            document.getElementById("input-preset-name").value = "";
            document.getElementById("preset-name").classList.add("zero-height");
        },
        
        rotateArray: function(array) { 
    
            var xRot = [],
                yRot = [],
                arrRotated = [],
                selectedPresetIndex;

            selectedPresetIndex = presets.selectedPreset.split("-")[1];

            //in clockwise rotations: (x,y) --> (y, -x);
            for (let i = 0; i < array.length; i++) {
                xRot = array[i][1] - presets.presetList[selectedPresetIndex].limits.dX; // translating the lines! subtracting the dX of the original offset to compensate the line deviation caused by the rotation
                yRot = -array[i][0]; 
                arrRotated.push([xRot, yRot]);
            }
            return arrRotated;
        },
        
        rotateObj: function() { //preset method
            var presetIndex,
                rotatedCoord = [],
                dXInverted,
                dYInverted,
                rotatedObj = {};

            //picking the id of the current selected preset
            presetIndex = presets.selectedPreset.split("-")[1];

            //rotating their coordinates and inverting their limits
            dXInverted = presets.presetList[presetIndex].limits.dY;
            dYInverted = presets.presetList[presetIndex].limits.dX;
            rotatedCoord = presets.rotateArray(presets.presetList[presetIndex].coordinates);
            

            //creating the temporary object
            rotatedObj = {                
                name: "temporary-" + (presets.presetList.length - 1), // - o nome não pode ser temporário... tem que ser temporário-lastIndex... pára a função insertPreset poder clivar o nome e pegar a parte numérica, que é o índex da criança - que deverá ser sempre o último! 
                coordinates: rotatedCoord,
                limits: {
                    dX: dXInverted,
                    dY:dYInverted
                }
            };

            if (presets.presetList[presets.presetList.length - 1].name == "temporary-" + (presets.presetList.length - 1) || presets.presetList[presets.presetList.length - 1].name == "temporary-" + (presets.presetList.length)) {
                //eliminating the previous rotation
                presets.presetList.pop();
            }
            rotatedObj.name = "temporary-" + (presets.presetList.length); // the temporary preset name should be the lenght of the preset array, because it will be inserted in the next-step! 

            //including the rotated object in the objects array
            presets.presetList.push(rotatedObj);  
            presets.selectedPreset = presets.presetList[presets.presetList.length-1].name;
        },
        
        deleteTemporary: function() { //array method
            var lastPresetType;    
            lastPresetType = presets.presetList[presets.presetList.length - 1].name.split("-")[0];
            if (lastPresetType == "temporary") {
                presets.presetList.pop();
            }
        },
        
        shapePreview: function(e) {
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
                if (idLine - presets.presetList[presetNumber].limits.dY >= 0 && idColumn + presets.presetList[presetNumber].limits.dX < col) {
                    for (let k = 0; k < presets.presetList[presetNumber].coordinates.length; k++) { //k loops across preset coordinates                
                        for (let i = 0; i <= presets.presetList[presetNumber].limits.dX; i++) { // i loops across possible colums (dX)
                            for (let j = 0; j <= presets.presetList[presetNumber].limits.dY; j++) { // j loops across possible lines (dY)
                                if (presets.presetList[presetNumber].coordinates[k][0] == -j && presets.presetList[presetNumber].coordinates[k][1] == i) {
                                    document.getElementById((idLine - j) + "-" + (idColumn + i)).classList.add("inboard");
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 0; i <= presets.presetList[presetNumber].limits.dX; i++) {
                        for (let j = 0; j <= presets.presetList[presetNumber].limits.dY; j++) {  
                            if ((idLine - j >= 0) && (idColumn + i <= col)) {
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
        },
        
        shapeRefresh: function(e) {
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
                for (let i = 0; i < line; i++) {
                    for (let j = 0; j < col; j++) { 
                        document.getElementById(i + "-" + j).classList.remove("inboard");
                        document.getElementById(i + "-" + j).classList.remove("outboard");
                    }
                } 
            } else {
                if (hoveredItem) {
                    document.getElementById(idLine + "-" + idColumn).classList.remove("inboard");
                }
            }
        },
        
        insertPreset: function(selectedPreset, initialPosition) { //preset method
            //initial position is the id of the hovered cell (remebering, I-J, or line-col)
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
            if (idColumn + presets.presetList[presetNumber].limits.dX <= col && idLine - presets.presetList[presetNumber].limits.dY >= 0) {            
                for (let i = 0; i < presets.presetList[presetNumber].coordinates.length; i++) {                
                    document.getElementById((idLine + presets.presetList[presetNumber].coordinates[i][0]) + "-" + (idColumn + presets.presetList[presetNumber].coordinates[i][1])).classList.add("alive");
                    grid[idLine + presets.presetList[presetNumber].coordinates[i][0]][idColumn + presets.presetList[presetNumber].coordinates[i][1]] = 1;
                }
            } else {
                console.log("no room to insert this shape");
            }
        },
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
    
    if (presets.selectedPreset == "") { 
        if (e.target.classList.contains("cell")) {             
            e.target.classList.toggle("alive");     
            if (grid[clickedItem.id.split("-")[0]][clickedItem.id.split("-")[1]]) {
                grid[clickedItem.id.split("-")[0]][clickedItem.id.split("-")[1]] = 0;
            } else {
                grid[clickedItem.id.split("-")[0]][clickedItem.id.split("-")[1]] = 1;
            }
        }
    } else {
        presets.insertPreset(presets.selectedPreset, clickedItem.id);
    }
   
});

//listener apply to window, to detect resize
/*window.addEventListener("resize", function() {
    col = document.getElementById("cols").value;
    line = document.getElementById("lines").value;
    document.getElementById("gridContainer").innerHTML="";
    createGrid(col, line);
    if (document.getElementById("start").classList.contains("hidden")) {
        clearInterval(start);
        document.getElementById("start").classList.toggle("hidden");
        document.getElementById("pause").classList.toggle("hidden");
    }
});*/

// to change the color of the cells when hovering to insert pattern
document.getElementById("gridContainer").addEventListener("mouseover", function(e){
    presets.shapePreview(e);
});

// to refresh the color of the cells when hovering to insert pattern
document.getElementById("gridContainer").addEventListener("mouseout", function(e){
    presets.shapeRefresh(e);
});

//HAMBURGER MENU
document.getElementById("operacional").addEventListener("click", function(e){
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
    
    windowControl("all", "remove", "close");
    
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

//PRESS ENTER - start and pause the simulation
document.addEventListener("keypress", function(e){
    
    if (e.keyCode == 13 && document.getElementById("input-preset-name") !== document.activeElement) {
        if (document.getElementById("start").classList.contains("hidden")) {
            clearInterval(start);
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

// ADD PRESET
document.getElementById("presets-div-new").addEventListener("click", function() {   
   
    document.getElementById("preset-name").classList.remove("zero-height");
    document.getElementById("input-preset-name").focus();
});

// SELECTING A PRESET NAME
document.getElementById("input-preset-name-ok").addEventListener("click", function() {
    presets.deleteTemporary()
    presets.writePattern();
});

//SELECTING A PRESET NAME - ENTER KEY
document.addEventListener("keypress", function(e) {
    if (e.keyCode == 13 && document.getElementById("input-preset-name") === document.activeElement) {
        presets.deleteTemporary();
        presets.writePattern();
        document.getElementById("input-preset-name").blur(); 
        
        //exprerimental to take new intersting presets
        var novopreset = presets.presetList[presets.presetList.length-1].coordinates;
        var novopreset2 = presets.presetList[presets.presetList.length-1].limits.dX;
        var novopreset3 = presets.presetList[presets.presetList.length-1].limits.dY;
        document.getElementById("gridContainer").insertAdjacentHTML("afterend", "//// coordinates: " + novopreset + "//// dX: " + novopreset2 + "//// dy" + novopreset3 + "////");
    }
});

//CANCELING NAMING A NEW PRESET
document.getElementById("input-preset-name-cancel").addEventListener("click", function() {
    document.getElementById("input-preset-name").value = "";
    document.getElementById("preset-name").classList.add("zero-height");
});

// INSERT/DELETE PRESETS 
document.getElementById("presets-div-items").addEventListener("click", function(e) { 
    presets.addOrRemove(e);
});

//ROTATE PRESETS
document.addEventListener("keypress", function(e) {
    
    //rotating the item if some preset is selected. keyCode 82 correspond to letter "r"
    if (e.key == "r" && presets.selectedPreset != "") {
        presets.rotateObj(); 
    }
});

//OPEN MENUS - open windows - give acess to menu items
document.getElementById("menu").addEventListener("click", function(e){
    var clickedItem,
        removeAll;
    
    removeAll = document.getElementById("presets-div-items").children;
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
    
    if (clickedItem.id != "menu") {
        document.getElementById("presets-div").classList.add("fade"); 
        for (let i = 0; i < removeAll.length; i++) {        
            removeAll[i].classList.remove("preset-selected");
            presets.selectedPreset = "";
        }
    } 
    windowControl(clickedItem.id, "add", "open");
});

//CLOSE MENUS - closing windows - closing the menu items windows 
document.getElementById("main-navigation").addEventListener("click", function(e){
    var clickedItem;
    
    if (e.target !== e.currentTarget) {
        clickedItem = e.target;                    
    }
    e.stopPropagation();
    
    //closing windows
    windowControl(clickedItem.id, "remove", "close");
});

//INPUT COLUMS - change the width of the matrix
document.getElementById("cols").addEventListener("change", function(){
    col = document.getElementById("cols").value;
    document.getElementById("gridContainer").innerHTML="";
    createGrid(col, line);
});

//INPUT LINES - change the height of the matrix
document.getElementById("lines").addEventListener("change", function(){
    line = document.getElementById("lines").value;
    document.getElementById("gridContainer").innerHTML="";
    createGrid(col, line);
});

///////////////////////////////FUNCTIONS///////////////////////////////
///////////////////////////////////////////////////////////////////////


function createGrid(col, line) {
    var allCells;
    
    grid = new Array(line);
    for (let i = 0; i < line; i++) { 
       grid[i] = new Array(line);
    } 
       
    tempGrid = new Array(line);
    for (let i = 0; i < line; i++) { 
       tempGrid[i] = new Array(line);
    } 
    
    for (let i = line-1; i >= 0; i--) {        
        for ( let j = col-1; j >= 0; j--) { 
            grid[i][j] = 0;
            tempGrid[i][j] = 0;
            if (j == (col-1)) {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div><br>');
            } else {
                document.getElementById("gridContainer").insertAdjacentHTML("afterbegin",'<div id = "' + i + '-' + j + '" class = "cell"></div>');
            }
        }
    }
    document.getElementById("0-0").classList.add("firstRow-first");
    document.getElementById("0-" + (col-1)).classList.add("firstRow-last");
    document.getElementById((line-1) + "-0").classList.add("lastRow-first");
    document.getElementById((line-1) + "-" + (col-1)).classList.add("lastRow-last");
    
    allCells = document.querySelectorAll(".cell");
    for (i = 0; i <allCells.length; i++) {
        if (window.innerWidth >= 1501) {
            allCells[i].style.width = (window.innerWidth*0.65/col) + "px";
            allCells[i].style.height = (window.innerWidth*0.65/col) + "px";
        } else if (window.innerWidth < 1501 && window.innerWidth >= 1025){
            allCells[i].style.width = (window.innerWidth*0.82/col) + "px";
            allCells[i].style.height = (window.innerWidth*0.82/col) + "px";
        }
    }
}

function turn(col, line) {
    var adjacentLiveCells;    
    
    for (let i = line-1; i >= 0; i--) { //i = y, j= x / i= linha, j = coluna
        for (let j = col-1; j >= 0; j--) {            
            adjacentLiveCells = 0;
            
            for (let adjY = -1; adjY <= 1; adjY++) {
                for (let adjX = -1; adjX <= 1; adjX++) {
                    if (adjX || adjY) {  // means adjX != 0 and adjY !=0, in a elegant way
                        if ( (i + adjY >= 0) && (j + adjX >= 0) && (i + adjY < line) && (j + adjX < col) && (grid[i + adjY][j + adjX] == 1)) {
                            adjacentLiveCells++
                        } 
                    }
                }
            }
            if ((adjacentLiveCells === 2 || adjacentLiveCells === 3) && (grid[i][j] == 1)) {
                tempGrid[i][j] = 1;
            } else if (adjacentLiveCells === 3 && (grid[i][j] == 0)) {
                tempGrid[i][j] = 1;
            } else {
                tempGrid[i][j] = 0;
            }
        }
    }
    
    for (let i = line-1; i >= 0; i--) { 
        for (let j = col-1; j >= 0; j--) { 
            grid[i][j] = tempGrid[i][j];
            if (grid[i][j] == 1) {
                document.getElementById(i + "-" + j).classList.add("alive");
            } else {
                document.getElementById(i + "-" + j).classList.remove("alive");
            }
        }
    }
}

function random() {
    
    for (let i = line-1; i >= 0; i--) {
        for (let j = col-1; j >= 0; j--) { 
            grid[i][j] = 0;
        }
    }
    
    for (let i = line-1; i >= 0; i--) {
        for (let j = col-1; j >= 0; j--) { 
            rand = Math.random();
            if (rand > 0.5) {
                grid[i][j] = 1;
                document.getElementById(i + "-" + j).classList.add("alive");
            }
        }
    }
}

function remove() {
    
    for (let i = line-1; i >= 0; i--) {
        for (let j = col-1; j >= 0; j--) { 
            grid[i][j] = 0;
           document.getElementById(i + "-" + j).classList.remove("alive");
        }
    }
}

function startPause() {
    start = setInterval(function() {
        turn(col, line);
    },actionVelocity);
}

function windowControl(itemId, action, idCommand) { //If itemId = all, all the windows will be closed. ACTION must be "add" or "remove" idCommand should be "open" or "close". 
    
    if (itemId == idCommand + "-options" || itemId == "all") {
        document.getElementById("options").classList[action]("options-down"); 
    }
    if (itemId == idCommand + "-about-game" || itemId == "all") {
        document.getElementById("about-game").classList[action]("about-game-down");
    }
    if (itemId == idCommand + "-about-author" || itemId == "all") {
        document.getElementById("about-author").classList[action]("about-author-down");
    }
    
    if (itemId == "all") {
        document.getElementById("operacional").classList.toggle("left");
        document.getElementById("title").classList.toggle("left");    
        document.getElementById("mobile-title").classList.toggle("left");
        document.getElementById("control-panel").classList.toggle("left");
        console.log("fazisso");
    }
}

function scrSize() {
    var width = (window.innerWidth > 0) ? window.innerWidth : width;
    
    if (width <= 450 && width < screen.height ) {
        document.getElementById("cols").value = 20;
        document.getElementById("lines").value = 40;
        col=20;
        line=40;
    } else if (width <= 450 && width > screen.height ) {
         document.getElementById("cols").value = 40;
        document.getElementById("lines").value = 20;
        col = 40;
        line = 20;

    } else if (width > 450 && width <= 768 && width < screen.height) {
        document.getElementById("cols").value = 30;
        document.getElementById("lines").value = 60;
        col = 30;
        line = 60;
    } else if (width > 450 && width <= 768 && width > screen.height) {
        document.getElementById("cols").value = 60;
        document.getElementById("lines").value = 30;
        col = 60;
        line = 30;
    } else {
        document.getElementById("cols").value = 47;
        document.getElementById("lines").value = 39;
        col=47;
        line=39;
    }
    console.log("width: ");
    console.log(width);
    
console.log("screen height: ");
    console.log(screen.height);
    
}

//initializing
scrSize();
createGrid(col, line);

//writing the default presets on DOM 
(function(){
    for (let i = 0; i < presets.presetList.length; i++) {
        document.getElementById("presets-div-items").insertAdjacentHTML("afterbegin", "<div id = 'preset-" + i + "' class='preset-item'><img id='preset-icon' src='img/presets.png'><p id='preset-text'>" + presets.presetList[i].name + "</p></div>");
    }
})();


