
var sprites = {
titulo: {sx: 8, sy: 395, w: 411, h: 161, frames: 1},
fondo: {sx: 421, sy: 0, w: 550, h: 624, frames: 1},
coche_azul: {sx: 8, sy: 5, w: 90, h: 48, frames: 1},
coche_verde: {sx: 108, sy: 5, w: 96, h: 48, frames: 1},
coche_amarillo: {sx: 213, sy: 5, w: 95, h: 48, frames: 1},
camion_bomberos: {sx: 6, sy: 62, w: 125, h: 45, frames: 1},
camion_grande: {sx: 147, sy: 62, w: 200, h: 47, frames: 1},
tronco_pequeño: {sx: 270, sy: 171, w: 130, h: 40, frames: 1},
tronco_mediano: {sx: 9, sy: 122, w: 191, h: 40, frames: 1},
tronco_grande: {sx: 9, sy: 171, w: 247, h: 40, frames: 1},
calaveras: {sx: 211, sy: 128, w: 48, h: 35, frames: 4},
tile_azul: {sx: 160, sy: 226, w: 40, h: 48, frames: 1},
tile_verde: {sx: 97, sy: 224, w: 40, h: 48, frames: 1},
tile_negro: {sx: 221, sy: 224, w: 58, h: 58, frames: 1},
tortuga: {sx: 5, sy: 288, w: 51, h: 48, frames: 1},
rana: {sx: 120, sy: 340, w: 40, h: 48, frames: 1}
};

var OBJECT_PLAYER = 1,
    OBJECT_VEHICULO = 2,
    OBJECT_TRONCO = 4,
    OBJECT_TORTUGA = 8,
    OBJECT_AGUA = 16,
    OBJECT_HOME = 64;


// Creamos un nuevo objeto Sprite que servirá de prototipo a los distintos tipos de entidades:

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



/////////////////////////////////////////////////////////
//FONDO
/////////////////////////////////////////////////////////

var Fondo = function() {
  this.setup('fondo');

  this.x = 0;
  this.y = 0;

  this.step = function(dt) {}
};

Fondo.prototype = new Sprite();

/////////////////////////////////////////////////////////
//RANA
/////////////////////////////////////////////////////////

var Frog = function() {
  this.setup('rana', {vx: 0, vy: 0, maxVel: 48, jumpStep: 0.12, frame: 0, angle: 0});

  this.x = Game.width / 2 - this.w / 2;
  this.y = game.height - this.h;
  this.jumpTime = this.jumpStep;
  this.onTrunk = false;
  this.onTurtle = false;

  this.step = function(dt) {

    //Variable que nos permite controlar la velocidad de movimiento de la rana
    this.jumpTime -= dt;

    //Variables auxiliares que controlan si la rana se sale de los límites
    var auxX = this.x;
    var auxY = this.y;

    //Movimientos
    if(Game.keys['left'] && this.jumpTime < 0) {
    
      auxX += -40;
      if(auxX > 0) {
        this.x += -40;
        this.jumpTime = this.jumpStep;
        
      }
    }
    else if(Game.keys['right'] && this.jumpTime < 0) {
     
      auxX += 40;
      if(auxX < Game.width - this.w / 2) {
        this.x += 40;
        this.jumpTime = this.jumpStep;
      
        
      }
    }
    else if(Game.keys['up'] && this.jumpTime < 0) {
    
      auxY += -48;
      if(auxY >= 0) {
        this.y += -this.maxVel;
        this.jumpTime = this.jumpStep;
       
      }
    }
    else if(Game.keys['down'] && this.jumpTime < 0) {
    
      auxY += 48;
      if(auxY < Game.height) {
        this.y += 48;
        this.jumpTime = this.jumpStep;
     
      }
    }
    else { this.vx = 0; this.vy = 0; }


    //Comprobamos que colisione con el tronco
    var collision = this.board.collide(this, OBJECT_TRONCO);
    var collision2 = this.board.collide(this, OBJECT_TORTUGA);
    if(collision.sprite == 'tronco_pequeño') {
      this.onTrunk = true;
      this.vx = troncos.tronco_pequeño.V * troncos.tronco_pequeño.D;
    }
    else if(collision.sprite == 'tronco_mediano') {
      this.onTrunk = true;
      this.vx = troncos.tronco_mediano.V * troncos.tronco_mediano.D;
    }
    else if(collision.sprite == 'tronco_grande') {
      this.onTrunk = true;
      this.vx = troncos.tronco_grande.V * troncos.tronco_grande.D;
    }
    else if(collision2.sprite == 'tortuga') {
      this.onTurtle = true;
      this.vx = tortugas.tortuga.V * tortugas.tortuga.D;
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
  if(!this.frame) this.frame = 0;
  rotation = this.angle * Math.PI / 180;
  ctx.save();
  ctx.translate(this.x + s.w / 2, this.y + s.h / 2);
  ctx.rotate(rotation);
  ctx.drawImage(SpriteSheet.image, s.sx + this.frame * s.w, s.sy, s.w, s.h, 
       -s.w / 2, -s.h / 2, s.w, s.h);
  ctx.restore();
}

Frog.prototype.hit = function() {
  if(!this.onTrunk && !this.onTurtle && this.board.remove(this)){
    this.board.add(new Death(this.x + this.w/2, this.y + this.h/2));
  }
}


//////////////////////////////////////////////////////////
/// TORTUGAS
//////////////////////////////////////////////////////////

var tortugas = {
  tortuga:    {x: -40, y: 196, sprite: 'tortuga', V: 120, D: 1, frame: 0}
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

//////////////////////////////////////////////////////////
/// TRONCOS
//////////////////////////////////////////////////////////

var troncos = {
  tronco_pequeño:      { x: 550,   y: 240, sprite: 'tronco_pequeño', V: 80, D:-1 },
  tronco_mediano:      { x: 550,   y: 144, sprite: 'tronco_mediano', V: 120 , D:-1 },
  tronco_grande:       { x: 550,   y:  48, sprite: 'tronco_grande' , V: 150, D:-1 }
};

var Tronco = function(blueprint) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
}

Tronco.prototype = new Sprite();
Tronco.prototype.baseParameters = { V: 0, D: 0,};
Tronco.prototype.type = OBJECT_TRONCO;

Tronco.prototype.step = function(dt) {

  this.vx = this.V*this.D;
  this.x += this.vx*dt;
  if(this.x < -this.w || this.x > Game.width) {
        this.board.remove(this);
   }
 }

//////////////////////////////////////////////////////////
/// COCHES
//////////////////////////////////////////////////////////

var vehiculos = {
  coche_azul:       { x: -50,   y: 528, sprite: 'coche_azul',     V: 100, D: 1 },
  coche_verde:      { x: -50,   y: 480, sprite: 'coche_verde',    V: 70,  D: 1 },
  coche_amarillo:   { x: -50,   y: 336, sprite: 'coche_amarillo', V: 150, D: 1 },
  camion_bomberos:  { x: -50,   y: 384, sprite: 'camion_bomberos',V: 105, D: 1 },
  camion_grande:    { x: 550,   y: 432, sprite: 'camion_grande',  V: 65,  D:-1 }   
};

var Vehiculo = function(blueprint, override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
}

Vehiculo.prototype = new Sprite();
Vehiculo.prototype.baseParameters = { V: 0, D: 0,};
Vehiculo.prototype.type = OBJECT_VEHICULO;

Vehiculo.prototype.step = function(dt) {

  this.vx = this.V*this.D;
  this.x += this.vx*dt;
   if(this.x < -this.w || this.x > Game.width) {
        this.board.remove(this);
   }

  var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision)
      collision.hit();
}

//////////////////////////////////////////////////////////
/// MUERTE
//////////////////////////////////////////////////////////
var Death = function(centerX,centerY) {
  this.setup('calaveras', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
  this.subFrame = 0;
};

Death.prototype = new Sprite();

Death.prototype.step = function(dt) {
  this.frame = Math.floor(this.subFrame++ / 10);
  if(this.subFrame >= 40) {
      this.board.remove(this);
      loseGame();
  }
};

//////////////////////////////////////////////////////////
/// AGUA
//////////////////////////////////////////////////////////
var Water = function(centerX, centerY) {
  this.setup('tile_azul');
  this.x = centerX;
  this.y = centerY;

  this.step = function(dt){
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
      collision.hit();
    }
  }
};

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_AGUA;
Water.prototype.draw = function(ctx) {}

//////////////////////////////////////////////////////////
/// HOME
//////////////////////////////////////////////////////////
var Home = function(centerX, centerY) {
  this.setup('tile_verde');
  this.x = centerX;
  this.y = centerY;

  this.step = function(dt){
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if(collision) {
      winGame();
    }
  }
};

Home.prototype = new Sprite();
Home.prototype.type = OBJECT_HOME;
Home.prototype.draw = function(ctx) {}

/////////////////////////////////////////////////////////
/// TÍTULO
/////////////////////////////////////////////////////////
var Title = function() {
  this.setup('titulo');

  this.x = Game.width/2 - this.w/3;
  this.y = Game.height/2 - this.h + 75;

  this.step = function(dt){  }
};

Title.prototype = new Sprite();