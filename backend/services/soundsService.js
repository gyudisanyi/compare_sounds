import { soundsRepo } from '../repositories/index.js';
import objectifier from './objectifier.js';

import fs from 'fs-extra';

export const soundsService = {

  async getSounds(setId, userId) {
    return objectifier(await soundsRepo.getSounds(setId));
  },

  async uploadSound(sound, duration, setId, userId) {
    const { name } = sound;
    const uploadPath = `./public/audio_src/${setId}/`;
    await fs.ensureFile(uploadPath+name)
    await fs.copy(sound.path, uploadPath+name)
    return await soundsRepo.newSound(name, duration, setId, userId);
  },

  async uploadImage(image, setId, trackId) {
    const uploadPath = `./public/audio_src/${setId}/img/`;
    await fs.ensureFile(uploadPath+image.name);
    await fs.copy(image.path, uploadPath+image.name);
    return await soundsRepo.addImage(trackId, image.name);
  },

  async newSounds(
    newTracks,
    setId,
    userId) {

    const NewFilenames = Object.keys(newTracks.titles);
    const TrackTitles = Object.values(newTracks.titles);
    const TrackDescriptions = Object.values(newTracks.descriptions);
    return Promise.all(NewFilenames.map((filename, i) =>
        soundsRepo.newSound(
          filename,
          TrackTitles[i],
          TrackDescriptions[i],
          setId,
          userId
        )));
  },

  async changeTitles(updateTitles) {
    const AlteredIds = Object.keys(updateTitles);
    const UpdatedTitles = Object.values(updateTitles);
    return Promise.all(AlteredIds.map((trackId, i) =>
        soundsRepo.changeTitle(trackId, UpdatedTitles[i])
      ))
  },

  async changeDescriptions(updateDescriptions) {
    const AlteredIds = Object.keys(updateDescriptions);
    const UpdatedDescriptions = Object.values(updateDescriptions);
    return Promise.all(AlteredIds.map((trackId, i) =>
        soundsRepo.changeDescription(trackId, UpdatedDescriptions[i]
        )))
  },

  async deleteSounds(ToDelete) {
    
    return Promise.all(ToDelete.map((id) =>
        soundsRepo.deleteSound(id)
      ))
  }
}
