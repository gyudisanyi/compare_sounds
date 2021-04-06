import { setsRepo, soundsRepo } from '../repositories/index.js';
import { promises as fsPromises } from 'fs';

export const soundsService = {

  async getSounds(setId, userId) {
    return await soundsRepo.getSounds(setId, userId);
  },

  async addFiles(files, body, setId, userId) {
    const Data = {}
    
    if (files) {
      if (!Array.isArray(files.File)) {files.File=[files.File]}
      const uploadPath = `./public/audio_src/${setId}/`;
      console.log(uploadPath);
      files.File.forEach((file) => {
        file.mv(uploadPath + file.name, function (err) {
          if (err)
            throw (err);
        })
      })
      if (!Array.isArray(body.Tracktitles)) {body.Tracktitles=[body.Tracktitles]}
      if (!Array.isArray(body.Trackdescriptions)) {body.Trackdescriptions=[body.Trackdescriptions]}
      const titles = files.File.map((file, i) => body.Tracktitles[i] || file.name);
      const descriptions = files.File.map((file, i) => body.Trackdescriptions[i] || `Add description for ${file.name}`);
      Data += Promise.all(titles.map((t, i) =>
        new Promise((resolve, reject) =>
          soundsRepo.addSounds(t, files.File[i].name, descriptions[i], setId, userId)
        )
      ));
    }

    if (body.AlteredTitles) {
      if (!Array.isArray(body.OldTrackTitles)) {body.OldTrackTitles=[body.OldTrackTitles]}
      const AlteredTitles = body.AlteredTitles.split(',');
      Data += Promise.all(AlteredTitles.map((t, i) =>
        new Promise((resolve, reject) =>
          soundsRepo.retitleSounds(t, body.OldTrackTitles[i])
        )
      ));
    }

    if (body.AlteredDescriptions) {
      const AlteredDescriptions = body.AlteredDescriptions.split(',');
      Data += Promise.all(AlteredDescriptions.map((t, i) =>
        new Promise((resolve, reject) =>
          soundsRepo.redescribeSounds(t, body.OldTrackDescriptions == 'string' ? body.OldTrackDescriptions : body.OldTrackDescriptions[i])
        )
      ));
    }

    if (body.ToDelete) {
      const del = body.ToDelete.split(',');
      Data += Promise.all(del.map((d) => 
        new Promise((resolve, reject) =>
          soundsRepo.deleteSounds(soundId))
      ))
    }

    return await Data;
  }
}