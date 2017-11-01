const electron = require('electron-compile')

const { productName } = require('./package.json');
const path = require('path');

console.log('HEYYAHEYHYEHAHE', electron)


const dir = process.cwd();
const outPath = path.resolve(dir, 'out/make', `${productName}.dmg`);

module.exports = {
  make_targets: {
    darwin: [
      'dmg',
    ],
  },
  electronPackagerConfig: {
    icon: './src/assets/icon.icns',
    extendInfo: {
      LSUIElement: 1,
    },
    packageManager: 'yarn',
  },
  github_repository: {
    owner: 'lucasbento',
    name: 'menubar-brightness',
  },
  electronInstallerDMG: {
    iconSize: 160,
    background: './src/assets/background.png',
    contents: [
      {
        x: 180,
        y: 170,
        type: 'file',
        path: outPath,
      },
      {
        x: 480,
        y: 170,
        type: 'link',
        path: '/Applications',
      },
    ],
  },
};
