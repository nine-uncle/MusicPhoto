<template>
  <figure
    class="img-figure"
    :style="figureStyle"
    @click="onClick"
  >
    <img
      :src="data.imageURL"
      :alt="data.title"
    >
    <figcaption>
      <h2 class="img-title">
        {{ data.title }}
      </h2>
      <div
        class="img-back"
        @click.stop="onClick"
      >
        <p>{{ data.desc }}</p>
      </div>
    </figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: { type: Object, required: true },
  arrange: { type: Object, required: true },
});

const emit = defineEmits(['inverse', 'center']);

const figureStyle = computed(() => {
  const style = {};
  if (props.arrange.pos) {
    style.left = `${props.arrange.pos.left}px`;
    style.top = `${props.arrange.pos.top}px`;
  }
  const z = props.arrange.rotate;
  const zRot =
    z !== undefined && z !== null && z !== '' ? `rotate(${z}deg)` : '';
  const flip = props.arrange.isInverse ? ' translate(320px) rotateY(180deg)' : '';
  const t = `${zRot}${flip}`.trim() || undefined;
  if (t) {
    style.transform = t;
    style.MozTransform = t;
    style.msTransform = t;
    style.WebkitTransform = t;
  }
  if (props.arrange.isCenter) {
    style.zIndex = 11;
  }
  return style;
});

function onClick(e) {
  if (props.arrange.isCenter) {
    emit('inverse');
  } else {
    emit('center');
  }
  e.stopPropagation();
  e.preventDefault();
}
</script>
