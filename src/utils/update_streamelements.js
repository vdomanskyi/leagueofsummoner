import fsx from 'fs-extra';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const textPath = path.resolve(__dirname, '../dist/streamelements.txt');

const text = fsx.readFileSync(textPath, 'utf-8');
const pkg = fsx.readJSONSync('./package.json');

fsx.writeFile(textPath, text.replace(/leagueofsummoner@\d+\.\d+\.\d+/g, `leagueofsummoner@${pkg.version}`), 'utf-8');
