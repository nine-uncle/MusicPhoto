import imageDatas from "@/data/imageDatas.json";

const imageModules = import.meta.glob("../images/*.{jpg,jpeg,png,gif,webp}", {
  eager: true,
  import: "default",
});

/**
 * 将 imageDatas 与 `src/images` 下的本地文件关联；缺文件时仍用占位图以免空白。
 */
export const imagesData = imageDatas.map((item, index) => {
  const modKey = Object.keys(imageModules).find((k) =>
    k.endsWith(`/${item.fileName}`),
  );
  const imageURL = modKey
    ? imageModules[modKey]
    : `https://picsum.photos/seed/musicphoto-${item.fileName}-${index}/320/360`;

  return {
    ...item,
    imageURL,
  };
});
