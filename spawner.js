var level1 = [
  // Start,  Gap,  Type,   Enemy
   [ 0, 3000, 'coche_azul', 0 ],
   [ 2, 2500, 'coche_verde', 0 ],
   [ 3, 100, 'coche_amarillo', 0],
   [ 3, 5000, 'camion_bomberos', 0 ],
   [ 4, 5000, 'camion_grande', 0 ],
   [ 3, 2000, 'tronco_pequeño', 1 ],
   [ 2, 5000, 'tronco_mediano', 1 ],
   [ 1, 5000, 'tronco_grande', 1 ],
   [ 1, 5000, 'tortuga', 2],
   [ 1, 5000, 'tortuga', 2 , {x: 0, y: 100}]
 ];
 
 var Spawner = function(levelData,callback) {
   this.levelData = [];
   for(var i = 0; i < levelData.length; i++) {
     this.levelData.push(Object.create(levelData[i]));
   }
   this.t = 0;
   this.callback = callback;
 }
 
 Spawner.prototype.draw = function(ctx) { }
 
 Spawner.prototype.step = function(dt) {
   var idx = 0, remove = [], curShip = null;
  // Update the current time offset
   this.t += dt*1000;
   while((curShip = this.levelData[idx]) && 
         (curShip[0] < this.t)) {
       // Get the enemy definition blueprint
        if (curShip[3] == 0){
          var vehiculo = vehiculos[curShip[2]];
          var override = curShip[4];
          this.board.add(new Vehiculo(vehiculo, override));
        }
        else if (curShip[3] == 1){
          var tronco = troncos[curShip[2]];
          this.board.add(new Tronco(tronco));
        }else if (curShip[3] == 2){
          var tortuga = tortugas[curShip[2]];
          var override = curShip[4];
          this.board.add(new Tortuga(tortuga, override));
        }
       // Increment the start time by the gap
       curShip[0] += curShip[1];
     
     idx++;
   }
   // Remove any objects from the levelData that have passed
   for(var i = 0, len = remove.length; i < len; i++) {
     var idx = this.levelData.indexOf(remove[i]);
     if(idx != -1) this.levelData.splice(idx,1);
   }
 
   // If there are no more enemies on the board or in 
   // levelData, this level is done
   //if(this.levelData.length == 0 && this.board.cnt[OBJECT_VEHICULO] == 0) {
    // if(this.callback) this.callback();
   //}
 }
