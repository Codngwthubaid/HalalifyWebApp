console.log("Getting Started !!!");
let currentSong = new Audio
let play = document.getElementById("playBtn")

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (music) => {
    currentSong.src = "/songs/" + music
    currentSong.play()
    play.src = "Svg's/paused.svg"
}



async function main() {


    // list of all the songs
    let songs = await getSongs()
    // console.log(songs);

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

    }
}
main()
