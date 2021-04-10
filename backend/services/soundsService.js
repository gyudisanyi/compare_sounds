import { soundsRepo } from '../repositories/index.js';
import fs from 'fs-extra';

export const soundsService = {

  async getSounds(setId, userId) {
    return await soundsRepo.getSounds(setId, userId);
  },

  async uploadFiles(Files, setId) {
    const uploadPath = `./public/audio_src/${setId}/`;
    if (!Array.isArray(Files)) { Files = [Files] };
    await Promise.all(Files.map((file) =>
      fs.ensureFile(uploadPath+file.name)
    ));
    return Promise.all(Files.map((file) =>
        fs.copy(file.path, uploadPath+file.name)
    ));
  },

  async newSounds(
    NewFilenames,
    TrackTitles,
    TrackDescriptions,
    setId,
    userId) {
    return Promise.all(NewFilenames.map((filename, i) =>
        soundsRepo.newSound(
          filename,
          TrackTitles[i],
          TrackDescriptions[i],
          setId,
          userId
        )));
  },

  async changeTitles(AlteredTitles, OldTrackTitles) {
    return Promise.all(AlteredTitles.map((trackId, i) =>
        soundsRepo.changeTitle(trackId, OldTrackTitles[i])
      ))
  },

  async changeDescriptions(AlteredDescriptions, OldTrackDescriptions) {
    return Promise.all(AlteredDescriptions.map((trackId, i) =>
        soundsRepo.changeDescription(trackId, OldTrackDescriptions[i]
        )))
  },

  async deleteSounds(ToDelete) {
    return Promise.all(ToDelete.map((id) =>
        soundsRepo.deleteSound(id)
      ))
  }
}
