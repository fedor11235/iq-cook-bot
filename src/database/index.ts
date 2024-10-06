import dotenv from "dotenv";
dotenv.config();
import {Db, MongoClient, ObjectId} from "mongodb";
import {configService} from "../config/config.service";

class DatabaseConnection {
    private static _instance: DatabaseConnection;
    private mongoClient = new MongoClient(configService.getMongoConfig());
    private db: Db;

    private constructor() {

    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new DatabaseConnection();
        return this._instance;
    }

    async init() {
        const conn = await this.mongoClient.connect();
        this.db = conn.db(configService.getDbName());
    }

    async getAll(collectionName: string) {
        const collection = await this.db.collection(collectionName);
        return await collection.find({}).toArray();
    }

    async getById(collectionName: string, id: any) {
        const collection = await this.db.collection(collectionName);
        return collection.findOne({ _id: new ObjectId(id) });
    }

    async getOneByFilterQuery<T>(collectionName: string, query: any) {
        const collection = await this.db.collection(collectionName);
        return collection.findOne(query);
    }

    async create(collectionName: string, doc: any) {
        const collection = await this.db.collection(collectionName);
        return collection.insertOne(doc);
    }

    async updateOneByObject(collectionName: string, query: any, object: Record<string, any>) {
        const collection = await this.db.collection(collectionName);

        return collection.updateOne(
            query,
            {
                $set: object
            },
        );
    }
}

export default DatabaseConnection;