console.log("Getting Started !!!");
let currentSong = new Audio
let play = document.getElementById("playBtn")
let previous = document.getElementById("previousplay")
let next = document.getElementById("nextplay")
let songs;
let CurrentFolder;


function convertSecondsToMinutesAndSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const FormattedMinutes = String(minutes).padStart(2, '0')
    const FormattedSeconds = String(seconds).padStart(2, '0')
    return `${FormattedMinutes} : ${FormattedSeconds}`;
}

// async function newFolder() {
//     let albums_list = await fetch(`http://127.0.0.1:3000/json/albums.json/`)
//         .then(response => response.json())


//     let Container = document.querySelector(".cardsContainer")
//     Container.innerHTML = ""
//     for (const album of albums_list) {
//         const albumNode = document.createElement("div")

//         albumNode.addEventListener("click",()=>{
//             alert(album.title)
//         })

//         albumNode.innerHTML = `<div class="cards rounded">
//         <div class="play">
//             <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
//                 class="Svg-sc-ytk21e-0 bneLcE">
//                 <path
//                     d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
//                 </path>
//             </svg>
//         </div>
//         <img class="rounded" src=${album.url}
//             alt="">
//         <h3>${album.title}</h3>
//         <p>${album.desc}</p>
//     </div>`

//         Container.appendChild(albumNode)
//     }
// }



async function getSongs(folder) {
    CurrentFolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = " "
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
    }
    // Add eventlister to each song
    document.querySelectorAll(".songList li").forEach(element => {
        element.addEventListener("click", (e) => {
            console.log(element.querySelector(".info").firstElementChild.innerHTML);
            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

const playMusic = (music, pause = false) => {
    currentSong.src = `/${CurrentFolder}/` + music
    if (!pause) {
        currentSong.play()
        play.src = "Svg's/paused.svg"
    }
    document.querySelector(".songsInfo").innerHTML = decodeURI(music)
    document.querySelector(".songsTime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/Songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    console.log(div)
    let allas = document.getElementsByTagName("a")
    let array = Array.from(allas)
    console.log(allas);
    // let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`)



    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.href.includes("/Songs")) {
            let folder = element.href.split('/').slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response);
            let Container = document.querySelector(".cardsContainer")
                Container.innerHTML = Container.innerHTML + ` <div  data-Folder="${folder}"  class="cards rounded">
                <div class="play">
                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
                        class="Svg-sc-ytk21e-0 bneLcE">
                        <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                        </path>
                    </svg>
                </div>
                <img class="rounded" src="/Songs/${folder}/CoverPage.jpg"
                    alt="">
                <h3>${response.title}</h3>
                <p>${response.desc}</p>
            </div>`
        }
    }


    // loading playlist
    Array.from(document.getElementsByClassName("cards")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching songs !!!");
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main() {
    // list of all the songs
    await getSongs("Songs/Surahs")
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

    // Display all albums in the Webpage
    displayAlbums()
    // newFolder()


    // Function of time changing during playing the music by addeventlistener
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songsTime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)} / ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = ((currentSong.currentTime) / (currentSong.duration)) * 100 + '%';
    })

    document.querySelector(".seekBar").addEventListener("click", (e) => {
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
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // Addeventlisnter to mute the vol
    document.querySelector(".volImg").addEventListener("click", (e => {
        console.log(e.target);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    }))

}
main()
