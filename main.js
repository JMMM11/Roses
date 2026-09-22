(() => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const rosesLayer = document.getElementById('rosesLayer');
  const grassBack = document.getElementById('grassBack');
  const grassFront = document.getElementById('grassFront');

  let seed = 42;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const range = (min, max) => min + random() * (max - min);

  const setHref = (element, id) => {
    element.setAttribute('href', id);
    element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', id);
  };

  function makeGrassBlade(x, y, height, color, delay, duration) {
    const blade = document.createElementNS(svgNS, 'path');
    const lean = range(-6, 6);
    blade.setAttribute('d', `M${x},${y} Q${x + lean},${y - height * .6} ${x + lean * 1.4},${y - height}`);
    blade.setAttribute('stroke', color);
    blade.setAttribute('stroke-width', (height * .18).toFixed(1));
    blade.setAttribute('stroke-linecap', 'round');
    blade.setAttribute('fill', 'none');
    blade.setAttribute('class', 'grass-blade');
    blade.style.animationDuration = `${duration}s`;
    blade.style.animationDelay = `${delay}s`;
    return blade;
  }

  const grassColors = ['#3f6212', '#4d7c0f', '#65a30d', '#84cc16'];
  const addGrass = (target, count, yMin, yMax, heightMin, heightMax) => {
    for (let i = 0; i < count; i += 1) {
      const color = grassColors[Math.floor(random() * grassColors.length)];
      target.appendChild(makeGrassBlade(
        range(0, 1200), range(yMin, yMax), range(heightMin, heightMax),
        color, range(0, 3), range(2.2, 4.5),
      ));
    }
  };

  addGrass(grassBack, 140, 440, 480, 18, 34);
  addGrass(grassFront, 90, 650, 700, 30, 55);

  function makeRose(x, groundY, scale, kind) {
    const group = document.createElementNS(svgNS, 'g');
    const duration = range(3.4, 5.5);
    group.setAttribute('class', 'rose-group');
    group.setAttribute('transform', `translate(${x},${groundY})`);
    group.style.animationDuration = `${duration}s`;
    group.style.animationDelay = `${-range(0, 3)}s`;

    const stemHeight = range(90, 150) * scale;
    const stem = document.createElementNS(svgNS, 'path');
    const sway = range(-8, 8);
    stem.setAttribute('d', `M0,0 Q${sway},${-stemHeight * .5} 0,${-stemHeight}`);
    stem.setAttribute('stroke', '#3f7d1c');
    stem.setAttribute('stroke-width', (3.2 * scale).toFixed(1));
    stem.setAttribute('stroke-linecap', 'round');
    stem.setAttribute('fill', 'none');
    group.appendChild(stem);

    const leaf = document.createElementNS(svgNS, 'use');
    setHref(leaf, '#leafPair');
    leaf.setAttribute('transform', `translate(0,${-stemHeight * range(.35, .55)}) scale(${scale * range(.8, 1.15)})`);
    group.appendChild(leaf);

    const bloom = document.createElementNS(svgNS, 'use');
    setHref(bloom, kind === 'bud' ? '#roseBud' : '#roseBloom');
    bloom.setAttribute('transform', `translate(0,${-stemHeight}) rotate(${range(-8, 8)}) scale(${scale * range(.85, 1.25)})`);
    group.appendChild(bloom);
    return group;
  }

  const rows = [
    { y: 470, count: 6, min: .55, max: .7 },
    { y: 510, count: 5, min: .7, max: .85 },
    { y: 560, count: 5, min: .85, max: 1.05 },
    { y: 620, count: 4, min: 1, max: 1.25 },
  ];

  rows.forEach(({ y, count, min, max }) => {
    const spacing = 1200 / count;
    for (let i = 0; i < count; i += 1) {
      const x = spacing * i + spacing / 2 + range(-spacing * .3, spacing * .3);
      rosesLayer.appendChild(makeRose(x, y + range(-10, 10), range(min, max), random() < .15 ? 'bud' : 'bloom'));
    }
  });
})();
