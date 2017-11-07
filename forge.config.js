
const { productName } = require('./package.json');
const path = require('path');

const appPath = path.resolve(process.cwd(), `out/${productName}-darwin-x64/${productName}.app`);

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
    icon: './src/assets/icon.icns',
    'icon-size': 160,
    background: './src/assets/background.png',
    contents: [
      {
        x: 180,
        y: 170,
        type: 'file',
        path: appPath,
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
