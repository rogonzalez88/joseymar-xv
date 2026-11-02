export type GalleryPhoto = {
  src: string;
  full: string;
  // Dimensiones de la miniatura; la versión grande mantiene la misma proporción
  width: number;
  height: number;
  alt: string;
};

const sizes: Record<string, [number, number]> = {
  "01": [602, 960],
  "02": [540, 960],
  "03": [540, 960],
  "04": [540, 960],
  "05": [540, 960],
  "06": [551, 960],
  "07": [568, 960],
  "08": [640, 960],
  "09": [540, 960],
  "10": [540, 960],
  "11": [540, 960],
  "12": [540, 960],
  "13": [590, 960],
  "14": [960, 605],
  "15": [540, 960],
  "16": [540, 960],
  "17": [540, 960],
  "18": [540, 960],
  "19": [540, 960],
  "20": [540, 960],
};

export const galleryPhotos: GalleryPhoto[] = Object.entries(sizes).map(
  ([id, [width, height]], i) => ({
    src: `/galeria/foto-${id}-thumb.webp`,
    full: `/galeria/foto-${id}.webp`,
    width,
    height,
    alt: `Joseymar en su sesión de fotos, foto ${i + 1}`,
  }),
);

export const galleryVideo = {
  src: "/galeria/video.mp4",
  poster: "/galeria/video-poster.webp",
};
