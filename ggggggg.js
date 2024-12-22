class Weapon {
  constructor(name, attack, durability, range) {
    this.name = name;
    this.attack = attack;
    this.durability = durability;
    this.initDurability = durability; // Сохраняем начальную долговечность
    this.range = range;
  }

  takeDamage(damage) {
    this.durability = Math.max(0, this.durability - damage);
  }

  getDamage() {
    if (this.durability <= 0) {
      return 0;
    }
    if (this.durability >= this.initDurability * 0.3) {
      return this.attack;
    } else {
      return this.attack / 2;
    }
  }

  isBroken() {
    return this.durability === 0;
  }
}


class Arm extends Weapon {
  constructor() {
    super('Рука', 1, Infinity, 1);
  }
    takeDamage(damage) {
    //Рука не может сломаться, поэтому ничего не делаем
    }
    getDamage() {
        return this.attack;
    }
}

class Sword extends Weapon {
  constructor() {
    super('Меч', 25, 500, 1);
  }
}

class LongSword extends Weapon {
  constructor() {
    super('Длинный меч', 35, 700, 1);
  }
}

class Bow extends Weapon {
  constructor() {
    super('Лук', 10, 200, 3);
  }
}

class LongBow extends Weapon {
    constructor() {
      super('Длинный лук', 15, 300, 4);
    }
  }

class Staff extends Weapon {
  constructor() {
    super('Посох', 8, 300, 2);
  }
}

class MightyStaff extends Weapon {
    constructor() {
      super('Могущественный посох', 20, 400, 3);
    }
  }

class Knife extends Weapon {
    constructor() {
      super('Нож', 5, 300, 1);
    }
  }
class Axe extends Sword {
    constructor() {
        super();
        this.name = 'Секира';
        this.attack = 27;
        this.durability = 800;
        this.initDurability = 800;
      }
    }
class StormStaff extends Staff {
    constructor() {
        super();
        this.name = 'Посох Бури';
        this.attack = 10;
        this.range = 3;
    }
}

class Player {
    constructor(position, name) {
        this.health = 100;
        this.mana = 20;
        this.speed = 1;
        this.attack = 10;
        this.agility = 5;
        this.luck = 10;
        this.description = 'Игрок';
        this.weapon = new Arm(); // Используем новый экземпляр Arm
        this.position = position;
        this.name = name;
    }

    getLuck() {
        const randomNumber = Math.random() * 100;
        return (randomNumber + this.luck) / 100;
    }

    getDamage(distance) {
        if (distance > this.weapon.range) {
            return 0;
        }
        const weaponDamage = this.weapon.getDamage();
        return (this.attack + weaponDamage) * this.getLuck() / distance;
    }

    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        console.log(`${this.name} получил урон ${damage}. Осталось ${this.health} здоровья`)
    }

    isDead() {
        return this.health === 0;
    }

    changeWeapon(weapon) {
        this.weapon = weapon;
    }
    moveLeft(distance){
      this.position = Math.max(this.position - Math.min(distance,this.speed),0);
    }
    moveRight(distance){
      this.position +=  Math.min(distance,this.speed);
    }
    move(distance){
      if (distance < 0){
        this.moveLeft(Math.abs(distance))
      }else{
        this.moveRight(distance)
      }
    }
    isAttackBlocked(){
      return this.getLuck() > (100- this.luck) / 100
    }
    dodged(){
      return this.getLuck() > (100- this.agility - this.speed *3) / 100
    }
    takeAttack(damage) {
      if (this.isAttackBlocked()) {
           this.weapon.takeDamage(damage)
           console.log(`${this.name} заблокировал атаку. Оружие изношено`)
        } else if(this.dodged()){
             console.log(`${this.name} увернулся от атаки`)
        } else {
          this.takeDamage(damage);
      }
    }
    checkWeapon(){
        if (this.weapon.isBroken()) {
            console.log(`${this.name} ломает оружие. Меняет на новое.`)
            if(this.weapon instanceof Sword || this.weapon instanceof Bow || this.weapon instanceof Staff){
              this.changeWeapon(new Knife())
            } else if (this.weapon instanceof Axe || this.weapon instanceof LongBow || this.weapon instanceof StormStaff || this.weapon instanceof Knife){
              this.changeWeapon(new Arm())
            }

          }
    }
    tryAttack(enemy) {
        const distance = Math.abs(this.position - enemy.position);
        if(distance > this.weapon.range){
            console.log(`${this.name} не может атаковать. Слишком далеко.`)
            return;
        }
          this.weapon.takeDamage(10 * this.getLuck())
        let damage = this.getDamage(distance)
        if (this.position === enemy.position){
          console.log(`${this.name} наносит двойной урон ${enemy.name} так как он стоит вплотную`)
            enemy.moveRight(1)
          enemy.takeAttack(damage * 2);
        }else{
            console.log(`${this.name} наносит урон ${enemy.name}`)
          enemy.takeAttack(damage);
        }
        this.checkWeapon();
      }

    selectEnemy(players){
        let enemies = players.filter(player => player !== this && !player.isDead())
      if(enemies.length === 0){
        return null
      }
        let enemy = enemies.reduce((prev,current) => {
            if(current.health < prev.health){
                return current
            }else{
                return prev
            }
        })
        return enemy;
    }
    moveToEnemy(enemy){
        if(!enemy){
            console.log(`${this.name} не нашел врагов и стоит на месте.`)
            return;
        }
        const distance = this.position - enemy.position;
        if(distance > 0){
            this.move(-this.speed)
        }else if (distance < 0){
          this.move(this.speed)
        }else {
            console.log(`${this.name} уже стоит рядом с ${enemy.name}`)
        }
    }
    ход(players){
        if (this.isDead()){
            return;
        }
        let enemy = this.selectEnemy(players)
        this.moveToEnemy(enemy)
        this.tryAttack(enemy)
    }
}

class Warrior extends Player {
    constructor(position, name) {
        super(position, name);
        this.health = 120;
        this.speed = 2;
        this.description = 'Воин';
        this.changeWeapon(new Sword());
    }
      takeDamage(damage) {
        if (this.health < this.health*0.5 && this.getLuck() > 0.8) {
          if (this.mana > 0){
           this.mana = Math.max(0, this.mana - damage);
          }else{
            this.health = Math.max(0, this.health - damage);
          }

        }
       else {
          this.health = Math.max(0, this.health - damage);
        }
      }
}

class Archer extends Player {
    constructor(position, name) {
        super(position, name);
        this.health = 80;
        this.mana = 35;
        this.agility = 10;
        this.attack = 5;
        this.description = 'Лучник';
        this.changeWeapon(new Bow());
    }
    getDamage(distance) {
        if (distance > this.weapon.range) {
            return 0;
        }
        const weaponDamage = this.weapon.getDamage();
        return (this.attack + weaponDamage) * this.getLuck() * distance / this.weapon.range;
    }
}
class Mage extends Player {
    constructor(position, name) {
        super(position, name);
        this.health = 70;
        this.mana = 100;
        this.agility = 8;
        this.attack = 5;
        this.description = 'Маг';
        this.changeWeapon(new Staff());
    }
        takeDamage(damage) {
        if (this.mana > this.mana*0.5) {
          this.health = Math.max(0, this.health - (damage/2));
          this.mana = Math.max(0, this.mana - 12);

        }
        else {
          this.health = Math.max(0, this.health - damage);
        }
      }
}
class Gnome extends Warrior {
    constructor(position, name) {
      super(position, name);
      this.health = 130;
      this.attack = 15;
      this.luck = 20;
      this.description = 'Гном';
      this.changeWeapon(new Axe());
      this.damageCount = 0;
    }
    takeDamage(damage) {
        this.damageCount++;
        if(this.damageCount % 6 === 0 && this.getLuck() > 0.5) {
          super.takeDamage(damage/2)
        } else {
          super.takeDamage(damage)
        }
    }
  }
  class Crossbowman extends Archer {
    constructor(position, name) {
      super(position, name);
      this.health = 85;
      this.attack = 8;
      this.agility = 20;
      this.luck = 15;
      this.description = 'Арбалетчик';
      this.changeWeapon(new LongBow());
    }
  }
class Demiurge extends Mage {
    constructor(position, name) {
      super(position, name);
      this.health = 80;
      this.mana = 120;
      this.attack = 6;
      this.luck = 12;
      this.description = 'Демиург';
      this.changeWeapon(new StormStaff());
    }
    getDamage(distance) {
        let damage = super.getDamage(distance)
        if(this.mana > 0 && this.getLuck() > 0.6){
          return damage * 1.5;
        } else {
          return damage;
        }
    }
  }
function play(players) {
    let round = 1;
    while(players.filter(player => !player.isDead()).length > 1){
        console.log(`\n======== Раунд ${round} ========`);
      players.forEach(player => player.ход(players))
      round++;
    }
      let winner = players.find(player => !player.isDead())
    if (winner){
        console.log(`\n Победил ${winner.name}!`)
    } else {
        console.log('\nНикто не выжил в этом кровавом побоище...')
    }
}
let player = new Warrior(0, "Алёша Попович");
let archer = new Archer(2, "Леголас");

console.log(archer.health, archer.position);
player.tryAttack(archer);
console.log(archer.health, archer.position);
player.moveRight(1);
player.tryAttack(archer);
console.log(archer.health, archer.position);
player.moveRight(1);
player.tryAttack(archer);
console.log(archer.health, archer.position);
let player3 = new Warrior(1,"Добрыня Никитич")
let archer2 = new Archer(0,"Леголас")

play([player, archer, player3, archer2])