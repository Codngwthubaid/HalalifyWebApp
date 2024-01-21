console.log('Ready');

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

async function main() {
    let songs = await getSongs()
    console.log(songs);

    let songsUL = document.querySelector(".songs").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li> ${song.replaceAll("%20", " ")} </li>`
    }


    var audio = new Audio(songs[0]);
    // audio.play();


    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(audio.duration, audio.currentTime, audio.currentSrc);

        // The duration variable now holds the duration (in seconds) of the audio clip
    });
}

main()