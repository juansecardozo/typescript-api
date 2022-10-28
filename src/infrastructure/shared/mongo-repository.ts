import {Collection, Db} from 'mongodb';

export abstract class MongoRepository {
    protected _collection: Collection;

    constructor(db: Db, collectionName: string) {
        this._collection = db.collection(collectionName);
    }
}