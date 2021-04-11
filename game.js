

// Variable que se llama cada vez que se inicia el juego, pinta el titulo e inicializa el tablero
var startGame = function() {
  var board = new GameBoard();
  board.add(new Title());
  board.add(new TitleScreen("",
     "Press enter to start playing",
     playGame));
  board.add(new Fondo());
  Game.setBoard(0, board);
}

//Variable que se llama una vez inicializado el tablero, carga las capas y el fondo, el cual va en la primera capa así como el agua, la meta, los enemigos y la rana, todos estos añadidos a la segunda capa.
var playGame = function() {
  
  
  var capa1_fondo = new GameBoard();
  capa1_fondo.add(new Fondo());

  Game.setBoard(0, capa1_fondo);

  var capa2_juego = new GameBoard();

  for(i = 1; i < 14; ++i) {//84 casillas de agua
    for(j = 1; j < 6; ++j) {
      capa2_juego.add(new Water(i * 40, j * 48));
    }
  }
  
  for(fin = 0; fin < 14; ++fin) {//14 casillas de meta
    capa2_juego.add(new Home(fin * 40, 1));
  }
  
  capa2_juego.add(new Level(level1,winGame));

  capa2_juego.add(new Frog());

  Game.setBoard(3, capa2_juego);
}

//Variable que se llama cuando se pierde la partida, similar a startGame pero cambia la apariencia
var loseGame = function(){
  var board = new GameBoard();
  board.add(new Title());
  board.add(new TitleScreen("You Lose :(",
     "Press enter to start another game",
     playGame));
  board.add(new Fondo());
  Game.setBoard(3, board);
}
//Variable que se llama cuando se gana la partida, similar a startGame pero cambia la apariencia
var winGame = function(){
  var board = new GameBoard();
  board.add(new Title());
  board.add(new TitleScreen("You Win :)",
     "Press enter to start another game",
     playGame));
  board.add(new Fondo());
  Game.setBoard(3, board);
}


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame

window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
