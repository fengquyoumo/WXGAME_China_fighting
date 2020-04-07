let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/piano.mp3'

    this.clickAudio = new Audio()
    this.clickAudio.src = 'audio/click.mp3'

    this.strikeAudio = new Audio()
    this.strikeAudio.src = 'audio/strike.mp3'

    this.addpointAudio = new Audio()
    this.addpointAudio.src ='audio/addpoint.mp3'

    this.koAudio = new Audio()
    this.koAudio.src = 'audio/aou.mp3'

    this.playBgm()
  }

  playBgm() {
    //this.bgmAudio.currentTime = 0
    this.bgmAudio.play()
  }

  playClick() {
    this.clickAudio.currentTime = 0
    this.clickAudio.play()
  }

  playStrike() {
    this.strikeAudio.currentTime = 0
    this.strikeAudio.play()
  }

  playAddpoint() {
    this.addpointAudio.currentTime = 0
    this.addpointAudio.play()
  }

  playKo() {
    this.koAudio.currentTime = 0
    this.koAudio.play()
  }
}
