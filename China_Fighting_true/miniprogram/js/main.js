//首先引入所有要使用到的类
import Player from './player/hero'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import Fstart1 from './runtime/fstart1'
import Fstart2 from './runtime/fstart2'
import DataBus from './databus'
import Button from './player/button'
import Mask from './npc/mask'
import Sars from './npc/sars'
//获取屏幕高宽
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
//按键常量
const BUTTON_LEFT_IMG_SRC = 'images/left.png'
const BUTTON_RIGHT_IMG_SRC = 'images/right.png'
const BUTTON_LEFT_PUSH_IMG_SRC = 'images/left_push.png'
const BUTTON_RIGHT_PUSH_IMG_SRC = 'images/right_psuh.png'
const BUTTON_WIDTH = screenWidth / 3 - 10
const BUTTON_HEIGHT = screenWidth / 3 - 10
const Y_BUTTON = screenHeight - screenWidth / 3 - 20
const X_LEFTBUTTON = 10
const X_RIGHTBUTTON = screenWidth * 2 / 3
//速度常量 下界和上界
const SPEED_LOWER_BOUND = Math.floor(screenWidth / 100);
const SPEED_UPPER_BOUND = Math.ceil(3 * screenWidth / 100);
//获取画布，这是此游戏的主域中唯一获取的画布
let ctx = canvas.getContext('2d')

let databus = new DataBus()
let speed = SPEED_LOWER_BOUND
//获取sharedcanvas 是开放数据域中绘制的一个离屏画布。
let openDataContext = wx.getOpenDataContext()
let sharedCanvas = openDataContext.canvas
//在菜单栏中显示转发功能
wx.showShareMenu()
//监听转发，一旦用户转发则执行function函数
wx.onShareAppMessage(function () {
  return {
    /*标题*/
    title: '快来和我一起抗击疫情吧！',
    /* 转发的图片是当前画布*/
    imageUrl: canvas.toTempFilePathSync({
      destWidth: screenWidth,
      destHeight: screenHeight
    })
  }
})

/**
 * 游戏主函数
 */
export default class Main {
  //构造函数
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.restart()
  }
  //重新开始函数
  restart() {
    databus.reset()
    //避免重复监听导致出错，取消所有的监听
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    canvas.removeEventListener('touchstart', this.touchHandler_fs1)
    canvas.removeEventListener('touchstart', this.touchHandler_fs2)
    //背景
    this.bg = new BackGround(ctx)
    //玩家操纵的英雄
    this.player = new Player(ctx)
    //游戏信息类
    this.gameinfo = new GameInfo()
    //首次引导页1
    this.fstart1 = new Fstart1()
    //首次引导页2
    this.fstart2 = new Fstart2()
    //音效管理器
    this.music = new Music()
    //左右键
    this.buttonleft = new Button(BUTTON_LEFT_IMG_SRC, BUTTON_WIDTH, BUTTON_HEIGHT, X_LEFTBUTTON, Y_BUTTON)
    this.buttonright = new Button(BUTTON_RIGHT_IMG_SRC, BUTTON_WIDTH, BUTTON_HEIGHT, X_RIGHTBUTTON, Y_BUTTON)
    //触摸到左右键后，新的左右键，来给用户触摸反馈
    this.buttonleft_push = new Button(BUTTON_LEFT_PUSH_IMG_SRC, BUTTON_WIDTH, BUTTON_HEIGHT, X_LEFTBUTTON, Y_BUTTON)
    this.buttonright_push = new Button(BUTTON_RIGHT_PUSH_IMG_SRC, BUTTON_WIDTH, BUTTON_HEIGHT, X_RIGHTBUTTON, Y_BUTTON)
    //循环
    this.bindLoop = this.loop.bind(this)
    //事件绑定状态：分别对应着游戏结束、首次启动1、首次启动2
    this.hasEventBind = false
    this.hasEventBind_fs1 = false
    this.hasEventBind_fs2 = false
    //是否显示排行榜
    this.ranking = false
    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
 * 随着帧数变化的病毒生成逻辑
 * 帧数取模定义成生成的频率
 */
  sarsGenerate() {
    //每过Math.round(screenHeight / 2 / speed)这多帧的时候生成病毒
    if (databus.frame % Math.round(screenHeight / 2 / speed) == 0) {
      let sars = databus.pool.getItemByClass('sars', Sars)
      let position = sars.init(speed)
      databus.sarss.push(sars)
      return position
    }
    return -1
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate(position1) {
    //每过Math.round(screenHeight / 2 / speed)这多帧的时候生成石头
    if (databus.frame % Math.round(screenHeight / 2 / speed) == 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      let position = enemy.init(speed, position1)
      databus.enemys.push(enemy)
      return position
    }
    return -1
  }

  /**
  * 随着帧数变化的口罩生成逻辑
  * 帧数取模定义成生成的频率
  */
  maskGenerate(position1, position2) {
    //每过Math.round(screenHeight / 2 / speed)这多帧的时候生成口罩
    if (databus.frame % Math.round(screenHeight / 2 / speed) == 0) {
      let mask = databus.pool.getItemByClass('mask', Mask)
      mask.init(speed, position1, position2)
      databus.masks.push(mask)
    }
  }


  // 全局碰撞检测
  collisionDetection() {
    let that = this
    //口罩触碰的检测
    for (let i = 0, il = databus.masks.length; i < il; i++) {
      let mask = databus.masks[i]

      if (this.player.isCollideWith(mask)) {
        databus.score += 10
        //对应音频播放
        that.music.playAddpoint();
        mask.visible = false;
        break;
      }
    }
    //石头触碰的检测
    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.score -= 5
        //对应音频播放
        that.music.playStrike();
        enemy.visible = false;
        break;
      }
      //分数低于0,也会结束游戏
      if (databus.score < 0) {
        databus.gameOver = true
        break
      }
    }
    //病毒触碰的检测
    for (let i = 0, il = databus.sarss.length; i < il; i++) {
      let sars = databus.sarss[i]

      if (this.player.isCollideWith(sars)) {
        databus.gameOver = true
        break
      }
    }
    //游戏结束的处理
    if (databus.gameOver) {
      //对应音效播放
      that.music.playKo();
      //游戏结束，显示排行榜
      this.ranking = true;
      //向开放数据域发送消息，存储分数
      this.saveUserCloadStorage(databus.score);
      //向开放数据域发送消息，
      this.render_rank();
    }
  }

  // 游戏第一次开始时引导页第一页的触摸事件处理逻辑
  touchEventHandler_fs1(e) {
    e.preventDefault()
    //获取触摸点坐标
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    //获取按钮的区域
    let area_fs1 = this.fstart1.btnArea
    //检测是否摁了下一页
    if (x >= area_fs1.startX
      && x <= area_fs1.endX
      && y >= area_fs1.startY
      && y <= area_fs1.endY) {
      let that = this;
      //对应音效播放
      that.music.playClick();
      //引导页1不再显示
      databus.flag = false
    }
  }
  // 游戏第一次开始时引导页第二页的触摸事件处理逻辑
  touchEventHandler_fs2(e) {
    e.preventDefault()
    //获取触摸点坐标
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    //获取按钮的区域
    let area_fs2 = this.fstart2.btnArea
    //检测是否摁了开始游戏
    if (x >= area_fs2.startX
      && x <= area_fs2.endX
      && y >= area_fs2.startY
      && y <= area_fs2.endY) {
      let that = this;
      //对应音效播放
      that.music.playClick();
      //引导页2不再显示
      databus.fstart = false
      //开始一局游戏
      this.restart()
    }
  }
  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()
    //获取触摸点坐标
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    //获取按钮的区域
    let area = this.gameinfo.btnArea
    //判断是否摁了重新开始
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
      //不再显示排行榜
      this.ranking = false;
      let that = this;
      //对应音效播放
      that.music.playClick();
      //重新开始一局游戏
      this.restart();
    }
  }
  /**
   * 托管分数以及更新最高分
   */
  saveUserCloadStorage(score) {
    //调用API保存用户的分数 key是键 value是值
    wx.setUserCloudStorage({
      KVDataList: [{ key: 'score', value: '' + score }],
      /*成功存储用户信息后 */
      success: res => {
        console.log(res);
        // 让开放域域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
        let openDataContext = wx.getOpenDataContext();
        //向开发数据域发送更新最高分的指令
        openDataContext.postMessage({
          type: 'updateMaxScore',
        });
      },
      fail: res => {
        console.log(res);
      }
    });
  }

  /**
   * 渲染排行榜
   */
  render_rank() {
    let openDataContext = wx.getOpenDataContext();
    //向开发数据域发送显示用户朋友排行榜的指令
    openDataContext.postMessage({
      type: 'friends'
    });
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    //整体清空
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    //渲染背景
    this.bg.render(ctx)
    //绘制每一个sars、enemy、mask
    databus.sarss.forEach((item) => {
      item.drawToCanvas(ctx)
    })
    databus.enemys.forEach((item) => {
      item.drawToCanvas(ctx)
    })
    databus.masks.forEach((item) => {
      item.drawToCanvas(ctx)
    })
    //绘制英雄
    this.player.drawToCanvas(ctx)
    //绘制左键和右键，如果按键被触摸着则显示被摁下去的按键
    if (this.player.left_touched)
      this.buttonleft_push.drawToCanvas(ctx)
    else
      this.buttonleft.drawToCanvas(ctx)
    if (this.player.right_touched)
      this.buttonright_push.drawToCanvas(ctx)
    else
      this.buttonright.drawToCanvas(ctx)
    //ctx.fillstyle('20px Arial')
    ctx.font = "20px Arial"
    ctx.fillText('如有bug或更多建议', 
    screenWidth/2-85, screenHeight*19/20)
    ctx.fillText('请添加QQ：1455117463',
      screenWidth / 2 - 110, screenHeight )
    //每30帧分数+1
    if (!databus.fstart && !databus.gameOver && databus.frame % 30 == 0)
      databus.score += 1
    //绘制所有的动画
    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })
    //渲染游戏数据
    this.gameinfo.renderGameScore(ctx, databus.score)
    if (databus.fstart) {
      //引导页第一页
      if (databus.flag) {
        this.fstart1.renderFstart(ctx)
        speed = SPEED_LOWER_BOUND
        if (!this.hasEventBind_fs1) {
          this.hasEventBind_fs1 = true
          this.touchHandler_fs1 = this.touchEventHandler_fs1.bind(this)
          canvas.addEventListener('touchstart', this.touchHandler_fs1)
          //canvas.removeEventListener('touchstart', this.touchHandler_fs)
        }
      }
      //引导页第二页
      if (!databus.flag) {
        this.fstart2.renderFstart(ctx)
        speed = SPEED_LOWER_BOUND
        if (!this.hasEventBind_fs2) {
          this.hasEventBind_fs2 = true
          this.touchHandler_fs2 = this.touchEventHandler_fs2.bind(this)
          canvas.addEventListener('touchstart', this.touchHandler_fs2)
          //canvas.removeEventListener('touchstart', this.touchHandler_fs)
        }
      }
    }
    // 游戏结束停止帧循环
    if (databus.gameOver) {
      //绘制游戏结束
      this.gameinfo.renderGameOver(ctx, databus.score, databus.highestscore)
      //绘制离屏画布 sharedcanvas
      if (this.ranking) {
        ctx.drawImage(sharedCanvas, 0, 0,
          screenWidth, screenHeight);
      }
      //重置速度
      speed = SPEED_LOWER_BOUND
      //绑定重新开始按钮的监听
      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {

    if (databus.gameOver || databus.fstart)
      return;
    //更新背景
    this.bg.update()
    //每500帧更新整体速度
    if (databus.frame % 500 == 0) {
      if (speed < SPEED_UPPER_BOUND)
        speed++
    }
    //更新所有对象的速度和位置
    databus.enemys.forEach((item) => {
      item.update()
      item.setSpeed(speed)
    })
    databus.sarss.forEach((item) => {
      item.update()
      item.setSpeed(speed)
    })
    databus.masks.forEach((item) => {
      item.update()
      item.setSpeed(speed)
    })
    //生成新的sars、enemy、mask
    let position1 = this.sarsGenerate()
    let position2 = this.enemyGenerate(position1)
    this.maskGenerate(position1, position2)

    this.collisionDetection()
    /*debug的中间数据 */
    if (databus.frame % 50 === 0) {
      console.log(databus.enemys.length, databus.masks.length, speed, databus.frame)
    }
  }

  // 实现游戏帧循环
  loop() {
    //帧数增加
    databus.frame++
    //先更新，后渲染
    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
