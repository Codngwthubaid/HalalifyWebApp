console.log('Ready');

let currentSong = new Audio;   //global variable for music 
async function getSongs() {
    let localAPI = await fetch("http://127.0.0.1:3000/Songs/")
    let response = await localAPI.text()
    let div = document.createElement("div")
    div.innerHTML = response

    let links = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".mpeg")) {
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs
}

// play the music when the user on the icon
const playmusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    Play.src = "paused.svg"
}


async function main() {
    // Get list of all the songs
    let songs = await getSongs()
    // console.log(songs);

    // Get all the songs in the playlist
    let songsUL = document.querySelector(".songs").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li><img src="music.svg" alt="">
                                                <div class="info flex">
                                                   <div>${song.replaceAll("%20", " ")}</div>
                                                   <div>Ubaid</div>
                                                </div>
                                                <div class="playNow flex justify-content align-item">
                                                <span>PLay Now</span>
                                                <img id="Play src="play.svg" alt="play-Img"></div>
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
    Play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            Play.svg = "paused.svg"
        }
        else{
            currentSong.pause()
            Play.svg = "play.svg"

        }
    })

   
}

main()