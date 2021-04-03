export function defaultCollection() {
  return (
    {
      "set": {
        "title": "DEFAULT OFFLINE Good morning starshine",
        "description": "Léna and Sanyi did that"
      },
      "tracks": [
        {
          "title": "Mix 1",
          "url": "1.wav",
          "description": "OFFLINE First mix - missed a vocal"
        },
        {
          "title": "Mix 2",
          "url": "2.wav",
          "description": "Final mix - vocal added and panning"
        }
      ],
      "loops": [
        {
          "loopstart": 220,
          "loopend": 450,
          "description": "Loop2"
        },
        {
          "loopstart": 846,
          "loopend": 890.35,
          "description": "Loop1"
        },
      ]
    }
  )
}

export function defaultSets() {
  return (
    [
      {
          "idsets": 1,
          "title": "Good morning starshine",
          "description": "Léna and Sanyi did that"
      },
      {
          "idsets": 2,
          "title": "Adam and the Ants set",
          "description": "Songs from Kings of the Wild Frontier"
      },
      {
          "idsets": 3,
          "title": "Atmosphere",
          "description": "Small excerpts distorted"
      }
  ]
  )
}
