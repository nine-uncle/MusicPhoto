<template>
  <div
    ref="barRef"
    class="components-progress"
    @click="onClick"
  >
    <div
      class="progress"
      :style="{ width: `${progress}%`, background: barColor }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  progress: { type: Number, default: 0 },
  barColor: { type: String, default: '#2f9842' },
});

const emit = defineEmits(['progress-change']);

const barRef = ref(null);

function onClick(e) {
  const el = barRef.value;
  if (!el) return;
  const ratio = (e.clientX - el.getBoundingClientRect().left) / el.clientWidth;
  emit('progress-change', Math.min(1, Math.max(0, ratio)));
}
</script>

<style scoped lang="scss">
.components-progress {
  display: inline-block;
  width: 100%;
  height: 3px;
  position: relative;
  background: #aaa;
  cursor: pointer;

  .progress {
    width: 0%;
    height: 3px;
    left: 0;
    top: 0;
  }
}
</style>
