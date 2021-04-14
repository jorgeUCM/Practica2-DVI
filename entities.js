
//Todos los sprites que vamos a utilizar
var sprites = {
titulo: {sx: 8, sy: 395, w: 411, h: 161, frames: 1},
fondo: {sx: 421, sy: 0, w: 550, h: 624, frames: 1},
agua: {sx: 160, sy: 226, w: 40, h: 48, frames: 1},
meta: {sx: 97, sy: 224, w: 40, h: 48, frames: 1},
carretera: {sx: 221, sy: 224, w: 58, h: 58, frames: 1},
tronco_p: {sx: 270, sy: 171, w: 130, h: 40, frames: 1},
tronco_m: {sx: 9, sy: 122, w: 191, h: 40, frames: 1},
tronco_g: {sx: 9, sy: 171, w: 247, h: 40, frames: 1},
coche_a: {sx: 8, sy: 5, w: 90, h: 48, frames: 1},
coche_v: {sx: 108, sy: 5, w: 96, h: 48, frames: 1},
coche_am: {sx: 213, sy: 5, w: 95, h: 48, frames: 1},
camion_b: {sx: 6, sy: 62, w: 125, h: 45, frames: 1},
camion_g: {sx: 147, sy: 62, w: 200, h: 47, frames: 1},
muerte: {sx: 211, sy: 128, w: 48, h: 35, frames: 4},
tortuga1: {sx: 5, sy: 288, w: 51, h: 48, frames: 1}, //Hay 2 tortugas diferentes con el mismo sprite
tortuga2: {sx: 5, sy: 288, w: 51, h: 48, frames: 1},
rana: {sx: 120, sy: 340, w: 40, h: 48, frames: 1}
};

var OBJECT_PLAYER = 1,
    OBJECT_VEHICULO = 2,
    OBJECT_TRONCO = 4,
    OBJECT_TORTUGA = 8,
    OBJECT_AGUA = 16,
    OBJECT_HOME = 32;


//Clase padre Sprite

var Sprite = function()  
 { }

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}



//Fondo del juego

var Fondo = function() {
  this.setup('fondo');

  this.x = 0;
  this.y = 0;

  this.step = function(dt) {}
};

Fondo.prototype = new Sprite();


//Clase de la rana
var Frog = function() {
  this.setup('rana', {vx: 0, vy: 0, maxVel: 48, movAct: 0.12, frame: 0});

  this.x = Game.width / 2 - this.w / 2;
  this.y = game.height - this.h;
  this.mov = this.movAct;

  this.step = function(dt) {

    //Variable que nos permite controlar la velocidad de movimiento de la rana
    this.mov -= dt;

    //Variables auxiliares que controlan si la rana se sale de los límites
    var auxX = this.x;
    var auxY = this.y;

    //Movimiento izquierda
    if(Game.keys['left'] && this.mov < 0) {
    
      auxX += -40;
      if(auxX > 0) {
        this.x += -40;
        this.mov = this.movAct;
        
      }
    }
    //Movimiento derecha
    else if(Game.keys['right'] && this.mov < 0) {
     
      auxX += 40;
      if(auxX < Game.width - this.w / 2) {
        this.x += 40;
        this.mov = this.movAct;
      
        
      }
    }
    //Movimiento arriba
    else if(Game.keys['up'] && this.mov < 0) {
    
      auxY += -48;
      if(auxY >= 0) {
        this.y += -48;
        this.mov = this.movAct;
       
      }
    }
    //Movimiento abajo
    else if(Game.keys['down'] && this.mov < 0) {
    
      auxY += 48;
      if(auxY < Game.height) {
        this.y += 48;
        this.mov = this.movAct;
     
      }
    }
    else { this.vx = 0; this.vy = 0; }


    //Comprobamos las colisiones con troncos o tortugas y ajustamos la velocidad horizontal de la rana acorde con la de cada entidad
    var tronco_collide = this.board.collide(this, OBJECT_TRONCO);
    var tortuga_collide = this.board.collide(this, OBJECT_TORTUGA);
    if(tronco_collide.sprite == 'tronco_p') {
      this.onTrunk = true;
      this.vx = troncos.tronco_p.V * troncos.tronco_p.D;
    }
    else if(tronco_collide.sprite == 'tronco_m') {
      this.onTrunk = true;
      this.vx = troncos.tronco_m.V * troncos.tronco_m.D;
    }
    else if(tronco_collide.sprite == 'tronco_g') {
      this.onTrunk = true;
      this.vx = troncos.tronco_g.V * troncos.tronco_g.D;
    }
    else if(tortuga_collide.sprite == 'tortuga1') {
      this.onTurtle = true;
      this.vx = tortugas.tortuga1.V * tortugas.tortuga1.D;
    }
    else if(tortuga_collide.sprite == 'tortuga2') {
      this.onTurtle = true;
      this.vx = tortugas.tortuga2.V * tortugas.tortuga2.D;
    
    }
    else {
      this.onTrunk = false;
      this.onTurtle = false;
      this.vx = 0;
    }

    if(this.x >= 0 + 15 && this.x <= Game.width - this.w / 2 - 15)
      this.x += this.vx * dt;
  }
};

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;
Frog.prototype.draw = function(ctx) {
  var s = SpriteSheet.map[this.sprite];
  ctx.save();
  ctx.translate(this.x + s.w / 2, this.y + s.h / 2);
  ctx.drawImage(SpriteSheet.image, s.sx + this.frame * s.w, s.sy, s.w, s.h, 
       -s.w / 2, -s.h / 2, s.w, s.h);
  ctx.restore();
}

Frog.prototype.hit = function() {//En caso de colisionar con agua o vehiculo y no estar en un tronco o en una tortuga se llama a esta funcion que llama a death
  if(!this.onTrunk && !this.onTurtle){
    this.board.remove(this);
    this.board.add(new Death(this.x + this.w/2, this.y + this.h/2));
  }
}


//Clase de las tortugas

var tortugas = { 
  tortuga1:    {x: 0, y: 190, sprite: 'tortuga1',V: 180, D: 1},
  tortuga2:   {x: 0, y: 92, sprite: 'tortuga2', V: 100, D: 1}
};

var Tortuga = function(blueprint, override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
}

Tortuga.prototype = new Sprite();
Tortuga.prototype.baseParameters = { V: 0, D: 0,};
Tortuga.prototype.type = OBJECT_TORTUGA;

Tortuga.prototype.step = function(dt) {

  this.vx = this.V*this.D;
  this.x += this.vx*dt;
   if(this.x < -this.w || this.x > Game.width) {
        this.board.remove(this);
   }
 }

//Clase de los troncos
var trunks = {
  tronco_p:      { x: 550,   y: 248, sprite: 'tronco_p', V: 80, D:-1 },//Tronco pequeño
  tronco_m:      { x: 0,   y: 150, sprite: 'tronco_m', V: 120 , D:1 },//Tronco mediano
  tronco_g:       { x: 0,   y:  48, sprite: 'tronco_g' , V: 110, D:1 }//Tronco grande
};

var Trunk = function(blueprint) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
}

Trunk.prototype = new Sprite();
Trunk.prototype.baseParameters = { V: 0, D: 0,};
Trunk.prototype.type = OBJECT_TRONCO;

Trunk.prototype.step = function(dt) {

  this.vx = this.V*this.D;
  this.x += this.vx*dt;
  if(this.x < -this.w || this.x > Game.width) {
        this.board.remove(this);
   }
 }

//Clase de los vehiculos
var cars = {
  coche_a:       { x: 550,   y: 529, sprite: 'coche_a',     V: 100, D: -1 },//Coche azul
  coche_v:      { x: 0,   y: 481, sprite: 'coche_v',    V: 70,  D: 1 },//Coche verde
  camion_g:    { x: 550,   y: 433, sprite: 'camion_g',  V: 65,  D:-1 }, //Camión grande
  coche_am:   { x: 0,   y: 337, sprite: 'coche_am', V: 250, D: 1 },//Coche amarillo
  camion_b:  { x: 0,   y: 385, sprite: 'camion_b',V: 105, D: 1 } //Camión de bomberos
 
};

var Car = function(blueprint, override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
}

Car.prototype = new Sprite();
Car.prototype.baseParameters = { V: 0, D: 0,};
Car.prototype.type = OBJECT_VEHICULO;

Car.prototype.step = function(dt) {

  this.vx = this.V*this.D;
  this.x += this.vx*dt;
   if(this.x < -this.w || this.x > Game.width) {
        this.board.remove(this);
   }

  var vehiculo_collide = this.board.collide(this,OBJECT_PLAYER);
    if(vehiculo_collide)
      vehiculo_collide.hit();
}

//Clase para la muerte
var Death = function(centerX,centerY) {
  this.setup('muerte');
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
 
};

Death.prototype = new Sprite();

Death.prototype.step = function(dt) {
  loseGame();
};

//Clase para el agua
var Water = function(centerX, centerY) {
  this.setup('agua');
  this.x = centerX;
  this.y = centerY;

  this.step = function(dt){
    var agua_collide = this.board.collide(this,OBJECT_PLAYER);
    if(agua_collide) {
      agua_collide.hit();
    }
  }
};

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_AGUA;
Water.prototype.draw = function(ctx) {}

//Clase para la meta
var Home = function(centerX, centerY) {
  this.setup('meta');
  this.x = centerX;
  this.y = centerY;

  this.step = function(dt){
    var home_collide = this.board.collide(this, OBJECT_PLAYER);
    if(home_collide) {
      winGame();
    }
  }
};

Home.prototype = new Sprite();
Home.prototype.type = OBJECT_HOME;
Home.prototype.draw = function(ctx) {}

//Clase para el titulo
var Title = function() {
  this.setup('titulo');

  this.x = Game.width/2 - this.w/3;
  this.y = Game.height/2 - this.h + 75;

  this.step = function(dt){  }
};

Title.prototype = new Sprite();