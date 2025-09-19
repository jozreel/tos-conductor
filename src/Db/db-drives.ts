import {MongoClient, ServerApiVersion,Db, ObjectId } from 'mongodb';

class DbDriver {
    private readonly uri: string = process.env.DATABASE || '';
    private client: MongoClient;
    private readonly dbname:string = 'tosdb';
    private static cachedb: Db;


    public constructor() {
        this.client =  new MongoClient(this.uri), {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecaionErrors: true
            }
        };

    }

    public async run() {
        try {
            await this.client.connect();
            await this.client.db(this.dbname).command({ping: 1});
            console.log()


        } catch(ex: any) {

        } finally {
           //await this.client.close();
        }
    }


    public get db (): Db {
        
        if(DbDriver.cachedb) {
            return DbDriver.cachedb;
        }
        const db:Db = this.client.db(this.dbname);
        DbDriver.cachedb =  db;
        return db;
        
    }

    public get  Client():MongoClient {
        return this.client;
    }


    public ID(id?: string):ObjectId {
        if(id) {
            return new ObjectId(id);
        } else {
            return new ObjectId();
        }
    }

    public get DbName (): string {
        return this.dbname;
    }


}

export default DbDriver;