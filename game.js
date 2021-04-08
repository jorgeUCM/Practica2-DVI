// Especifica lo que se debe pintar al cargar el juego
var startGame = function() {
  var board = new GameBoard();
  board.add(new Title());
  board.add(new TitleScreen("",
     "Press enter to start playing",
     playGame));
  board.add(new Fondo());
  Game.setBoard(0, board);
}


var playGame = function() {
  
  
  var capa1_fondo = new GameBoard();
  capa1_fondo.add(new Fondo());

  Game.setBoard(0, capa1_fondo);

  var capa2_juego = new GameBoard();
/*
  for(i = 1; i < 14; ++i) {
    for(j = 1; j < 6; ++j) {
      capa2_juego.add(new Water(i * 40, j * 48));
    }
  }*/
  
  for(fin = 0; fin < 14; ++fin) {
    capa2_juego.add(new Home(fin * 40, 1));
  }
  /*
  capa2_juego.add(new Spawner(level1,winGame));
*/
  capa2_juego.add(new Frog());

  Game.setBoard(1, capa2_juego);
}


var loseGame = function(){
  var board = new GameBoard();
  board.add(new Title());
  board.add(new TitleScreen("You Lose :(",
     "Press enter to start another game",
     playGame));
  board.add(new Fondo());
  Game.setBoard(1, board);
}

var winGame = function(){
  var board = new GameBoard();
  board.add(new Title());
  board.add(new TitleScreen("You Win :)",
     "Press enter to start another game",
     playGame));
  board.add(new Fondo());
  Game.setBoard(1, board);
}
/*
var winGame = function() {
  Game.setBoard(1,new TitleScreen("You win!", 
                                  "Press space to play again",
                                  playGame));
};



var loseGame = function() {
  Game.setBoard(1,new TitleScreen("You lose!", 
                                  "Press space to play again",
                                  playGame));
};
*/

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
