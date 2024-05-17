console.log("Getting Started !!!");

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href)
        }
    }
    return songs
}
async function main() {
    // list of all the songs
    let songs = await getSongs()
    console.log(songs);

    // play first song
    var audio = new Audio(songs[0]);
    audio.play();
}

main()