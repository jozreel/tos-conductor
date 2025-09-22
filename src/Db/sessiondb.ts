import Session from "../Models/sesson";
import DbDriver from "./db-drives";

class SessionDb extends DbDriver {
    private readonly collection: string =  'sessions';
    public async AddSession(data: Session) {
        try {
            await this.DeleteSessionsForUSer(data.UserId);
            const ins =  await this.db.collection(this.collection).insertOne({
                sessionid: data.SessionId,
                token: data.Token,
                userid: data.UserId,
                createddate: data.CreatedDate,
                lastmodifieddate: data.LastmodifiedDate
            });
            
            return data;

        } catch(ex) {
            throw ex;
        }
    }

    public async DeleteSessionsForUSer(userid: string) {
        try {
            const res =  await this.db.collection(this.collection).deleteMany({userid})
            if(res.deletedCount >0 ) {
                return {deleted:true};
            } else {
                 return {deleted: false}
            }
        } catch(ex) {
            throw ex;
        }

    }

    public async DelleteSession(sessionid: string) {
        try {
            const res = await this.db.collection(this.collection).deleteOne({sessionid});
            return {deleted: res.deletedCount > 0 ? true: false}

        } catch(ex) {
            throw ex;
        }
    }
}

export default SessionDb;