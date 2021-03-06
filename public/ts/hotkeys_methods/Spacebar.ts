/// <reference path="../hotkeys.ts"/>
/// <reference path="../socket/game.ts"/>

function keySpacebar() {

  function showBombsValue(value, staticValue) {
    $('#bar span.bombs').text('bombs: ' + value + ' / ' + staticValue);
  }

  return {

    pressed: function() {

        for (var o = 0; o < players.length; o++) {
          if (players[o].control) {
          var currentPlayer = players[o];
          currentPlayer.position.bombImg = '../img/players/player_'+(o+1)+'/player_'+(o+1)+'_bomb.png';

            if (currentPlayer.bombsCount > 0) {
              showBombsValue(currentPlayer.bombsCount, currentPlayer.bombsValue);

              if (WORLD_MAP.containers.bombs.children.length === 0)
              {
                socket.emit('bomb coords', currentPlayer.position);
                bomb = new Bomb({ x: currentPlayer.position.x, y: currentPlayer.position.y, waveLevel: 1 }, PIXI.Texture.fromImage(currentPlayer.position.bombImg));
                WORLD_MAP.containers.bombs.addChild(bomb.model);

                if (bomb) {
                  let _firstBomb = bomb;

                  setTimeout(function() {
                    if (destroyObjects.length !== 0) {
                      bombBang(_firstBomb);
                    } else {
                      socket.emit('bomb coords_remove', _firstBomb.model.position);
                    }
                  }, 1000);
                }
              }

              else if (currentPlayer.position.x !== bomb.model.position.x || currentPlayer.position.y !== bomb.model.position.y)

              {
                socket.emit('bomb coords', currentPlayer.position);
                bomb = new Bomb({ x: currentPlayer.position.x, y: currentPlayer.position.y, waveLevel: 1 }, PIXI.Texture.fromImage(currentPlayer.position.bombImg));
                WORLD_MAP.containers.bombs.addChild(bomb.model);

                if (bomb) {
                  let _otherBomb = bomb;

                  setTimeout(function() {
                    if (destroyObjects.length !== 0) {
                      bombBang(_otherBomb);
                    } else {
                      socket.emit('bomb coords_remove', _otherBomb.model.position);
                    }
                  }, 1000);
                }
              }
            }

            // remove bombImg from player.position for decrease player.position size
            delete currentPlayer.position.bombImg;
          } // End Main If
        } // End Main For

    }

  }


  function bombBang(bomb) {
    for (var i = 0; i < destroyObjects.length; i++) {
      if (
        bomb.model.position.y === (destroyObjects[i].position.y - bomb.waveLevel.wave)&&
        bomb.model.position.x === destroyObjects[i].position.x ||
        bomb.model.position.y === (destroyObjects[i].position.y + bomb.waveLevel.wave)&&
        bomb.model.position.x === destroyObjects[i].position.x ||
        bomb.model.position.x === (destroyObjects[i].position.x - bomb.waveLevel.wave)&&
        bomb.model.position.y === destroyObjects[i].position.y ||
        bomb.model.position.x === (destroyObjects[i].position.x + bomb.waveLevel.wave)&&
        bomb.model.position.y === destroyObjects[i].position.y ||
        bomb.model.position.x === destroyObjects[i].position.x &&
        bomb.model.position.y === destroyObjects[i].position.y
        ) {

        // ..done ->
        socket.emit('bomb coords_remove', bomb.model.position);
        for (let z = 0; z < objectContainers.length; z++) {
          // findArrayValue - global function from ./functions.ts
          socket.emit('bomb bang', findArrayValue(destroyObjects, destroyObjects[i]));
        }
      } else {
        socket.emit('bomb coords_remove', bomb.model.position);
      }
    }
  }

}