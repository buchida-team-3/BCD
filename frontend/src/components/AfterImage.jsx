import image1 from './images/IMG_3841.JPG';
import image2 from './images/IMG_3842.JPG';
import image3 from './images/IMG_3843.JPG';
import image4 from './images/IMG_3844.JPG';
import image5 from './images/IMG_3845.JPG';
import image6 from './images/IMG_3846.JPG';
import image7 from './images/IMG_1527.JPG';
import image8 from './images/IMG_4113.JPG';
import image9 from './images/IMG_4596.JPG';
import image10 from './images/IMG_32090.JPG';
import image11 from './images/IMG_PLUS.JPG';

const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const AfterImage = [
  // Left
  { position: [-1.5, 0, 3], rotation: [0, Math.PI / 10, 0], url: image5 },
  { position: [-1.6, 0, 3], rotation: [0, Math.PI / 10, 0], url: image2 },
  { position: [-1.7, 0, 3], rotation: [0, Math.PI / 10, 0], url: image3 },
  { position: [-1.8, 0, 3], rotation: [0, Math.PI / 10, 0], url: image4 },
  { position: [-1.9, 0, 3], rotation: [0, Math.PI / 10, 0], url: image9 },
  { position: [-2, 0, 3], rotation: [0, Math.PI / 10, 0], url: image10 },
  
  // Front
  { position: [0, 0, 3], rotation: [0, Math.PI / 10, 0], url: image1 },
  { position: [-0.1, 0, 3], rotation: [0, Math.PI / 10, 0], url: image7 },
  { position: [-0.2, 0, 3], rotation: [0, Math.PI / 10, 0], url: image7 },
  { position: [-0.3, 0, 3], rotation: [0, Math.PI / 10, 0], url: image9 },

  // Right
  { position: [1.1, 0, 3], rotation: [0, Math.PI / 10, 0], url: image7 },
  { position: [1.2, 0, 3], rotation: [0, Math.PI / 10, 0], url: image1 },
  { position: [1.3, 0, 3], rotation: [0, Math.PI / 10, 0], url: image7 },
  { position: [1, 0, 3], rotation: [0, Math.PI / 10, 0], url: image9 },


  { position: [2.2, 0, 3], rotation: [0, Math.PI / 10, 0], url: image11 }
]

export default AfterImage;