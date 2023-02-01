import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const ola = join(__dirname, 'public', 'css');
// const ola = relative(__dirname+'/public', 'src\public')
// console.log(join(__dirname, 'public', 'css'));
// console.log(relative(fileURLToPath(import.meta.url), fileURLToPath(import.meta.url)));

