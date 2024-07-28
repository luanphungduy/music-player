/*
    1. Render song --> done
    2. Scroll top --> done
    3. Play / Pause / Seek --> done
    4. CD rotate --> done
    5. Next / Previous --> done
    6. Random --> done
    7. Next / Repeat when ended --> done
    8. Active song
    9. Scroll active song into view
    10. Play song when clicked
*/


// Selector functions
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


// Variables
const PLAYER_STORAGE_KEY = 'F8_PLAYER';


const playlist = $('.playlist');
const heading = $('header h2');
const cdThumbnail = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player'); 
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('.progress');

// Application
const app = {

    // Properties of this (_this)
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs: [
        {
            name: 'Co nhan tinh x white house',
            singer: 'Thai Hoang Remix',
            image: './assets/img/Co nhan tinh x white house.png',
            path: './assets/music/Co nhan tinh x white house.mp3',
        },
        {
            name: 'East of eden',
            singer: 'Japandee Remix',
            image: './assets/img/East of eden.png',
            path: './assets/music/East of eden.mp3',
        },
        {
            name: 'Lovely',
            singer: 'Japandee Remix',
            image: './assets/img/Lovely.png',
            path: './assets/music/Lovely.mp3',
        },
        {
            name: 'Qua khu cua anh',
            singer: 'DJ DaiMeo',
            image: './assets/img/Qua khu cua anh.png',
            path: './assets/music/Qua khu cua anh.mp3',
        },
        {
            name: 'Rasputin',
            singer: 'Japandee Remix',
            image: './assets/img/Rasputin.png',
            path: './assets/music/Rasputin.mp3',
        },
        {
            name: 'Take me to infinity x close to the sun',
            singer: 'Japandee Remix',
            image: './assets/img/Take me to infinity x close to the sun.png',
            path: './assets/music/Take me to infinity x close to the sun.mp3',
        },
        {
            name: 'Thanh ti',
            singer: 'LKT Remix',
            image: './assets/img/Thanh ti.png',
            path: './assets/music/Thanh ti.mp3',
        },
        {
            name: 'This love x once again',
            singer: 'Japandee Remix',
            image: './assets/img/This love x once again.png',
            path: './assets/music/This love x once again.mp3',
        },
        {
            name: 'Tinh ve',
            singer: 'Japandee Remix',
            image: './assets/img/Tinh ve.png',
            path: './assets/music/Tinh ve.mp3',
        },
        {
            name: 'Vo kich cua em x vay giu',
            singer: 'Namper Remix',
            image: './assets/img/Vo kich cua em x vay giu.png',
            path: './assets/music/Vo kich cua em x vay giu.mp3',
        },
        {
            name: 'Most epic music event horizon',
            singer: 'Namper Remix',
            image: './assets/img/Most epic music event horizon.png',
            path: './assets/music/Most epic music event horizon.mp3',
        },
        {
            name: 'Copines x de yang gatal sa',
            singer: 'Namper Remix',
            image: './assets/img/Copines x de yang gatal sa.png',
            path: './assets/music/Copines x de yang gatal sa.mp3',
        }
    ],


    /* Methods of this (_this) */
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" 
                style="background-image: url('${song.image}');"></div> 
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        });

        playlist.innerHTML = htmls.join('');
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    handleEvents: function() {
       const _this = this;

        // Handle CD roll - pause
        const keyframes = [
            {
                transform: "rotate(360deg)"
            }
        ];
        const options = {
            duration: 10000,
            iterations: Infinity
        }
        const cdThumbAnimate = cdThumbnail.animate(keyframes, options);
        cdThumbAnimate.pause();


        // Scale CD thumbnail while scrolling
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0;
            cdThumbnail.style.opacity = newCdWidth / cdWidth;
        }

        // Play audio when click playBtn
        playBtn.onclick = function() {
            if (!_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        // Handle when audio is onplay
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Handle when audio is onpause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Handle when click nextBtn
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }

        // Handle when click prevBtn
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            }
            else {
                _this.previousSong();
            }
            audio.play();
            _this.render();
        }

        // Handle when seeking time
        progress.oninput = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Handle when progess of the song is changed 
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Handle turn on / off randomBtn
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Handle turn on / off repeatBtn
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Handle repeat or next song when audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                setTimeout(function() {
                    audio.play();
                }, 500)
            } else {
                setTimeout(function() {
                    nextBtn.click();
                }, 500)
            }
        }

        // Handle play song when click to choose
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const option = e.target.closest('.option');
            if (songNode || option) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    _this.scrollToActiveSong();
                    audio.play();
                }
                if (option) {
                    //// Logic when click option
                }
            }
        }
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    previousSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } 
        while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        
        this.loadCurrentSong();
        this.scrollToActiveSong();
    },
    
    scrollToActiveSong: function() {
        setTimeout(function() {
            const activeSong = $('.song.active');
            if (activeSong) {
                activeSong.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
        }, 100);
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvents();
        this.render();

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}



// Run the app
app.start();