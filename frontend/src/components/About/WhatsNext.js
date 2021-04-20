import React from 'react';

export default function WhatsNext() {

  return (
    <>
      <h4>What's next</h4>
      <p>
        Features and looks are basic. I went for the minimum viable product.
      </p>
      <p>
        What's to add asap is editing option to sounds and images. 
        Now the set's playing length defaults to that of the shortest track, 
        and you have to be smart or lucky with images. Text edits will be integrated into the player surface.
      </p>
      <p>
        What's more substantial is audio handling. 
        It's now driven by audio events updated every 40-150 ms - this is a granularity 
        one can't set and it's too rough for precise loops - or a fluent progress bar. 
        The latter of which could be worked around but it'll be better to switch to 
        web audio api instead.
      </p>
      <p>
        <b>Known issues</b>
          <ul>
            <li>
              Since saved loops are set by proportions, not absolute times, once the 
              shortest track is replaced, they will point to different times.
            </li>
            <li>
              Nested loops can be saved and loaded, but one of them probably gets ignored. 
              Too short loops or loops too close to one another can be impractical but I kept it for the fun results.
            </li>
          </ul>
      </p>
      <p>
       Snap/loop (etc) logic is what I feel practical, you might find it otherwise - 
       there could be other issuse. Share your thoughts and experiences!
      </p>
    </>
  )
}