<template>
  <section
    ref="stageRef"
    class="stage"
  >
    <section class="img-sec">
      <ImgFigure
        v-for="(item, index) in imagesData"
        :key="index"
        :data="item"
        :arrange="imgArrangeArr[index]"
        @inverse="() => toggleInverse(index)"
        @center="() => rearrange(index)"
      />
    </section>
    <nav class="controller-nav">
      <ControllerUnit
        v-for="(_, index) in imagesData"
        :key="index"
        :arrange="imgArrangeArr[index]"
        @inverse="() => toggleInverse(index)"
        @center="() => rearrange(index)"
      />
    </nav>
    <MusicPlayer />
    <!-- <div class="source-area">
      源代码：<a
        href="https://github.com/nnngu/MusicPhoto"
        target="_blank"
        rel="noopener noreferrer"
      >https://github.com/nnngu/MusicPhoto</a>
    </div> -->
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ImgFigure from '@/components/ImgFigure.vue';
import ControllerUnit from '@/components/ControllerUnit.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';
import { imagesData } from '@/utils/images';

const stageRef = ref(null);

const Constant = {
  centerPos: { left: 0, top: 0 },
  hPosRange: {
    leftSecX: [0, 0],
    rightSecX: [0, 0],
    y: [0, 0],
  },
  vPosRange: {
    x: [0, 0],
    topY: [0, 0],
  },
};

const imgArrangeArr = ref(
  imagesData.map(() => ({
    pos: { left: 0, top: 0 },
    rotate: 0,
    isInverse: false,
    isCenter: false,
  })),
);

function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30);
}

function rearrange(centerIndex) {
  const ConstantRef = Constant;
  const centerPos = ConstantRef.centerPos;
  const hPosRange = ConstantRef.hPosRange;
  const vPosRange = ConstantRef.vPosRange;
  const hPosRangeLeftSecX = hPosRange.leftSecX;
  const hPosRangeRightSecX = hPosRange.rightSecX;
  const hPosRangeY = hPosRange.y;
  const vPosRangeTopY = vPosRange.topY;
  const vPosRangeX = vPosRange.x;

  const arr = imgArrangeArr.value.map((item) => ({
    ...item,
    pos: { ...item.pos },
  }));

  const topImgNum = Math.floor(Math.random() * 2);
  const topImgSpliceIndex = Math.floor(Math.random() * (arr.length - topImgNum));

  const imgArrangeCenterArr = arr.splice(centerIndex, 1);
  const imgArrangeTopArr = arr.splice(topImgSpliceIndex, topImgNum);

  imgArrangeCenterArr[0] = {
    ...imgArrangeCenterArr[0],
    pos: centerPos,
    rotate: 0,
    isCenter: true,
  };

  imgArrangeTopArr.forEach((_, index) => {
    imgArrangeTopArr[index] = {
      ...imgArrangeTopArr[index],
      pos: {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
      },
      rotate: get30DegRandom(),
      isCenter: false,
    };
  });

  const k = arr.length / 2;
  for (let i = 0; i < arr.length; i++) {
    const hPosRangeLORX = i < k ? hPosRangeLeftSecX : hPosRangeRightSecX;
    arr[i] = {
      ...arr[i],
      pos: {
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
      },
      rotate: get30DegRandom(),
      isCenter: false,
    };
  }

  if (imgArrangeTopArr.length > 0) {
    arr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
  }

  arr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

  imgArrangeArr.value = arr;
}

function toggleInverse(index) {
  const row = imgArrangeArr.value[index];
  imgArrangeArr.value.splice(index, 1, {
    ...row,
    isInverse: !row.isInverse,
  });
}

onMounted(() => {
  const stageEl = stageRef.value;
  if (!stageEl) return;

  const stageW = stageEl.scrollWidth;
  const stageH = stageEl.scrollHeight;
  const halfStageW = Math.ceil(stageW / 2);
  const halfStageH = Math.ceil(stageH / 2);

  const firstFig = stageEl.querySelector('.img-figure');
  const imgW = firstFig ? firstFig.scrollWidth : 320;
  const imgH = firstFig ? firstFig.scrollHeight : 360;
  const halfImgW = Math.ceil(imgW / 2);
  const halfImgH = Math.ceil(imgH / 2);

  Constant.centerPos = {
    left: halfStageW - halfImgW,
    top: halfStageH - halfImgH - 140,
  };

  Constant.hPosRange.leftSecX[0] = -halfImgW;
  Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
  Constant.hPosRange.y[0] = -halfImgH;
  Constant.hPosRange.y[1] = stageH - halfImgH * 3;

  Constant.vPosRange.x[0] = halfStageW - imgW;
  Constant.vPosRange.x[1] = halfStageW;
  Constant.vPosRange.topY[0] = 0 - halfImgH;
  Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

  rearrange(0);
});
</script>
