export function defaultCollection() {
  return (
    {
      "set": {
        "id": 1,
        "title": "Good morning starshine",
        "description": "Léna and Sanyi did that",
        "img_url": "LS.jpg",
      },
      "tracks": {
          1: {
            "title": "Mix 1",
            "filename": "1.wav",
            "description": "First mix - missed a vocal",
            "img_url": "L.jpg",
        },
          2: { 
            "title": "Mix 2",
            "filename": "2.wav",
            "description": "Final mix - vocal added and panning",
            "img_url": "L.jpg",
        }
      },
      "loops": {
        1: {
          "start": 220,
          "end": 250,
          "description": "Loop2",
        },
        2: {
          "start": 846,
          "end": 890.35,
          "description": "Vocal added",
        },
      }
    }
  )
}

export function defaultSets() {
  return (
    {
      1: {
          "title": "Good morning starshine",
          "description": "Léna and Sanyi did that",
      },
    }
  )
}
