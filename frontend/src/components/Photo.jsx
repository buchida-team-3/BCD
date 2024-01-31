
const pexel = (id) => `img/img${id}.jpg`
const Photo = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1) },
  // Back
  { position: [-1.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(2) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(3) },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(4) },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(5) },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(6) },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(7) },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(8) },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(9) },

  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(10) },
  { position: [0, 2, 1.5], rotation: [0, 0, 0], url: pexel(11) },
  // Back
  { position: [-0.8, 2, -0.6], rotation: [0, 0, 0], url: pexel(12) },
  { position: [0.8, 2, -0.6], rotation: [0, 0, 0], url: pexel(13) },
  // Left
  { position: [-1.75, 2, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(14) },
  { position: [-2.15, 2, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(15) },
  { position: [-2, 2, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(16) },
  // Right
  { position: [2.75, 2, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(17) },
  { position: [0.15, 2, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(18) },
  { position: [3, 2, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(19) },

  { position: [0, 2, 1.5], rotation: [0, 0, 0], url: pexel(20) },
  { position: [1, 0, 1.5], rotation: [0, 0, 0], url: pexel(21) },
  // Back
  { position: [-1.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(22) },
  { position: [1.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(23) },
  // Left
  { position: [-3.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(24) },
  { position: [-4.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(25) },
  { position: [-3, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel(26) },
  // Right
  { position: [2.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(27) },
  { position: [3.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(28) },
  { position: [3, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(29) },
  { position: [3, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(30) }
];

export default Photo;