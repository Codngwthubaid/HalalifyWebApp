console.log('Ready');
let currentSong = new Audio;   //global variable for music 

function SecondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "invalid input"
    }
    else {
        let Minutes = Math.floor(seconds / 60);
        let Seconds = Math.floor(seconds % 60)
        let FormattedMinutes = String(Minutes).padStart(2, '0')
        let FormattedSeconds = String(Seconds).padStart(2, '0')

        return `${FormattedMinutes}:${FormattedSeconds}`
    }
}

async function getSongs() {
    let localAPI = await fetch("http://127.0.0.1:3000/Songs/")
    let response = await localAPI.text()
    let div = document.createElement("div")
    div.innerHTML = response

    let links = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".mp3" || ".m4a")) {
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs
}

// play the music when the user on the icon
const playmusic = (track , pause = false) => {
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        Play.src = "Svg's/paused.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"


}



async function main() {
    // Get list of all the songs
    let songs = await getSongs()
    playmusic(songs[0], true)

    // Get all the songs in the playlist
    let songsUL = document.querySelector(".songs").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li><img src="Svg's/music.svg" alt="">
                                                <div class="info flex">
                                                   <div>${song.replaceAll("%20", " ")}</div>
                                                   <div>Ubaid</div>
                                                </div>
                                                <div class="playNow flex justify-content align-item">
                                                <span>PLay Now</span>
                                                <img src="Svg's/play.svg" alt="play-Img"></div>
                                                </li>`
    }

    // Attact an eventlistner to each song
    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)

        })

    })

    // Attach an event lostener for play the music previous the music and get next music
    // pasued the music and play the music
    Play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            Play.src = "Svg's/paused.svg"
        }
        else {
            currentSong.pause()
            Play.src = "Svg's/Play.svg"
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML =
            `${SecondsToMinuteSeconds(currentSong.currentTime)} / ${SecondsToMinuteSeconds(currentSong.duration)}`

    })

}

main()