var Sudoku = {
  sectionArray        : undefined,
  rowArray            : undefined,
  columnArray         : undefined,
  matrix              : undefined,
  init              :  function(){
    var self = this;
    $('#solved').on('click',function(e){
      if(e.target.id == "newGame"){
        self.createBoard();
        $('#solved').fadeOut();
      }
    
    });
    $('#controlList').on('click',function(e){
      if(e.target.id == "reset"||e.target.parentElement.id == "reset"){
        self.createBoard();
      }else if(e.target.id == "showAnswers" ||e.target.parentElement.id == "showAnswers" ){
        self.generateBoard(true)
      }
      
    
    });
    
    this.createBoard();
  
  
  },
//Function to initialize the game
  createBoard : function(){
    var boardHTML = "";
    this.sectionArray = [];
    this.rowArray = [];
    this.columnArray = [];
    this.matrix = this.matrixValues();
    for(var row_iterator = 1; row_iterator<=9; row_iterator++){
      for(var column_iterator = 1; column_iterator<=9; column_iterator++){
        boardHTML += "<div class='cells row"+row_iterator+" column"+column_iterator+"'><input maxlength=1 type='text' onkeypress='return event.keyCode >= 49 && event.keyCode <= 57'/></div>";
      }
    }
    
    $('.content').html('<div id="board"></div>');
    $('#board').html(boardHTML);
    this.addSections();
    this.generateBoard(false);
    this.getSections();
    this.addCells();
    this.getRows();
    this.getColumns();
    this.validateInput();
  },

//group rows and columns into 9 sections by adding a section class
  addSections : function(){
    var section_iterator = 1;
    for(var row_iterator = 1; row_iterator<=9; row_iterator++){
       if(row_iterator<=3)
        section_iterator=1;
      else if(row_iterator>3 && row_iterator<=6)
        section_iterator=4;
      else if(row_iterator>6 && row_iterator<=9)
        section_iterator=7;
      for(var column_iterator = 1; column_iterator<=9; column_iterator++){
        $('.row'+row_iterator+'.column'+column_iterator).addClass('section'+section_iterator);
        if(column_iterator %3==0)
          section_iterator++;  
      }
    }

  },
  //add id to number each cell
  addCells : function(){
    var cells = $('.cells input').toArray();
    cells.forEach(function(input,i){
      var cell_iterator = i+1;
      $(input).attr("id","cell"+cell_iterator);
    });
  },

//get all the input values in sections
  getSections : function(){
    var self = this;
    for(var section_iterator = 1; section_iterator<=9; section_iterator++){
     var section = $('.section'+section_iterator+' input').toArray();
     this.sectionArray['section'+section_iterator] =[];
     section.forEach(function(input){
        if(input.value !=="")
          self.sectionArray['section'+section_iterator].push(input.value);
      });
      if(this.hasDuplicates(this.sectionArray['section'+section_iterator])){
        section.forEach(function(input){
          if(input.value == self.hasDuplicatesValue(self.sectionArray['section'+section_iterator]))
            $(input).addClass('section'+section_iterator+'_duplicates');
        
        });
      }
    }
  },

//get all the input values in rows
  getRows : function(){
    var self = this;
    for(var row_iterator = 1; row_iterator<=9; row_iterator++){
     var row = $('.row'+row_iterator+' input').toArray();
     this.rowArray['row'+row_iterator] =[];
     row.forEach(function(input){
        if(input.value !=="")
          self.rowArray['row'+row_iterator].push(input.value);
      });
      if(this.hasDuplicates(this.rowArray['row'+row_iterator])){
        row.forEach(function(input){
          if(input.value == self.hasDuplicatesValue(self.rowArray['row'+row_iterator]))
            $(input).addClass('row'+row_iterator+'_duplicates');
        });
      }
      
    }
  },

//get all the input values in columns
  getColumns : function(){
    var self = this;
    for(var column_iterator = 1; column_iterator<=9; column_iterator++){
     var column = $('.column'+column_iterator+' input').toArray();
     this.columnArray['column'+column_iterator] =[];
     column.forEach(function(input){
        if(input.value !=="")
          self.columnArray['column'+column_iterator].push(input.value);
      });
    
      if(this.hasDuplicates(this.columnArray['column'+column_iterator])){
        column.forEach(function(input){
          if(input.value == self.hasDuplicatesValue(self.columnArray['column'+column_iterator]))
            $(input).addClass('column'+column_iterator+'_duplicates');
        
        });
      }
    }
  },

  validateInput : function(){
    var self = this;
   $('.cells input').on('keyup',function(e){
      var value = this.value;
      var eventSelf = this;
      var section = $(this).parent().attr('class').split(" ")[3];
      var row = $(this).parent().attr('class').split(" ")[1];
      var column = $(this).parent().attr('class').split(" ")[2];
      //if input is deleted
      if(e.keyCode == 8 || e.keyCode == 46){
        var duplicateSectionArray = [];
        var duplicateRowArray = [];
        var duplicateColumnArray = [];
        
        //recheck sections for duplicates
        var sectionValues = $("."+section+" input").toArray();
        sectionValues.forEach(function(input){
            if($(input).hasClass(section+'_duplicates') && $(input).val() !=="")
              duplicateSectionArray.push(input.value);
        
        });
        sectionValues.forEach(function(input){
          if($(input).hasClass(section+'_duplicates') && $(input).val() !== self.hasDuplicatesValue(duplicateSectionArray))
             $("."+section+" input").removeClass(section+'_duplicates');
          
        });
        
        //recheck rows for duplicates
        var rowValues = $("."+row+" input").toArray();
        rowValues.forEach(function(input){
            if($(input).hasClass(row+'_duplicates')  && $(input).val() !=="")
              duplicateRowArray.push(input.value);
        
        });
        rowValues.forEach(function(input){
          if($(input).hasClass(row+'_duplicates') && $(input).val() !== self.hasDuplicatesValue(duplicateRowArray))
             $("."+row+" input").removeClass(row+'_duplicates');
          
        });

        
        //recheck columns for duplicates
        var columnValues = $("."+column+" input").toArray();
        columnValues.forEach(function(input){
            if($(input).hasClass(column+'_duplicates')  && $(input).val() !==""){
              duplicateColumnArray.push(input.value);
            }
        
        });
        columnValues.forEach(function(input){
          if($(input).hasClass(column+'_duplicates') && $(input).val() !== self.hasDuplicatesValue(duplicateColumnArray))
             $("."+column+" input").removeClass(column+'_duplicates');
          
        });
        
       
        //get values of board after input deleted
        self.getSections();
        self.getRows();
        self.getColumns();
        

      }
      
      //check sections, rows, and columns for duplicates
      if(self.sectionArray[section].indexOf(this.value)>=0){
        var sectionValues = $("."+section+" input").toArray();
        sectionValues.forEach(function(input){
          if(input.value == eventSelf.value)
            $(input).addClass(section+'_duplicates');
        
        });
      }else if(self.rowArray[row].indexOf(this.value)>=0){
        var rowValues = $("."+row+" input").toArray();
        rowValues.forEach(function(input){
          if(input.value == eventSelf.value)
            $(input).addClass(row+'_duplicates');
        
        });
      }else if(self.columnArray[column].indexOf(this.value)>=0){
        var columnValues = $("."+column+" input").toArray();
        columnValues.forEach(function(input){
          if(input.value == eventSelf.value)
            $(input).addClass(column+'_duplicates');
        
        });
      }else{
        //update sectionArray, rowArray, and columnArray with new inputs on the board
        self.getSections();
        self.getRows();
        self.getColumns();
        var solved = self.isSolved();
        if(solved){
          //console.log("solved");
          $('#solved').fadeIn();
        }
      }
   
   });
  },

//generate the values on the board
  generateBoard : function(solved){
    var unsolved = [];
    var matrixGen =  this.matrix;
    if(solved==false){
      unsolved = this.unsolvedMatrix(matrixGen);
    }else{
      unsolved = matrixGen;
    }
    var i = 0;
    for(var section_iterator = 1; section_iterator<=9; section_iterator++){          
      for(var row_iterator = 1; row_iterator<=9; row_iterator++){         
        for(var column_iterator = 1; column_iterator<=9; column_iterator++){
          if(unsolved[i]>0){
            $('.section'+section_iterator+'.row'+row_iterator+'.column'+column_iterator+' input').val(unsolved[i]);
            $('.section'+section_iterator+'.row'+row_iterator+'.column'+column_iterator+' input').prop('disabled', true);
          }
          i++;
        }
      }
      i=0;
    }
  },


//Create matrix with solution
  matrixValues : function (){
    var matrix = [];
    //create matrix with simple sudoku values in order
    for (var i = 0; i < 9; i++){
      for (var j = 0; j < 9; j++){
        matrix[i * 9 + j] = (i*3 + Math.floor(i/3) + j) % 9 + 1; 
      }
    }
    
    //shuffle columns of each section
    for (var s = 0; s < 42; s++) {
        var random1 = Math.floor(Math.random() * 3);
        var random2 = Math.floor(Math.random() * 3);

        for(var row = 0; row < 9; row++) {
          var tmp = matrix[row * 9 + (s % 3 * 3 + random1)];
          matrix[row * 9 + (s % 3 * 3 + random1)] = matrix[row * 9 + (s % 3 * 3 + random2)];
          matrix[row * 9 + (s % 3 * 3 + random2)] = tmp;
        }
    }
    
    //shuffle rows of each section
    for (var s = 0; s < 42; s++) {
        var r1 = Math.floor(Math.random() * 3);
        var r2 = Math.floor(Math.random() * 3);

        for(var col = 0; col < 9; col++){
          var tmp = matrix[(s % 3 * 3 + r1) * 9 + col];
          matrix[(s % 3 * 3 + r1) * 9 + col] = matrix[(s % 3 * 3 + r2) * 9 + col];
          matrix[(s % 3 * 3 + r2) * 9 + col] = tmp;
        }
    }
    return matrix;
          

  },

//randomly hide certain cells on board
  unsolvedMatrix : function(matrix){
      var hide = [];
      for(var i = 0; i < 81; i++)
        hide[i] = matrix[i];

      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          for (var k = 0; k < 5; k++) {
            var random;
            do {
              random = Math.floor(Math.random() * 9);
            }
            while(hide[(i * 3 + Math.floor(random / 3)) * 9 + j * 3 + random % 3] == 0);

            hide[(i * 3 + Math.floor(random / 3)) * 9 + j * 3 + random % 3] = 0;
          }
        }
      }
      return hide;

  },

//return true if array has duplicates.  Useful for checking the inputs on the board
  hasDuplicates : function(array) {
      var valuesSoFar = {};
      for (var i = 0; i < array.length; ++i) {
          var value = array[i];
          if (Object.prototype.hasOwnProperty.call(valuesSoFar, value)) {
              return true;
          }
          valuesSoFar[value] = true;
      }
      return false;
  },

//return the duplicate value. Useful if checking duplicate value up agains other values in row, section, or column
  hasDuplicatesValue : function(array) {
      var valuesSoFar = {};
      for (var i = 0; i < array.length; ++i) {
          var value = array[i];
          if (Object.prototype.hasOwnProperty.call(valuesSoFar, value)) {
              return value;
          }
          valuesSoFar[value] = true;
      }
      return;
  },

//Check if board has been solved
  isSolved : function(){

    //check all sections for duplicates and empty inputs
    for(var section_iterator = 1; section_iterator<=9; section_iterator++){
      if(this.hasDuplicates(this.sectionArray['section'+section_iterator]) || this.sectionArray['section'+section_iterator].length<9){
        return false;
      }
    }
    //check all rows for duplicates and empty inputs
    for(var row_iterator = 1; row_iterator<=9; row_iterator++){
      if(this.hasDuplicates(this.rowArray['row'+row_iterator]) || this.rowArray['row'+row_iterator].length<9){
        return false;
      } 
    }
    
    //check all columns for duplicates and empty inputs
    for(var column_iterator = 1; column_iterator<=9; column_iterator++){
      if(this.hasDuplicates(this.columnArray['column'+column_iterator]) || this.columnArray['column'+column_iterator].length <9){
        return false;
      }
    }
    
    return true;
  }
}