function rangesToGradient(
  loops,
  color1 = `black`,
  color2 = `yellow`) 
  {
    const pt1 = `linear-gradient(90deg, ${color1} 0%, `;
    const pt2 = loops.map((loop) =>
      `${color1} ${loop.range[0] / 10}%, ${color2} ${loop.range[0] / 10}%, 
      ${color2} ${loop.range[1] / 10}%, ${color1} ${loop.range[1] / 10}%, `);
    const pt3 = `${color1} 100%)`;
  return (pt1 + pt2.join('') + pt3);
}

export default rangesToGradient;