// Central registry for the photos shipped in src/assets.
// Import images through this module so every consumer shares one hashed URL.

import balazsKetyi from "@/assets/balazs-ketyi-_x335IZXxfc-unsplash.jpg";
import charlesForerunner from "@/assets/charles-forerunner-3fPXt37X6UQ-unsplash.jpg";
import colinLloyd from "@/assets/colin-lloyd-UOBgu1hEj0o-unsplash.jpg";
import cytonnPhotography from "@/assets/cytonn-photography-n95VMLxqM2I-unsplash.jpg";
import hanaPhoto from "@/assets/hana-LMXv7FpIgoc-unsplash.jpg";
import kevinMatos from "@/assets/kevin-matos-Nl_FMFpXo2g-unsplash.jpg";
import kyleLoftus from "@/assets/kyle-loftus-tn9tmUmQA4A-unsplash.jpg";
import wallingPhoto from "@/assets/walling-OvLXbURo9Wo-unsplash.jpg";

export const photos = {
  studio: balazsKetyi,
  hands: charlesForerunner,
  work: colinLloyd,
  team: cytonnPhotography,
  portraits: hanaPhoto,
  craft: kevinMatos,
  film: kyleLoftus,
  space: wallingPhoto,
};

/** Ordered strip used by the landing gallery and photo bands. */
export const photoStrip = [
  photos.studio,
  photos.craft,
  photos.work,
  photos.team,
  photos.portraits,
  photos.film,
  photos.hands,
  photos.space,
];
