import Sprite from '../base/sprite'
import DataBus from '../databus'
//获取屏幕宽高常量
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
//固定的三条赛道的位置
const LEFT_X = screenWidth / 6 - (screenWidth / 3 - 10) / 2 + screenWidth / 20
const MID_X = screenWidth / 2 - (screenWidth / 3 - 10) / 2 + screenWidth / 40
const RIGHT_X = screenWidth * 5 / 6 - (screenWidth / 3 - 10) / 2
//stone的图像以及宽高
const ENEMY_IMG_SRC = 'images/stone.png'
const ENEMY_WIDTH = screenWidth / 3 - 20
const ENEMY_HEIGHT = screenWidth / 3 - 20
//速度常量
const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()
//随机函数
function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Sprite {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
  }
  //根据position1（sars）的位置生成stone以及初始化速度
  init(speed, position1) {
    let x = rnd(0, screenWidth) / screenWidth
    //根据随机数来初始化stone的横坐标
    if (x < 1 / 3)
      this.x = LEFT_X
    else if (x < 2 / 3)
      this.x = MID_X
    else
      this.x = RIGHT_X
    //这样设置保证stone是慢慢进入屏幕的
    this.y = -this.height
    //设置速度
    this[__.speed] = speed
    //如果说stone和sars的位置相同则石头不可见
    if (this.x == position1) {
      this.visible = false;
      //返回-1，表示stone对象并不可见，方便后续产生其他npc
      return -1
    }
    else {
      this.visible = true
      //返回位置，方便后续产生其他npc
      return this.x
    }
  }
  //设置速度
  setSpeed(speed) {
    this[__.speed] = speed
  }

  // 每一帧更新石头stone位置
  update() {
    this.y += this[__.speed]

    // 超出屏幕外 对象回收
    if (this.y > window.innerHeight + this.height)
      databus.removeEnemey(this)
  }
}
