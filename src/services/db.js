import PouchDB from 'pouchdb';
import PouchDBAdapterIDB from 'pouchdb-adapter-idb';

PouchDB.plugin(PouchDBAdapterIDB);

const db = new PouchDB('soundboard_presets', { adapter: 'idb' });

export default db;