/**
 * author:wjl
 * 游戏基础的精灵类
 */
//export default 指定此类可以被其他类导入
export default class Sprite {
  //构造函数
  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
    this.img = new Image() //新生成一个Image对象
    this.img.src = imgSrc   //指定图像的地址

    this.width = width      //设置图像的宽度
    this.height = height    //设置图像的高度

    this.x = x              //设置图像的起始横坐标
    this.y = y              //设置图像的起始纵坐标

    this.visible = true     //设置是否可见，在画到画布上的时候进行判断
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {        //形参是一个canvas对象
    if (!this.visible)       //不可见就不画
      return

    ctx.drawImage(           //调用画布对象的drawImage()方法将图像按照指定位置和指定宽度画到画布上
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {       //形参也是一个sprite类
    //获取形参精灵的中心
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    if (!this.visible || !sp.visible) //两个精灵都可见才继续判断是否触碰
      return false
    //中心点检测法
    return !!(spX >= this.x
      && spX <= this.x + this.width
      && spY >= this.y
      && spY <= this.y + this.height)
  }
}
