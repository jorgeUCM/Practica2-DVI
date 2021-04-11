var level1 = [
  // Start,  Gap,  Type,   Enemy
   [ 0, 4000, 'coche_azul', 0 ],
   [ 0, 2500, 'coche_verde', 0 ],
   [ 0, 100, 'coche_amarillo', 0],
   [ 0, 5000, 'camion_bomberos', 0 ],
   [ 0, 6000, 'camion_grande', 0 ],
   [ 0, 1000, 'tronco_pequeño', 1 ],
   [ 0, 2000, 'tronco_mediano', 1 ],
   [ 0, 2000, 'tronco_grande', 1 ],
   [ 0, 100, 'tortuga', 2, {x: 0, y: 92, V: 100, D: 1}],
   [ 0, 100, 'tortuga', 2 , {x: 0, y: 190, V: 180, D: 1}]
 ];
 
 var Level = function(levelData,callback) {
   this.levelData = [];
   for(var i = 0; i < levelData.length; i++) {
     this.levelData.push(Object.create(levelData[i]));
   }
   this.t = 0;
   this.callback = callback;
 }
 
 Level.prototype.draw = function(ctx) { }
 
 Level.prototype.step = function(dt) {
   var idx = 0, remove = [], entity = null;
  // Update the current time offset
   this.t += dt*1000;
   while((entity = this.levelData[idx]) && 
         (entity[0] < this.t + 2000)) {
       // Get the enemy definition blueprint
        if (entity[3] == 0){
          var vehiculo = vehiculos[entity[2]];
          var override = entity[4];
          this.board.add(new Vehiculo(vehiculo, override));
          entity[0] += entity[1];
        }
        else if (entity[3] == 1){
          var tronco = troncos[entity[2]];
          var override = entity[4];
          this.board.add(new Tronco(tronco));
          entity[0] += entity[1];
        }else if (entity[3] == 2){
          var tortuga = tortugas[entity[2]];
          var override = entity[4];
          this.board.add(new Tortuga(tortuga, override));
          entity[0] += entity[1];
        }
     
     idx++;
   }
   // Remove any objects from the levelData that have passed
   for(var i = 0, len = remove.length; i < len; i++) {
     var idx = this.levelData.indexOf(remove[i]);
     if(idx != -1) this.levelData.splice(idx,1);
   }
 }
