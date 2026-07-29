const fs = require('fs');
const path = require('path');

const rootNodeModules = path.resolve(__dirname, '../../node_modules');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const dependencies = {};

Object.keys(packageJson.dependencies).forEach((dep) => {
  const depPath = path.join(rootNodeModules, dep);
  if (fs.existsSync(depPath)) {
    dependencies[dep] = {
      root: depPath,
    };
  }
});

module.exports = {
  dependencies,
};
