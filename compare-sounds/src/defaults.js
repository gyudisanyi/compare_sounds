export function defaultCollection() {
  return (
    {
      "set": {
        "id": 1,
        "title": "Good morning starshine",
        "description": "Léna and Sanyi did that"
      },
      "tracks": [
        {
          "id": 1,
          "title": "Mix 1",
          "filename": "1.wav",
          "description": "First mix - missed a vocal"
        },
        { 
          "id": 2,
          "title": "Mix 2",
          "filename": "2.wav",
          "description": "Final mix - vocal added and panning"
        }
      ],
      "loops": [
        {
          "id": 1,
          "start": 220,
          "end": 250,
          "description": "Loop2"
        },
        {
          "id": 2,
          "start": 846,
          "end": 890.35,
          "description": "Vocal added"
        },
      ]
    }
  )
}

export function defaultSets() {
  return (
    [
      {
          "id": 1,
          "title": "Good morning starshine",
          "description": "Léna and Sanyi did that"
      },
      {
          "id": 2,
          "title": "Adam and the Ants set",
          "description": "Songs from Kings of the Wild Frontier"
      },
      {
          "id": 3,
          "title": "Atmosphere",
          "description": "Small excerpts distorted"
      }
  ]
  )
}
