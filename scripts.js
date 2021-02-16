// VIDEO PLAYER ELEMENTS //
/* Get out elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen');

/* Build out functions */
function togglePlay() {
  if (video.paused) {
    video.play();
    video.muted = false;
  } else {
    video.pause();
  }
}

function updateButton() {
  // this.pause - this is bound to the video itself
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}
function skipForward() {
  video.currentTime += 25;
}
function skipBackward() {
  video.currentTime -= 10;
}
function volumeIncrease() {
  video.volume += 0.2;
}
function volumeDecrease() {
  video.volume -= 0.2;
}
function volumeFull() {
  video.volume = 1;
}
function volumeMuted() {
  video.volume = 0;
}

function handleRangeUpdate() {
  video[this.name] = this.value;
  console.log(this.name);
  console.log(this.value);
}

function handleProgress() {
  console.log("Handling the progress");
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullscreen() {
  console.log("Toggling fullscreen");
  if (video.requestFullScreen) {
    video.requestFullScreen();
  } else if (video.webkitRequestFullScreen) {
    video.webkitRequestFullScreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  }

}





/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
fullscreen.addEventListener('click', toggleFullscreen);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// END VIDEO PLAYER ELEMENTS //

// VOICE CONTROLS //
// SpeechRecognition is a global attribute found in the browser
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {

  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')

  p.textContent = transcript;
  if (e.results[0].isFinal) {
    p = document.createElement('p');
    words.appendChild(p);
    console.log(transcript);
    // voiceCommands();
    if (transcript.includes('play video') || (transcript.includes('stop video'))) {
      console.log('PLAYING VIDEO');
      togglePlay();
    } else if (transcript.includes('skip ahead')) {
      console.log('SKIPS AHEAD 25SEC');
      skipForward();
    } else if (transcript.includes('skip back')) {
      console.log('SKIPS BACK 10SEC');
      skipBackward();
    } else if (transcript.includes('turn it up')) {
      console.log('INCREASING VOLUME');
      volumeIncrease();
      console.log(video.volume);
    } else if (transcript.includes('turn it down')) {
      console.log('DECREASING VOLUME');
      volumeDecrease();
      console.log(video.volume);
    } else if (transcript.includes('max volume')) {
      console.log('MAX VOLUME');
      volumeFull();
      console.log(video.volume);
    } else if (transcript.includes('mute')) {
      console.log('MUTING VIDEO');
      volumeMuted();
      console.log(video.volume);
    }
  }

});

// function voiceCommands(transcript) {
//   if (transcript.includes('play video')) {
//     console.log('PLAYING VIDEO');
//     togglePlay();
//   } else if (transcript.includes('skip ahead')) {
//     console.log('SKIPS AHEAD 25SEC');
//     skipForward();
//   }
// }

recognition.addEventListener('end', recognition.start);

recognition.start();

// END OF VOICE CONTROLS //