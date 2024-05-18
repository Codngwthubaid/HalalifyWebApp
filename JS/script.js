console.log("Getting Started !!!");
let currentSong = new Audio
let play = document.getElementById("playBtn")
let previous = document.getElementById("previousplay")
let next = document.getElementById("nextplay")
let songs;
function convertSecondsToMinutesAndSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const FormattedMinutes = String(minutes).padStart(2, '0')
    const FormattedSeconds = String(seconds).padStart(2, '0')
    return `${FormattedMinutes} : ${FormattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (music, pause = false) => {
    currentSong.src = "/songs/" + music
    if (!pause) {
        currentSong.play()
        play.src = "Svg's/paused.svg"
    }
    document.querySelector(".songsInfo").innerHTML = decodeURI(music)
    document.querySelector(".songsTime").innerHTML = "00:00 / 00:00"
}



async function main() {
    // list of all the songs
    let songs = await getSongs()
    playMusic(songs[0], true)

    //Add an eventlistner for play pause
    play.addEventListener("click", (e) => {
        if (currentSong.paused) {
            currentSong.play(e)
            play.src = "Svg's/paused.svg"
        } else {
            currentSong.pause(e)
            play.src = "Svg's/play.svg"
        }
    })

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML +=
            `<li>
            <img src="Svg's/music.svg" alt="Music">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Ubaid</div>
                </div>
            <div>Play Now</div>
            <img class="invert" style="width: 25px;" src="Svg's/librarayPlayBtn.svg" alt="playBtn">
        </li>`

        // Add eventlister to each song
        document.querySelectorAll(".songList li").forEach(element => {
            element.addEventListener("click", (e) => {
                console.log(element.querySelector(".info").firstElementChild.innerHTML);
                playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        });

        // Function of time changing during playing the music by addeventlistener
        currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songsTime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)} / ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left = ((currentSong.currentTime) / (currentSong.duration)) * 100 + '%';
        })

        document.querySelector(".seekBar").addEventListener("click", (e) => {
            // console.log(e.target.getBoundingClientRect(),e.offsetX);
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + '%';
            currentSong.currentTime = ((currentSong.duration) * percent) / 100

        })

        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = 0 + '%'
        })

        document.querySelector(".closed").addEventListener("click", () => {
            document.querySelector(".left").style.left = -100 + '%'
        })

    }

    // addevenetlisner for previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ([index - 1] >= 0) {
            playMusic(songs[index - 1])
        }
    })
    // addevenetlisner for next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ([index + 1] > length) {
            playMusic(songs[index + 1])
        }
    })

    // Add event listner for volume management
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })

}
main()
