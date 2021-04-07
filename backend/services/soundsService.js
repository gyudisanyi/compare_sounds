import { soundsRepo } from '../repositories/index.js';

export const soundsService = {

  async getSounds(setId, userId) {
    return await soundsRepo.getSounds(setId, userId);
  },

  async addFiles(Files, setId) {
    const uploadPath = `./public/audio_src/${setId}/`;
    if (!Array.isArray(Files)) {Files = [Files]};
    Files.forEach((file) => {
      file.mv(uploadPath + file.name)
    })
  },

  async newSounds(
    NewFileNames,
    TrackTitles,
    TrackDescriptions,
    setId,
    userId) {
    return Promise.all(NewFileNames.map((filename, i) =>
      new Promise((resolve, reject) => 
        soundsRepo.newSound(
          filename,
          TrackTitles[i],
          TrackDescriptions[i],
          setId,
          userId
          ))));
  },

  async changeTitles(AlteredTitles, OldTrackTitles) {
    return Promise.all(AlteredTitles.map((trackId, i)=>
      new Promise((resolve, reject) =>
        soundsRepo.changeTitle(trackId, OldTrackTitles[i])
    )))
  },

  async changeDescriptions(AlteredDescriptions, OldTrackDescriptions) {
    return Promise.all(AlteredDescriptions.map((trackId, i)=>
      new Promise((resolve, reject) =>
        soundsRepo.changeDescription(trackId, OldTrackDescriptions[i]
    ))))
  },

  async deleteSounds(ToDelete) {
    return Promise.all(ToDelete.map((id)=>
      new Promise((resolve, reject) => 
        soundsRepo.deleteSound(id)
    )))
  }
}
