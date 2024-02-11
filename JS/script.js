console.log('Ready');
let currentSong = new Audio;
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

async function getSongs(folder) {
    currFolder = folder;
    let localAPI = await fetch(`/${folder}/`)
    let response = await localAPI.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let links = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // Get all the songs in the playlist
    let songsUL = document.querySelector(".songs").getElementsByTagName("ul")[0]
    songsUL.innerHTML = ""
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
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })


}

getSongs()

// play the music when the user on the icon
const playmusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play()
        Play.src = "Svg's/paused.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    let localAPI = await fetch(`/songs/`)
    let response = await localAPI.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split('/').slice(-2)[0]
            let localAPI = await fetch(`/songs/${folder}/info.json`)
            let response = await localAPI.json()
            cardContainer.innerHTML +=
                `<div data-folder="${folder}" class="cards">
                <div class="playButton flex justify-content ">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="35" viewBox="0 0 24 24"
                id="play">
                <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55     8 6.03 8 6.82z"></path>
                </svg>
                </div>

                <img src="/songs/${folder}/Cover-Page.jpg">
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>`

        }
    }
    // Add an  eventlstener to load the playlist  when the card was clicked by the user
    Array.from(document.getElementsByClassName("cards")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            // songs = await getSongs(`songs/${item, item.currentTarget.dataset.folder}`)
            // playmusic(songs[0])
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })
}


async function main() {
    // Get list of all the songs
    await getSongs("songs/surahs");
    playmusic(songs[0], true);


    // Showcasing all the albums to the user
    displayAlbums()


    // Attach an event listener for play the music 
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


    // Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to ", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100
    })


    // Add an event listener for mute the volume 
    document.querySelector(".rangeVolume > img").addEventListener("click", (e) => {
        // console.log(e.target);
        if (e.target.src.includes("Svg's/volume.svg")) {
            e.target.src = e.target.src.replace("Svg's/volume.svg", "Svg's/mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("Svg's/mute.svg", "Svg's/volume.svg")
            currentSong.volume = .50
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0.50
        }
    })
}

main()


// console.log('Lets write JavaScript');
// let currentSong = new Audio();
// let songs;
// let currFolder;

// function secondsToMinutesSeconds(seconds) {
//     if (isNaN(seconds) || seconds < 0) {
//         return "00:00";
//     }

//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);

//     const formattedMinutes = String(minutes).padStart(2, '0');
//     const formattedSeconds = String(remainingSeconds).padStart(2, '0');

//     return `${formattedMinutes}:${formattedSeconds}`;
// }

// async function getSongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`/${folder}/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//     songs = []
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split(`/${folder}/`)[1])
//         }
//     }
 


//     // Show all the songs in the playlist
//     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
//     songUL.innerHTML = ""
//     for (const song of songs) {
//         songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
//                             <div class="info">
//                                 <div> ${song.replaceAll("%20", " ")}</div>
//                                 <div>Harry</div>
//                             </div>
//                             <div class="playnow">
//                                 <span>Play Now</span>
//                                 <img class="invert" src="img/play.svg" alt="">
//                             </div> </li>`;
//     }

//     // Attach an event listener to each song
//     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
//         e.addEventListener("click", element => {
//             playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

//         })
//     })

//     return songs
// }

// const playMusic = (track, pause = false) => {
//     currentSong.src = `/${currFolder}/` + track
//     if (!pause) {
//         currentSong.play()
//         play.src = "img/pause.svg"
//     }
//     document.querySelector(".songinfo").innerHTML = decodeURI(track)
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


// }

// async function displayAlbums() {
//     console.log("displaying albums")
//     let a = await fetch(`/songs/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index]; 
//         if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
//             let folder = e.href.split("/").slice(-2)[0]
//             // Get the metadata of the folder
//             let a = await fetch(`/songs/${folder}/info.json`)
//             let response = await a.json(); 
//             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
//             <div class="play">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                     xmlns="http://www.w3.org/2000/svg">
//                     <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
//                         stroke-linejoin="round" />
//                 </svg>
//             </div>

//             <img src="/songs/${folder}/cover.jpg" alt="">
//             <h2>${response.title}</h2>
//             <p>${response.description}</p>
//         </div>`
//         }
//     }

//     // Load the playlist whenever card is clicked
//     Array.from(document.getElementsByClassName("card")).forEach(e => { 
//         e.addEventListener("click", async item => {
//             console.log("Fetching Songs")
//             songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
//             playMusic(songs[0])

//         })
//     })
// }

// async function main() {
//     // Get the list of all the songs
//     await getSongs("songs/ncs")
//     playMusic(songs[0], true)

//     // Display all the albums on the page
//     await displayAlbums()


//     // Attach an event listener to play, next and previous
//     play.addEventListener("click", () => {
//         if (currentSong.paused) {
//             currentSong.play()
//             play.src = "img/pause.svg"
//         }
//         else {
//             currentSong.pause()
//             play.src = "img/play.svg"
//         }
//     })

//     // Listen for timeupdate event
//     currentSong.addEventListener("timeupdate", () => {
//         document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
//         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
//     })

//     // Add an event listener to seekbar
//     document.querySelector(".seekbar").addEventListener("click", e => {
//         let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
//         document.querySelector(".circle").style.left = percent + "%";
//         currentSong.currentTime = ((currentSong.duration) * percent) / 100
//     })

//     // Add an event listener for hamburger
//     document.querySelector(".hamburger").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "0"
//     })

//     // Add an event listener for close button
//     document.querySelector(".close").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "-120%"
//     })

//     // Add an event listener to previous
//     previous.addEventListener("click", () => {
//         currentSong.pause()
//         console.log("Previous clicked")
//         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
//         if ((index - 1) >= 0) {
//             playMusic(songs[index - 1])
//         }
//     })

//     // Add an event listener to next
//     next.addEventListener("click", () => {
//         currentSong.pause()
//         console.log("Next clicked")

//         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
//         if ((index + 1) < songs.length) {
//             playMusic(songs[index + 1])
//         }
//     })

//     // Add an event to volume
//     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
//         console.log("Setting volume to", e.target.value, "/ 100")
//         currentSong.volume = parseInt(e.target.value) / 100
//         if (currentSong.volume >0){
//             document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
//         }
//     })

//     // Add event listener to mute the track
//     document.querySelector(".volume>img").addEventListener("click", e=>{ 
//         if(e.target.src.includes("volume.svg")){
//             e.target.src = e.target.src.replace("volume.svg", "mute.svg")
//             currentSong.volume = 0;
//             document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
//         }
//         else{
//             e.target.src = e.target.src.replace("mute.svg", "volume.svg")
//             currentSong.volume = .10;
//             document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
//         }

//     })





// }

// main() 
