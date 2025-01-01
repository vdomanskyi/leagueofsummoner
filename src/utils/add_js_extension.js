import fsx from 'fs-extra';
import { globSync } from 'glob';

const pathes = globSync(`./dist/**/*.js`);

pathes.forEach((path) => {
  const regex = /import\s+.*\s+from\s+['"](.*)['"]/g;
  const file = fsx.readFileSync(path, 'utf-8').replace(regex, (match, path) => {
    return !path.endsWith('.json') ? match.replace(path, `${path}.js`) : match;
  });

  fsx.writeFileSync(path, file);
});
