import fsx from 'fs-extra';
import { globSync } from 'glob';

const pathes = globSync(`./dist/**/*.js`).filter((f) => f.includes('widget'));

pathes.forEach((path) => {
  const regex = /import\s+.*\s+from\s+['"](.*)['"]/g;
  const file = fsx.readFileSync(path, 'utf-8').replace(regex, (match, path) => match.replace(path, `${path}.js`));

  fsx.writeFileSync(path, file);
});
