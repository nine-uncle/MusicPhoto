<template>
  <span
    :class="unitClass"
    @click="onClick"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  arrange: { type: Object, required: true },
});

const emit = defineEmits(['inverse', 'center']);

const unitClass = computed(() => {
  let c = 'controller-unit';
  if (props.arrange.isCenter) {
    c += ' is-center';
    if (props.arrange.isInverse) {
      c += ' is-inverse';
    }
  }
  return c;
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
