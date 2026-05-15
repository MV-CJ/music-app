import { Track } from "@/types/track";

export const getTrackId = (
  track: Track
) => {
  return `${track.artist}-${track.name}`;
};

export const getTrackImage = (
  track: Track
) => {

  if (
    track.artist_image &&
    track.artist_image.trim() !== ""
  ) {
    return track.artist_image;
  }

  if (
    track.image &&
    track.image.trim() !== ""
  ) {
    return track.image;
  }

  return "https://placehold.co/600x600/18181b/71717a?text=Music";
};