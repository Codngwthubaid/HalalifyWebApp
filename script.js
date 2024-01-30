console.log('Ready');
let currentSong = new Audio;   //global variable for music 
let songs;
let currFolder;

function SecondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    else {
        let Minutes = Math.floor(seconds / 60);
        let Seconds = Math.floor(seconds % 60)
        let FormattedMinutes = String(Minutes).padStart(2, '0')
        let FormattedSeconds = String(Seconds).padStart(2, '0')

        return `${FormattedMinutes}:${FormattedSeconds}`
    }
}

async function getSongs(Folder) {
    currFolder = Folder;
    let localAPI = await fetch(`http://127.0.0.1:3000/${Folder}/`)
    let response = await localAPI.text()
    let div = document.createElement("div")
    div.innerHTML = response

// async function getSongs(Folder) {
//     currFolder = Folder;
//     let localAPI = await fetch(`http://127.0.0.1:3000/${Folder}/`);
//     let response = await localAPI.text();
//     console.log(response); 

    let links = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${Folder}/`)[1])
        }
    }
    return songs
}

// play the music when the user on the icon
const playmusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        Play.src = "Svg's/paused.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00/00:00"


}



async function main() {
    // Get list of all the songs
    songs = await getSongs("songs/QR - Surah's");
    playmusic(songs[0], true);

    // Get all the songs in the playlist
    let songsUL = document.querySelector(".songs").getElementsByTagName("ul")[0]
    for (const song of currFolder) {
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
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100 + "%")
    })

    // Add eventlisten to seekbar
    document.querySelector(".seekbar").addEventListener("click", ((e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    }))

    // Add an eventlisterner for hambureger -
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add an eventlistener for back-Btn -
    document.querySelector("#back-Btn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener for previous 
    previousPlay.addEventListener("click", () => {
        console.log("Previous click");
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ([index - 1 > 0]) {
            playmusic(songs[index - 1])
        }

    })

    // Add an event listener for Next 
    nextPlay.addEventListener("click", () => {
        console.log("Next click");
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ([index + 1 < songs.length]) {
            playmusic(songs[index + 1])
        }

    })

    // Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to ", e.target.value, "/100");

        currentSong.volume = parseInt(e.target.value)/100
    })


}

main()

