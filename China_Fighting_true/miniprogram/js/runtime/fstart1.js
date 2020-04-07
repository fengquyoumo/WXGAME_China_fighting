const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let yxgz1_img = new Image()
yxgz1_img.src = 'images/yxgz_new1.png'
let nextpage_img = new Image()
nextpage_img.src = 'images/nextpage.png'

//引导页第一页
export default class Fstart1 {

  renderFstart(ctx) {

    ctx.drawImage(
      yxgz1_img,
      screenWidth / 20, screenHeight / 20,
      screenWidth * 9 / 10, screenHeight * 9 / 10
    )
    ctx.drawImage(
      nextpage_img,
      screenWidth * 19 / 40,
      screenHeight * 105 / 128,
      screenWidth * 9 / 20, screenHeight / 10
    )

    /**
     * 下一页按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth * 19 / 40,
      startY: screenHeight * 105 / 128,
      endX: screenWidth * 19 / 40 + screenWidth * 9 / 10,
      endY: screenHeight * 105 / 128 + screenHeight / 10
    }
  }
}

