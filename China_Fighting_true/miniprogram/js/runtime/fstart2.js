const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let yxgz2_img = new Image()
yxgz2_img.src = 'images/yxgz_new3.png'
let fstart_img = new Image()
fstart_img.src = 'images/fstart.png'
//引导页第二页
export default class Fstart2 {

  renderFstart(ctx) {

    ctx.drawImage(
      yxgz2_img,
      screenWidth / 20, screenHeight / 20,
      screenWidth * 9 / 10, screenHeight * 9 / 10
    )
    ctx.drawImage(
      fstart_img,
      screenWidth / 8,
      screenHeight * 13 / 16,
      screenWidth * 3 / 4, screenHeight / 10
    )


    /**
     * 开始游戏按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 8,
      startY: screenHeight * 13 / 16,
      endX: screenWidth / 8 + screenWidth * 3 / 4,
      endY: screenHeight * 13 / 16 + screenHeight / 10
    }
  }
}

