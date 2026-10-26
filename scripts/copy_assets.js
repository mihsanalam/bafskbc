const fs = require('fs');
const path = require('path');

const copies = [
  { src: 'assets/inspect/6_JefYm2BbuZNQiksfIBqZy7ib7tk.png', dest: 'assets/images/mockup-phone-kerkhoff.png' },
  { src: 'assets/inspect/7_Kg148fI8G685YznZe3uUIve7c0.webp', dest: 'assets/images/mockup-tablet-stylus.webp' },
  { src: 'assets/inspect/11_kiXQHI5pic4MdW4VRf7goUicRhs.png', dest: 'assets/images/portfolio-trail-homes.png' },
  { src: 'assets/inspect/12_jgOmHf10vKcrE7Vw3MqS9hpA.webp', dest: 'assets/images/portfolio-felty-tote.webp' },
  { src: 'assets/inspect/13_TzI2RXhAluxrWCsTLYtzypNt9B8.jpg', dest: 'assets/images/portfolio-tablet-blue.jpg' },
  { src: 'assets/inspect/14_ttvmLo6JcW4PRA5PqL4ER8Wb02A.webp', dest: 'assets/images/portfolio-tablet-wm.webp' },
  { src: 'assets/inspect/15_A9ZkpsWys2ylV2ZzARA68Beqc0Q.webp', dest: 'assets/images/portfolio-collage-situate.webp' },
  { src: 'assets/inspect/16_mbCIN3XVCR7iBxD7YipquQkAd0.png', dest: 'assets/images/portfolio-phone-pizza.png' }
];

copies.forEach(({ src, dest }) => {
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
});
