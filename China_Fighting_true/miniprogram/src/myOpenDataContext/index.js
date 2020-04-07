let sharedCanvas = wx.getSharedCanvas();
let context = sharedCanvas.getContext('2d');

const screenWidth = wx.getSystemInfoSync().screenWidth;
const screenHeight = wx.getSystemInfoSync().screenHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;
const tx_width = screenWidth / 8;
const tx_height = screenHeight / 10;
const itemHeight = screenHeight / 10;

let myScore = undefined;
let myInfo = {};
let myRank = undefined;
let nowpage = 1;
let maxpage = 0;
let test = 1;
initEle();
getUserInfo();

// 初始化标题返回按钮等元素
function initEle() {
  context.restore();
  context.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);

  // 画背景
  context.fillStyle = 'rgba(0, 0, 28, 0)';
  context.fillRect(0, 0, screenWidth * ratio, screenHeight * ratio);

  // 排名列表外框
  context.fillStyle = '#cbdcf1';
  context.fillRect(screenWidth / 15, screenHeight / 7, screenWidth * 13 / 15, screenHeight / 2);


  // 自己排名外框
  context.fillStyle = '#eeeeff';
  context.fillRect(screenWidth / 15, screenHeight * 11 / 16,
    screenWidth * 13 / 15, itemHeight);

  // 翻页按钮
  let lastpage_ph_img = wx.createImage();
  lastpage_ph_img.src = 'images/lastpage_ph.png';
  lastpage_ph_img.onload = () => {
    context.drawImage(lastpage_ph_img,
      screenWidth / 15, screenHeight / 7 + screenHeight / 2,
      tx_width * 3 / 4, tx_height * 25 / 51);
  };
  let nextpage_ph_img = wx.createImage();
  nextpage_ph_img.src = 'images/nextpage_ph.png';
  nextpage_ph_img.onload = () => {
    context.drawImage(nextpage_ph_img,
      screenWidth * 51 / 60, screenHeight / 7 + screenHeight / 2,
      tx_width * 3 / 4, tx_height * 25 / 51);
  };
}

function initRanklist(list, pagenum) {
  // 至少绘制5个
  let length = 5;
  maxpage = Math.floor((list.length + 3) / 4);
  context.clearRect(screenWidth / 10, screenHeight / 7, screenWidth * 4 / 5, screenHeight / 2);

  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      context.fillStyle = '#cbdcf1';
    } else {
      context.fillStyle = '#eeeeff';
    }
    context.fillRect(screenWidth / 15, screenHeight / 7 + i * itemHeight, screenWidth * 13 / 15, itemHeight);
  }
  //绘制title
  drawtitle();
  //绘制排行榜
  if (list && list.length > 0) {
    list.map((item, index) => {
      if (item.nickname === myInfo.nickName && item.avatarUrl === myInfo.avatarUrl && myScore < item.score)
        myScore = item.score;
      //console.log('index=', index);
      if (index >= (pagenum - 1) * 4 && index < pagenum * 4) {
        //console.log((index >= (pagenum - 1) * 4));
        //console.log((index < pagenum * 4));
        //console.log(item.nickname, item.score);
        let idx = index - (pagenum - 1) * 4 + 1;
        if (idx % 2 == 0)
          context.fillStyle = '#ffffff';
        else
          context.fillStyle = '#000000';
        //排名
        context.font = 'italic 20px Arial';
        context.fillText('No.' + (index + 1), screenWidth / 10,
          screenHeight / 7 + idx * screenHeight / 10 + screenHeight / 16)
        //头像
        let avatar = wx.createImage();
        avatar.src = item.avatarUrl;
        avatar.onload = function () {
          context.drawImage(avatar,
            screenWidth * 9 / 32, screenHeight / 7 + idx * screenHeight / 10 + tx_height / 10,
            tx_width, tx_height * 8 / 10);
        }
        //昵称
        context.font = '20px Arial';
        let nickname = item.nickname;
        if (nickname.length > 4)
          nickname = nickname.substr(0, 4) + '...';
        context.fillText(nickname, screenWidth * 9 / 32 + tx_width,
          screenHeight / 7 + idx * screenHeight / 10 + screenHeight / 16);
        //得分
        context.font = 'bold 20px Arial';
        context.fillText((item.score || 0) + 'm', screenWidth * 3 / 4,
          screenHeight / 7 + idx * screenHeight / 10 + screenHeight / 16);
      }
    });
  } else {
    // 没有数据
  }
}
//绘制标题
function drawtitle() {
  context.fillStyle = '#000';
  // 名次
  context.font = 'bold 20px Arial';
  context.fillText('排名', screenWidth / 10, screenHeight / 7 + screenHeight / 16);
  //我的好友
  context.font = 'bold 20px Arial';
  context.fillText('我的好友', screenWidth * 3 / 8, screenHeight / 7 + screenHeight / 16);
  //最高得分
  context.font = 'bold 20px Arial';
  context.fillText('得分', screenWidth * 3 / 4, screenHeight / 7 + screenHeight / 16);

}

// 绘制自己的排名
function drawMyRank() {
  if (myInfo.avatarUrl && myScore) {
    context.clearRect(screenWidth / 15, screenHeight * 11 / 16,
      screenWidth * 13 / 15, itemHeight);
    context.fillStyle = '#eeeeff';
    context.fillRect(screenWidth / 15, screenHeight * 11 / 16,
      screenWidth * 13 / 15, itemHeight);
    context.fillStyle = '#000000';
    // 自己的名次
    if (myRank !== undefined) {
      context.font = 'italic 20px Arial';
      if (myRank + 1 <= 999)
        context.fillText('No.' + (myRank + 1), screenWidth / 10, screenHeight * 7 / 10 + screenHeight / 16);
      else
        context.fillText('>No.999', screenWidth / 10, screenHeight * 7 / 10 + screenHeight / 16);
    }
    //头像
    let avatar = wx.createImage();
    avatar.src = myInfo.avatarUrl;
    avatar.onload = function () {
      context.drawImage(avatar,
        screenWidth * 9 / 32, screenHeight * 11 / 16 + tx_height / 10,
        tx_width, tx_height * 8 / 10);
    }
    //昵称
    context.font = '20px Arial';
    context.fillText(myInfo.nickName.substr(0, 4),
      screenWidth * 9 / 32 + tx_width, screenHeight * 7 / 10 + screenHeight / 16);
    //得分
    console.log(myScore);
    context.font = 'bold 20px Arial';
    context.fillText((myScore || 0) + 'm', screenWidth * 3 / 4, screenHeight * 7 / 10 + screenHeight / 16);
  }
}

function sortByScore(data) {
  let array = [];
  data.map(item => {
    let score_ = Number(item['KVDataList'][0].value) || 0;
    let mscore_ = Number(item['KVDataList'][1].value) || 0;
    console.log(item['KVDataList'][0].value, item['KVDataList'][1].value, score_, mscore_);
    if (mscore_ > score_) score_ = mscore_;
    array.push({
      avatarUrl: item.avatarUrl,
      nickname: item.nickname,
      openid: item.openid,
      score: score_ // 取最高分
    })
  })
  //排序
  array.sort((a, b) => {
    return b['score'] - a['score'];
  });
  myRank = array.findIndex((item) => {
    return item.nickname === myInfo.nickName && item.avatarUrl === myInfo.avatarUrl;
  });
  if (myRank === -1)
    myRank = array.length;
  return array;
}
// 开放域的getUserInfo 不能获取到openId, 可以在主域获取，并从主域传送
function getUserInfo() {
  wx.getUserInfo({
    openIdList: ['selfOpenId'],
    lang: 'zh_CN',
    success: res => {
      myInfo = res.data[0];
    },
    fail: res => {

    }
  })
}

// 获取自己的分数
function getMyScore() {
  wx.getUserCloudStorage({
    keyList: ['score', 'maxScore'],
    success: res => {
      let data = res;
      console.log(data);
      let lastScore = Number(data.KVDataList[0].value) || 0;
      if (!data.KVDataList[1]) {
        console.log('第一次玩');
        saveMaxScore(lastScore);
        myScore = lastScore;
      } else if (lastScore > Number(data.KVDataList[1].value)) {
        console.log('高于原先最高分');
        saveMaxScore(lastScore);
        myScore = lastScore;
      } else {
        console.log('低于原先最高分');
        myScore = Number(data.KVDataList[1].value);
      }
      //saveMaxScore(1);myScore=1;
      console.log('getmyscore', myScore);
    }
  });
}

function saveMaxScore(maxScore) {
  wx.setUserCloudStorage({
    KVDataList: [{ 'key': 'maxScore', 'value': ('' + maxScore) }],
    success: res => {
      console.log('savesuccess', maxScore);
    },
    fail: res => {
      console.log(res);
    }
  });
}

function getFriendsRanking(pagenum) {
  wx.getFriendCloudStorage({
    keyList: ['score', 'maxScore'],
    success: res => {
      let data = res.data;
      console.log(res.data);
      // drawRankList(data);
      initRanklist(sortByScore(data), pagenum);
      drawMyRank();
    }
  });
}

wx.onMessage(data => {
  if (data.type === 'updateMaxScore') {
    // 更新最高分
    console.log('更新最高分');
    getMyScore();
    console.log('update', myScore);
  } else if (data.type === 'friends') {
    console.log('显示排行榜');
    getMyScore();
    getFriendsRanking(1);
  }
});
let pageinto = false;
// 触摸翻页事件
wx.onTouchStart(e => {
  let x = e.touches[0].clientX;
  let y = e.touches[0].clientY;
  pageinto = false;
  if (x >= screenWidth / 15 && x <= screenWidth / 15 + tx_width * 3 / 4 &&
    y >= screenHeight * 41 / 64 && y <= screenHeight * 41 / 64 + tx_height * 3 / 4) {
    if (nowpage > 1) {
      nowpage--;
      pageinto = true;
    }
  }
  if (x >= screenWidth * 51 / 60 && x <= screenWidth * 51 / 60 + tx_width * 3 / 4 &&
    y >= screenHeight * 41 / 64 && y <= screenHeight * 41 / 64 + tx_height * 3 / 4) {
    if (nowpage < maxpage) {
      nowpage++;
      pageinto = true;
    }
  }

});
wx.onTouchEnd(e => {
  if (pageinto) {
    console.log('nowpage=', nowpage, 'maxpage=', maxpage);
    getFriendsRanking(nowpage);
    //drawMyRank();
  }
});