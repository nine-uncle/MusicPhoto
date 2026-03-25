import { reactive } from 'vue';
import { MUSIC_LIST } from '@/data/musicDatas';
import { randomRange } from '@/utils/util';

const repeatList = ['cycle', 'once', 'random'];

export const music = reactive({
  musicList: [...MUSIC_LIST],
  currentMusitItem: MUSIC_LIST[0],
  repeatType: 'cycle',
  progress: 0,
  volume: 80,
  isPlay: true,
  leftTime: '0:00',
});

let audio = null;
let duration = 0;

function formatTime(time) {
  const t = Math.floor(time);
  const minute = Math.floor(t / 60);
  const seconds = Math.floor(t % 60);
  return `${minute}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function findMusicIndex(item) {
  const index = music.musicList.indexOf(item);
  return Math.max(0, index);
}

function onTimeUpdate() {
  if (!audio) return;
  duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  music.progress = duration ? (audio.currentTime / duration) * 100 : 0;
  music.volume = Math.round(audio.volume * 100);
  const remain = Math.max(0, duration - audio.currentTime);
  music.leftTime = formatTime(remain);
}

function playWhenEnd() {
  if (music.repeatType === 'random') {
    const index = findMusicIndex(music.currentMusitItem);
    let randomIndex = randomRange(0, music.musicList.length - 1);
    while (randomIndex === index && music.musicList.length > 1) {
      randomIndex = randomRange(0, music.musicList.length - 1);
    }
    playMusic(music.musicList[randomIndex]);
  } else if (music.repeatType === 'once') {
    playMusic(music.currentMusitItem);
  } else {
    playNext('next');
  }
}

export function initMusicAudio() {
  if (audio) return;
  audio = new Audio();
  audio.volume = 0.8;
  music.volume = Math.round(audio.volume * 100);

  audio.addEventListener('timeupdate', onTimeUpdate);
  audio.addEventListener('ended', playWhenEnd);
  audio.addEventListener('play', () => {
    music.isPlay = true;
  });
  audio.addEventListener('pause', () => {
    music.isPlay = false;
  });

  playMusic(MUSIC_LIST[0]);
}

export function playMusic(item) {
  if (!audio) return;
  music.currentMusitItem = item;
  const wasPlaying = !audio.paused;
  audio.src = item.file;
  audio.load();
  if (wasPlaying || music.isPlay) {
    audio.play().catch(() => {
      music.isPlay = false;
    });
  }
}

export function togglePlay() {
  if (!audio) return;
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

export function seekToProgress(ratio) {
  if (!audio || !duration) return;
  audio.currentTime = duration * ratio;
}

export function setVolume(ratio) {
  if (!audio) return;
  audio.volume = Math.min(1, Math.max(0, ratio));
}

export function playNext(type = 'next') {
  let index = findMusicIndex(music.currentMusitItem);
  if (type === 'next') {
    index = (index + 1) % music.musicList.length;
  } else {
    index = (index + music.musicList.length - 1) % music.musicList.length;
  }
  playMusic(music.musicList[index]);
}

export function cycleRepeatType() {
  const i = repeatList.indexOf(music.repeatType);
  music.repeatType = repeatList[(i + 1) % repeatList.length];
}
