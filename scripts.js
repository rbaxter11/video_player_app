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
const grayscaleBtn = document.querySelector('.grayscale-btn');
const sepiaBtn = document.querySelector('.sepia-btn');
const saturateBtn = document.querySelector('.saturate-btn');
const blurBtn = document.querySelector('.blur-btn');
const clearBtn = document.querySelector('.clear-btn');

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
  const range = document.querySelector("input[name='volume']");
  const currentValue = range.value
  range.value = currentValue + 0.2
}
function volumeDecrease() {
  video.volume -= 0.2;
  const range = document.querySelector("input[name='volume']");
  const currentValue = range.value
  range.value = currentValue - 0.2
}
function volumeFull() {
  video.volume = 1;
  // Adjusting range on slider to max
  const range = document.querySelector("input[name='volume']");
  range.value = 1
}
function volumeMuted() {
  video.volume = 0;
  const range = document.querySelector("input[name='volume']");
  range.value = 0
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
function toggleGrayscale() {
  console.log("Testing grayscale button");
  video.classList.toggle('grayscale');
}
function toggleSepia() {
  console.log("Testing Sepia button");
  video.classList.toggle('sepia');
}
function toggleSaturate() {
  console.log("Testing Saturate button");
  video.classList.toggle('saturate');
}
function toggleBlur() {
  console.log("Testing Blur button");
  video.classList.toggle('blur');
}
function clearAll() {
  console.log("CLEAR FILTERS");
  video.classList.remove('grayscale');
  video.classList.remove('sepia');
  video.classList.remove('saturate');
  video.classList.remove('blur');
}
var playSelectedFile = function (event) {
  var file = this.files[0]
  // var type = file.type
  // var canPlay = videoNode.canPlayType(type)
  // if (canPlay === '') canPlay = 'no'
  // var message = 'Can play type "' + type + '": ' + canPlay
  // var isError = canPlay === 'no'
  // displayMessage(message, isError)

  // if (isError) {
  //   return
  // }
  console.log(this.files)
  var fileURL = URL.createObjectURL(file)
  console.log(fileURL)
  video.src = fileURL
}
var inputNode = document.querySelector('#myFile')
inputNode.addEventListener('change', playSelectedFile, false)





/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
fullscreen.addEventListener('click', toggleFullscreen);
grayscaleBtn.addEventListener('click', toggleGrayscale);
sepiaBtn.addEventListener('click', toggleSepia);
saturateBtn.addEventListener('click', toggleSaturate);
blurBtn.addEventListener('click', toggleBlur);
clearBtn.addEventListener('click', clearAll)

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
// ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

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
    // p = document.createElement('p');
    // words.appendChild(p);
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
    } else if (transcript.includes('make it gray')) {
      toggleGrayscale();
    } else if (transcript.includes('make it sepia')) {
      toggleSepia();
    } else if (transcript.includes('make it saturated')) {
      toggleSaturate();
    } else if (transcript.includes('make it blurry')) {
      toggleBlur();
    } else if (transcript.includes('clear')) {
      clearAll();
    }
  }

});


recognition.addEventListener('end', recognition.start);

recognition.start();

// END OF VOICE CONTROLS //
