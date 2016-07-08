
class Bomb extends Block
{

  texture;
  model;
  waveLevel = {
    size: null,
    level: 1,
    wave: null
  };

  constructor(texture, x, y, lvl) {
    super({
      blocked: true,
      destroy: true
    });

    this.texture = texture;

    this.model = new PIXI.Sprite(this.texture);

    this.model._a_name = 'bomb'; 

    this.model.position.x = x;
    this.model.position.y = y;
    this.model.width = this.size;
    this.model.height = this.size;

    this.model.size = this.size;
    this.model.blocked = this.blocked;
    this.model.destroy = this.destroy;

    this.waveLevel.size = this.size;
    this.waveLevel.level = lvl;
    this.waveLevel.wave = this.waveLevel.size * this.waveLevel.level;
  };

}