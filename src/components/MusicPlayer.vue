<template>
  <div class="player-page">
    <div class="row">
      <div class="controll-wrapper">
        <h2 class="music-title">
          {{ music.currentMusitItem.title }}
        </h2>
        <h3 class="music-artist mt10">
          {{ music.currentMusitItem.artist }}
        </h3>
        <div class="row mt10">
          <div class="left-time -col-auto">
            -{{ music.leftTime }}
          </div>
          <div class="volume-container">
            <span
              class="vol-icon"
              aria-hidden="true"
            >🔊</span>
            <div class="volume-wrapper">
              <ProgressBar
                :progress="music.volume"
                bar-color="#aaa"
                @progress-change="onVolumeChange"
              />
            </div>
          </div>
        </div>
        <div class="seek-line">
          <ProgressBar
            :progress="music.progress"
            @progress-change="onSeek"
          />
        </div>
        <div class="mt35 row controls-row">
          <div class="transport">
            <button
              type="button"
              class="tbtn"
              aria-label="上一首"
              @click="onPrev"
            >
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M16 6h2v12h-2V6zM5 12l8-5v10L5 12z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="tbtn"
              :aria-label="music.isPlay ? '暂停' : '播放'"
              @click="onToggle"
            >
              <svg
                v-if="music.isPlay"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"
                />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                width="28"
                height="28"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M8 5v14l11-7L8 5z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="tbtn"
              aria-label="下一首"
              @click="onNext"
            >
             <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M6 6h2v12H6V6zm11 6l-8 5V7l8 5z"
                />
              </svg>

            </button>
          </div>
          <div class="-col-auto">
            <button
              type="button"
              class="tbtn repeat-btn"
              :aria-label="`播放模式：${repeatLabel}`"
              @click="cycleRepeatType"
            >
              <span
                v-if="music.repeatType === 'cycle'"
                class="repeat-ico"
              >🔁</span>
              <span
                v-else-if="music.repeatType === 'once'"
                class="repeat-ico"
              >🔂</span>
              <span
                v-else
                class="repeat-ico"
              >🔀</span>
            </button>
          </div>
        </div>
      </div>
      <div class="-col-auto cover">
        <img
          :src="music.currentMusitItem.cover"
          :alt="music.currentMusitItem.title"
          :style="{ animationPlayState: music.isPlay ? 'running' : 'paused' }"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProgressBar from '@/components/ProgressBar.vue';
import {
  music,
  togglePlay,
  seekToProgress,
  setVolume,
  playNext,
  cycleRepeatType,
} from '@/composables/useMusicPlayer';

const repeatLabel = computed(() => {
  const m = { cycle: '列表循环', once: '单曲循环', random: '随机' };
  return m[music.repeatType] ?? music.repeatType;
});

function onSeek(ratio) {
  seekToProgress(ratio);
}

function onVolumeChange(ratio) {
  setVolume(ratio);
}

function onToggle() {
  togglePlay();
}

function onNext() {
  playNext('next');
}

function onPrev() {
  playNext('prev');
}
</script>

<style scoped lang="scss">
.player-page {
  width: 550px;
  height: 210px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 20px;
  z-index: 101;

  .cover {
    width: 180px;
    height: 180px;
    margin-left: 20px;

    img {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      animation: roate 20s infinite linear;
      border: 2px solid #808080b8;
    }
  }

  .volume-container {
    position: relative;
    left: 20px;
    top: -3px;
  }

  .volume-container .volume-wrapper {
    opacity: 0;
    transition: opacity 0.5s linear;
  }

  .volume-container:hover .volume-wrapper {
    opacity: 1;
  }

  .music-title {
    font-size: 25px;
    font-weight: 400;
    color: rgb(3, 3, 3);
    height: 6px;
    line-height: 6px;
  }

  .music-artist {
    font-size: 15px;
    font-weight: 400;
    color: rgb(74, 74, 74);
  }

  .left-time {
    font-size: 14px;
    color: #999;
    font-weight: 400;
    width: 40px;
  }

  .ml20 {
    margin-left: 20px;
  }

  .mt35 {
    margin-top: 35px;
  }

  .volume-wrapper {
    width: 60px;
    display: inline-block;
  }
}

@keyframes roate {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

.seek-line {
  height: 10px;
  line-height: 10px;
}

.vol-icon {
  display: inline-block;
  position: relative;
  top: -3px;
  left: 4px;
  font-size: 14px;
}

.transport {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: #222;
  cursor: pointer;
  vertical-align: middle;

  &:hover {
    opacity: 0.85;
  }
}

.repeat-btn {
  min-width: 36px;
}

.repeat-ico {
  font-size: 20px;
  line-height: 1;
}
</style>
