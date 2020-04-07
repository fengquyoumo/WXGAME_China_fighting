import Sprite from '../base/sprite'
import DataBus from '../databus'
import Button from './button'
//获取屏幕高度和宽度
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
//按键常量
const BUTTON_WIDTH = screenWidth / 3 - 10
const BUTTON_HEIGHT = screenWidth / 3 - 10
const BUTTON_LEFT_PUSH_IMG_SRC = 'images/left_push.png'
const BUTTON_RIGHT_PUSH_IMG_SRC = 'images/right.png'
const Y_BUTTON = screenHeight - screenWidth / 3 - 20
const X_LEFTBUTTON = 10
const X_RIGHTBUTTON = screenWidth * 2 / 3
//玩家相关常量设置
const PLAYER_IMG_SRC = 'images/car.png'
const PLAYER_WIDTH = screenWidth / 3 - 30
const PLAYER_HEIGHT = screenWidth / 3 - 30
//固定的三条赛道的位置（与npc类有略微区别，以美观为主体）
const LEFT_X = screenWidth / 6 - PLAYER_WIDTH / 2 + screenWidth / 40
const MID_X = screenWidth / 2 - PLAYER_WIDTH / 2 + screenWidth / 80
const RIGHT_X = screenWidth * 5 / 6 - PLAYER_WIDTH / 2

let databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = MID_X
    this.y = screenHeight - this.height * 2 - 30

    // 用于在手指移动的时候标识手指是否已经在按键上了
    this.left_touched = false
    this.right_touched = false

    // 初始化事件监听
    this.initEvent()
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在左键上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在左键上的布尔值
   */
  checkIsFingerOnLeft(x, y) {
    //将按钮的实际区域扩大30px
    const deviation = 30

    return !!(x >= X_LEFTBUTTON - deviation
      && y >= Y_BUTTON - deviation
      && x <= X_LEFTBUTTON + BUTTON_WIDTH + deviation
      && y <= Y_BUTTON + BUTTON_HEIGHT + deviation)
  }
  /**
  * 当手指触摸屏幕的时候
  * 判断手指是否在右键上
  * @param {Number} x: 手指的X轴坐标
  * @param {Number} y: 手指的Y轴坐标
  * @return {Boolean}: 用于标识手指是否在右键上的布尔值
  */
  checkIsFingerOnRight(x, y) {
    //将按钮的实际区域扩大30px
    const deviation = 30

    return !!(x >= X_RIGHTBUTTON - deviation
      && y >= Y_BUTTON - deviation
      && x <= X_RIGHTBUTTON + BUTTON_WIDTH + deviation
      && y <= Y_BUTTON + BUTTON_HEIGHT + deviation)
  }


  /**
   * 根据手指的位置设置英雄的位置
   * 同时限定英雄的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(direction) {
    //方向为1则左移
    if (direction == 1) {
      if (this.x == MID_X)
        this.x = LEFT_X
      else if (this.x == RIGHT_X)
        this.x = MID_X
    }
    //方向为2则左移
    else if (direction == 2) {
      if (this.x == LEFT_X)
        this.x = MID_X
      else if (this.x == MID_X)
        this.x = RIGHT_X
    }
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变英雄的位置
   */
  initEvent() {
    //触摸开始时事件
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()
      //获取触摸点坐标
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      //判断是否触摸在左键上
      if (this.checkIsFingerOnLeft(x, y)) {
        this.left_touched = true
        this.setAirPosAcrossFingerPosZ(1)
      }//判断是否触摸在右键上
      else if (this.checkIsFingerOnRight(x, y)) {
        this.right_touched = true
        this.setAirPosAcrossFingerPosZ(2)
      }

    }).bind(this))
    //触摸结束时事件
    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      this.left_touched = false
      this.right_touched = false
    }).bind(this))
  }

}
