
         /**
       * 1. Render songs
       * 2. Scroll top
       * 3. Play/ pause/ seek
       * 4. CD rotate
       * 5. Next/ prev
       * 6. Random
       * 7. Next / Repeat when ended
       * 8. Active song
       * 9. Scroll active song into view
       * 10. Play song when click
       */

          const $ = document.querySelector.bind(document);
          const $$ = document.querySelectorAll.bind(document);
    
          const playlist = $('.playlist');
          const titleMusic = $('.title-music');
          const authorMusic = $('.author-music');
          const cdThumb = $('.cd-thumb');
          const audio = $('#audio');
          const btnPlay = $('.btn-toggle-play');
          const player = $('.player');
          const heart = $('.heart-music');
          const cd = $('.cd');
          const progress = $('#progress')
          const btnNext = $('.btn-next')
          const btnPrev = $('.btn-prev')
          const btnRandom = $('.btn-random')
          const btnRepeat = $('.btn-repeat')
          const PLAYER_STORAGE_KEY = 'MUSIC_HUYLE'
    
          const app = {
            isPlay: false,
            isHeart: false,
            isRandom: false,
            isRepeat: false,
            currentIndex: 0,
            config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
            setConfig: function(key, value){
              this.config[key] = value;
              localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
            },

            songs: [
              {
                name: 'Dịu Dàng Em Đến',
                singer: 'Erik',
                path: '../asset/music/DiuDangEmDen_ERIKNinjaZ.mp3',
                image: '../asset/img/song1.jpg',
              },
              {
                name: 'Gone',
                singer: 'ROSÉ',
                path: '../asset/music/Gone_ROSE.mp3',
                image: '../asset/img/song2.jpg',
              },
              {
                name: 'LALISA',
                singer: 'Lisa',
                path: '../asset/music/Lalisa_LISA.mp3',
                image: '../asset/img/song3.jpg',
              },
              {
                name: 'Lỡ Say Bye Là Bye',
                singer: 'Changg - Lemese',
                path: '../asset/music/LoSayByeLaBye_LemeseChangg.mp3',
                image: '../asset/img/song4.jpg',
              },
              {
                name: 'MONEY',
                singer: 'Lisa',
                path: '../asset/music/Money_LISA.mp3',
                image:'../asset/img/song5.jpg' ,
              },
              {
                name: 'Sao Anh Chưa Về Nhà',
                singer: 'AMEE - Ricky Star',
                path: '../asset/music/SaoAnhChuaVeNhaZeapleeRemix_AMeeRickyStar.mp3',
                image: '../asset/img/song6.jpg',
              },
              {
                name: 'Túy Âm',
                singer: 'Xesi - Masew - Nhật Nguyễn',
                path: '../asset/music/TuyAm_XesiMasewNhatNguyen.mp3',
                image: '../asset/img/song7.jpg',
              },
              {
                name: 'Em Không Hiểu',
                singer: 'Changg - Minh Huy',
                path: '../asset/music/EmKhongHieu_ChanggMinhHuy.mp3',
                image: '../asset/img/song8.jpg',
              },
              {
                name: 'Anh Nhà Ở Đâu Thế ?',
                singer: 'AMEE - BRay',
                path: '../asset/music/AnhNhaODauThe_AMEEBRay.mp3',
                image: '../asset/img/song9.jpg',
              }
            ],

            render: function(){
              htmls = this.songs.map( (song, index) => {
                return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}"  data-index = ${index}>
                  <div class="thumb" 
                    style="background-image: url('${song.image}');">
                  </div>
    
                  <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                  </div>
    
                  <div class="option">
                    <i class="fas fa-ellipsis-v"></i>
                  </div>
                </div>
                `
              });
    
              playlist.innerHTML = htmls.join('');
            },

            defineProperties : function(){
              Object.defineProperty(this, 'currentSong', {
                get: function(){
                  return this.songs[this.currentIndex]
                }
              })
            },
    
            handleEvents : function(){
                /**
                 *
                  const cdWidth = cd.offsetWidth;
                  playlist.onscroll = function() {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const newCdWidth = cdWidth - scrollTop;
                    // Khi croll nhanh giá trị newCdWidth trả về giá trị âm nên kiểm tra
                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                    cd.style.opacity = newCdWidth / cdWidth
                  }
                 */
              
              // Xử lí khi CD xoay

              const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg'}
              ], {
                duration: 10000,
                iterations: Infinity
              });

              cdThumbAnimate.pause();
              
              // Xử lí khi click vào nút play
              btnPlay.onclick = () => {
                if(this.isPlay){
                  audio.pause();
                }else{
                  audio.play();
                }
              },

              // Xử lí khi nhạc được play
              audio.onplay = () =>{
                player.classList.add('playing')
                this.isPlay = true
                cdThumbAnimate.play()
              }

              // Xử lí khi nhạc bị pause
              audio.onpause = () => {
                player.classList.remove('playing')
                this.isPlay = false
                cdThumbAnimate.pause()
              },

              // Xử lí khi yêu thích
              heart.onclick = () => {
                if(this.isHeart){
                  this.isHeart = false;
                  heart.classList.remove('heart');
                }else{
                  this.isHeart = true;
                  heart.classList.add('heart');
                }
              }

              // Xử lí khi tiến độ bài hát thay đổi
              audio.ontimeupdate = () => {
                const progressPercent = Math.ceil(audio.currentTime / audio.duration * 100);
                if(progressPercent){
                  progress.value = progressPercent;
                }
              }

              // Xử kí khi tua bài hát
              progress.oninput = (e) => {
                // Cho audio dừng
                audio.pause();
                // Sau 0.5s cho play
                setTimeout(() => {
                  audio.play();
                }, 300);
                const seekTime = e.target.value * audio.duration / 100
                audio.currentTime = seekTime;
              }

              // Xử lí khi nhấn nút next bài hát
              btnNext.onclick = () => {
                if(this.isRandom){
                  this.playRandomSong();
                }else{
                  this.nextSong();
                }        
                progress.value = 0;
                audio.play()
                this.render()
                this.scrollToActiveView()
              }

              btnPrev.onclick = () => {
                if(this.isRandom){
                  this.playRandomSong();
                }else{
                  this.prevSong();
                }   
                progress.value = 0;
                audio.play()
                this.render()
                this.scrollToActiveView()
              }

              // Xử lí khi random bài hát
              btnRandom.onclick = () => {
                this.isRandom = !this.isRandom;
                this.setConfig('isRandom', this.isRandom)
                btnRandom.classList.toggle('active', this.isRandom);

              }

              // Xử lí khi lặp bài hát
              btnRepeat.onclick = () => {
                this.isRepeat = !this.isRepeat;
                this.setConfig('isRepeat', this.isRepeat)
                btnRepeat.classList.toggle('active', this.isRepeat);
              }

              // Xử lí next bài hát khi bài hát kết thúc
              audio.onended = () => {
                if(this.isRepeat){
                  progress.value = 0;
                  audio.play();
                }
                else{
                  btnNext.click();
                }
                
              }

              // Xử lí khi click vào bài hát
              playlist.onclick = (e) => {
                const songNode = e.target.closest('.song:not(.active)');
                if(songNode || e.target.closest('.option')){
                  if(songNode){
                    this.currentIndex = Number(songNode.dataset.index)
                    this.loadCurrentSong();
                    this.render();
                    progress.value = 0;
                    audio.play();
                  }
                }
              }


 
            },
            scrollToActiveView : function(){
              setTimeout(()=>{
                $('.song.active').scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                })
              }, 200)
            },

            loadConfig : function(){
              this.isRandom = this.config.isRandom
              this.isRepeat = this.config.isRepeat
            },

            loadCurrentSong : function(){
              titleMusic.innerText = this.currentSong.name;
              authorMusic.innerText = this.currentSong.singer;
              cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
              audio.src = this.currentSong.path
            },

            nextSong : function(){
              this.currentIndex++;
              if(this.currentIndex >= this.songs.length){
                this.currentIndex = 0;
              }
              this.loadCurrentSong();
            },

            prevSong : function(){
              this.currentIndex--;
              if(this.currentIndex < 0){
                this.currentIndex = this.songs.length - 1;
              }
              this.loadCurrentSong();
            },

            playRandomSong : function(){
              let newIndexSong
              do{
                newIndexSong = Math.floor(Math.random() * this.songs.length)
              }
              while(this.currentIndex == newIndexSong);

              this.currentIndex = newIndexSong;
              this.loadCurrentSong()
            },

            
    
            start : function (){
              //Gán cấu hình config vào ứng dụng
              this.loadConfig();

              // Định nghĩa các thuộc tính cho Object
              this.defineProperties();

              // Lắng nghe / Xử lí các sự kiện (DOM events)
              this.handleEvents();

              this.loadCurrentSong();
              
              // Render playlist
              this.render();

              //Hiển thị trạng thái ban đầu của random & repeat
              btnRandom.classList.toggle('active', this.isRandom);
              btnRepeat.classList.toggle('active', this.isRepeat);
            }
          }
    
    
          app.start();