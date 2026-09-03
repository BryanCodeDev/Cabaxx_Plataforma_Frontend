// Assets de contenido de Cabaxx (fotos y videoclips).
// Centralizados para que los módulos los consuman como fallback/local content
// cuando el API (cover_url, gallery, etc.) aún no tiene datos.

import img1 from './gallery/cabaxx-01.webp';
import logo from './gallery/logo.webp';
import img2 from './gallery/cabaxx-02.webp';
import img3 from './gallery/cabaxx-03.webp';
import img4 from './gallery/cabaxx-04.webp';
import img5 from './gallery/cabaxx-05.webp';
import img6 from './gallery/cabaxx-06.webp';
import img7 from './gallery/cabaxx-07.webp';
import img8 from './gallery/cabaxx-08.webp';
import img9 from './gallery/cabaxx-09.webp';
import img10 from './gallery/cabaxx-10.webp';
import img11 from './gallery/cabaxx-11.webp';
import img12 from './gallery/cabaxx-12.webp';
import img13 from './gallery/cabaxx-13.webp';
import img14 from './gallery/cabaxx-14.webp';

import video1 from './videos/cabaxx-showreel.mp4';



// Fotos del artista (usadas en galería, hero, about, auth).
export const artistPhotos = [
  img1, img2, img3, img4, img5, img6, img7,
  img8, img9, img10, img11, img12, img13, img14,
];

// Videoclips oficiales.
export const videos = [video1];

// Alias convenientes para módulos concretos.
export const heroVideo = video1;
export const heroPoster = img1;
export const artistPortrait = img2;
export const logoMark = logo;
