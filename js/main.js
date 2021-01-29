 // 设置axios的基地址
 axios.defaults.baseURL = 'https://autumnfish.cn';
 // axios.defaults.baseURL = 'http://localhost:3000';

 // 实例化vue
 var app = new Vue({
     el: "#player",
     data: {
         // 搜索关键字
         query: '张杰',
         // 歌曲列表
         musicList: [],
         // 歌曲url
         musicUrl: '',
         // 是否正在播放
         isPlay: false,
         // 歌曲热门评论
         hotComments: [],
         // 歌曲封面地址
         coverUrl: '',
         // 显示视频播放
         showVideo: false,
         // mv地址
         mvUrl: '',
         // 歌曲名
         musicName: '',
         // 歌词
         lyric: [],
         // 每个时间对应的歌词
         lrcs: {},
         //  歌曲播放时的时间位置
         currentTime: 0,
         // 歌曲总时间 32秒
         duration: 32,
         //  当前播放的歌词信息
         allKeys: [],
         //  显示隐藏歌词区域
         switch: false,
         //  词 评 切换
         msg: '词'

     },
     // 方法
     methods: {
         // 搜索歌曲
         searchMusic() {
             if (this.query == 0) {
                 return
             }
             axios.get('/search?keywords=' + this.query).then(response => {
                 // 保存内容
                 this.musicList = response.data.result.songs;
             })

             // 清空搜索
             this.query = ''
         },
         // 播放歌曲
         playMusic(musicId) {
             //  将当前播放的新信息重置为空
             //  解决当播放第二次之后歌词对应错误的bug
             //  原因大概是 以后的每首歌词都是按照第一首歌的频率滚动
             this.allKeys = [];
             // 获取歌曲url
             axios.get('/song/url?id=' + musicId).then(response => {
                 // 保存歌曲url地址
                 this.musicUrl = response.data.data[0].url
             });
             // 获取歌曲热门评论
             axios.get('/comment/hot?type=0&id=' + musicId).then(response => {
                 // console.log(response)
                 // 保存热门评论
                 this.hotComments = response.data.hotComments

             });
             // 获取歌曲封面
             axios.get('/song/detail?ids=' + musicId).then(response => {
                 // console.log(response)
                 // 设置封面
                 this.coverUrl = response.data.songs[0].al.picUrl
             });
             //获取正在播放歌曲名
             axios.get('/song/detail?ids=' + musicId).then(response => {
                 //  console.log(response.data.songs[0])
                 //  console.log(response.data.songs[0].name)
                 // 设置歌曲名
                 this.musicName = response.data.songs[0].name;
             });
             //  获取歌词
             axios.get('/lyric?id=' + musicId).then(response => {
                 var lrc = {};
                 //  console.log(response.data.lrc.lyric)
                 // 设置歌词
                 //  将每句歌词分开
                 var filterLrc = response.data.lrc.lyric.split("\n");
                 //  console.log(filterLrc);
                 // 过滤  [00:26.270]
                 var reg = /\[\d*:\d*(\.|:)\d*]/g;
                 for (let i = 0; i < filterLrc.length; i++) {
                     //  歌词时间
                     //  match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
                     var timeRegArr = filterLrc[i].match(reg);
                     //  跳过null
                     if (!timeRegArr) continue;
                     //  获取每句歌词对应的时间
                     var t = timeRegArr[0];
                     // 处理时间 [00:26.270]
                     // .match(/\[\d*/i) 截取 [00
                     // .toString() 转字符串类型
                     // .slice(1) 截取 [
                     // parseInt() 转数字类型
                     var min = parseInt(t.match(/\[\d*/i).toString().slice(1));
                     var s = parseInt(t.match(/\:\d*/i).toString().slice(1));
                     var ms = parseFloat('0' + t.match(/\.\d*/i));
                     //  console.log(ms);
                     var time = min * 60 + s + ms;
                     // 获取歌词内容
                     //  replace 替换方法
                     var lyricContent = filterLrc[i].replace(timeRegArr, '');
                     // 设置歌词
                     //  这样只能存储最后一句歌词
                     //  this.lyric = lyricContent;
                     this.lyric.push(lyricContent);
                     //  将当前时间对应的歌词,以对象的形式存到lrc中
                     lrc[time] = lyricContent;

                 }
                 this.lrcs = lrc;
                 //  console.log(this.lrcs);
                 this.getAllKeys(lrc);
             });
             this.resetLrcStyle();
             this.addEventHandle();

         },
         // audio的play事件
         play() {
             this.isPlay = true
                 // 清空mv的信息
             this.mvUrl = ''
         },
         // audio的pause事件
         pause() {
             this.isPlay = false
         },
         // 播放mv
         playMv(vid) {
             if (vid) {
                 this.showVideo = true;
                 // 获取mv信息
                 axios.get('/mv/url?id=' + vid).then(response => {
                     // console.log(response)
                     // 暂停歌曲播放
                     this.$refs.audio.pause();
                     // 获取mv地址
                     this.mvUrl = response.data.data.url;
                 });
             }
         },
         // 关闭mv界面
         closeMv() {
             this.showVideo = false;
             this.$refs.video.pause();
         },
         // 搜索历史记录中的歌曲
         historySearch(history) {
             this.query = history;
             this.searchMusic();
             this.showHistory = false;
         },
         // 获取歌曲时间 
         addEventHandle() {
             // addEventListener 监听器
             //  .addEventListener("事件",函数)
             // timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
             this.$refs.audio.addEventListener("timeupdate", () => {
                 // currentTime 属性设置或返回播放的当前位置(以秒计)
                 //  console.log(this.$refs.audio.currentTime);
                 this.currentTime = this.$refs.audio.currentTime;
             });
             //  当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件。
             this.$refs.audio.addEventListener("canplay", () => {
                 // duration 属性设置或返回播放的总时间(以秒计)
                 //  console.log(this.$refs.audio.duration);
                 this.duration = this.$refs.audio.duration;
             });
         },
         getAllKeys(lrcArr) {
             for (var key in lrcArr) {
                 this.allKeys.push(key);
             }
         },
         //  歌词滚动
         scrollLrc(index) {
             //  this.lrcsIndex = this.allKeys[index];
             if (this.currentTime > this.allKeys[index] && this.currentTime < this.allKeys[index + 1]) {
                 this.$refs.lrc.style.top = -30 * index + 50 + "px";
                 //  console.log(this.currentTime);
                 //  console.log(this.allKeys[index]);
                 this.lrcsIndex = this.allKeys[index];
             }
         },
         //  点击显示歌词
         switchBtn() {
             if (this.switch == false) {
                 this.$refs.lyriccontent.style.display = "block";
                 this.$refs.comment_wrapper.style.display = "none";
                 this.msg = "评";
                 this.switch = true;
             } else {
                 this.$refs.lyriccontent.style.display = "none";
                 this.$refs.comment_wrapper.style.display = "block";
                 this.msg = "词";
                 this.switch = false;
             }
             //  console.log("12");
         },
         //  列表切歌时，重置歌词样式
         resetLrcStyle() {
             this.$refs.lrc.style.top = 217 + "px";
         },


     },
 })