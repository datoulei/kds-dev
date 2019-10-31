import lowdb from 'lowdb';
import LodashId from 'lodash-id';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs-extra';
import { app, remote } from 'electron';

const APP = process.type === 'renderer' ? remote.app : app;

const DB_PATH = APP.getPath('userData');
console.log(DB_PATH);
if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(DB_PATH)) {
    fs.mkdirpSync(DB_PATH);
  }
}

const adapter = new FileSync(path.join(DB_PATH, '/kds-db.json'));

const db = lowdb(adapter);
db._.mixin(LodashId);

export default db;
