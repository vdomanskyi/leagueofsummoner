import { fileURLToPath } from 'url';
import fsx from 'fs-extra';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __dist = path.resolve(__dirname, '../../dist');
const __fields = path.resolve(__dirname, '../fields.json');
const __obtainAPIKey = path.resolve(__dirname, '../documentation/Text to obtain a personal API key.txt');
const __streamelements = path.resolve(__dirname, '../documentation/streamelements.txt');

const __oldAssets = path.resolve(__dirname, './assets.json');

const pkg = fsx.readJSONSync('./package.json');
const fields = fsx.readJsonSync(__fields, 'utf-8');
const streamelements = fsx.readFileSync(__streamelements, 'utf-8');

fsx.createFileSync(path.resolve(__dist, 'documentation', path.parse(__streamelements).base));
fsx.writeFileSync(
  path.resolve(__dist, 'documentation', path.parse(__streamelements).base),
  streamelements.replace(/{latest}/g, `@${pkg.version}`).replace(/{fields}/g, JSON.stringify(fields, null, 2)),
  'utf-8'
);

fsx.copyFileSync(__oldAssets, path.resolve(__dist, path.parse(__oldAssets).base));
fsx.copyFileSync(__obtainAPIKey, path.resolve(__dist, 'documentation', path.parse(__obtainAPIKey).base));
