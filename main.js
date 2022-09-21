// constants
let audio = document.querySelector('audio');
let lyric = document.querySelector('.lyric');
let play = document.querySelector('.play');
let time = document.querySelector('.time');
let progresses = Array.from(document.querySelectorAll('.progress'));

// add events
play.addEventListener('click', e => {
  audio.play();
  play.style.opacity = '0';
  play.style.pointerEvents = 'none';
})
audio.addEventListener('playing', start);

async function loadFile(fileName) {
  return await fetch(fileName)
    .then(data => data.text())
    .then(data => data.trim().split("\n")) // break lines to array
    .catch(err => console.error(err))
}

async function start(e) {
  let index = 1;
  (await loadFile('lyric.lrc')).forEach(line => {
    line = line.trim();
    let minute = parseInt(line.substr(1, 2));
    let second = parseInt(line.substr(4, 5));
    if(isNaN(minute) || isNaN(second)) return;

    let text = line.substr(line.indexOf(']') + 1, line.length).trim();
    setTimeout(() => {
      lyric.style.transform = `rotateZ(${index++ * 360}deg)`;
      lyric.innerText = text;
    }, (second + (minute * 60)) * 1000);
  })
}

setInterval(() => {
  let current = Math.floor(audio.currentTime); // time of current playing music
  let minute = Math.floor(current / 60);
  let second = current % 60;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  time.innerText = `${minute}:${second}`;
  progresses.forEach(progress => {
    progress.style.strokeDashoffset = 1414 - (1414 * ((current / audio.duration) * 100)) / 100;
  })
}, 1000); // this function run all second