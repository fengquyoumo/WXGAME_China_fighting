import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance)
      return instance

    instance = this

    this.pool = new Pool()
    //首次引导1
    this.fstart = true
    //首次引导2
    this.flag = true
    //最高分
    this.highestscore = 0
    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.enemys = []
    this.masks = []
    this.sarss = []
    this.animations = []
    this.gameOver = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
 * 回收口罩，进入对象池
 * 此后不进入帧循环
 */
  removeMasks(mask) {
    let temp = this.masks.shift()

    temp.visible = false

    this.pool.recover('mask', mask)
  }

  /**
 * 回收病毒，进入对象池
 * 此后不进入帧循环
 */
  removeSarss(sars) {
    let temp = this.sarss.shift()

    temp.visible = false

    this.pool.recover('sars', sars)
  }

}
