const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/gameover_ph.png'
let restart_img = new Image()
restart_img.src = 'images/restart.png'
let share_img = new Image()
share_img.src = 'images/share.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#000000"
    ctx.font = "20px Axure Handwriting"

    ctx.fillText(
      "已驶路程：" + score + 'm',
      10,
      30
    )
  }

  renderGameOver(ctx, score, hscore) {
    ctx.drawImage(atlas,
      screenWidth / 20, screenHeight / 20,
      screenWidth * 9 / 10, screenHeight * 9 / 10)

    ctx.drawImage(share_img,
      screenWidth * 11 / 30, 0,    /*screenHeight / 40,*/
      screenWidth / 3, screenHeight / 20)

    ctx.fillStyle = "#000000"
    ctx.font = "20px Arial"

    ctx.fillText(
      '本次路程:' + score + 'm',
      screenWidth / 2 - 60,
      screenHeight * 43 / 64
    )

    ctx.drawImage(
      restart_img,
      screenWidth / 8,
      screenHeight * 4 / 5,
      screenWidth * 3 / 4, screenHeight / 10
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 8,
      startY: screenHeight * 4 / 5,
      endX: screenWidth / 8 + screenWidth * 3 / 4,
      endY: screenHeight * 4 / 5 + screenHeight / 10
    }
  }
}

