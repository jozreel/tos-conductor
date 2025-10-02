import { DatabaseOperationError } from "../errors";
import Role from "../Models/role";
import User from "../Models/user";
import { UserFilter } from "../types";
import DbDriver from "./db-drives";

class UserDb extends DbDriver {

    private readonly collection: string = 'users';
    private readonly rolecollection: string =  'roles';

    public async AddUser(data: User) {
        try {
            const ins =  this.db.collection(this.collection).insertOne({
                username: data.Username,
                userid: data.UserId,
                roles: data.Roles.map(r => r.Id),
                createddate: data.CreatedDate,
                createdny: data.CreatedBy,
                lastmodifieddate: data.LastmodifiedDate,
                modifiedby: data.ModifiedBy
            });

            if((await ins).insertedId) {
                return data;
            } else {
                throw new DatabaseOperationError("Could not insert data")
            }

        } catch(ex: any) {
            throw new DatabaseOperationError(ex.message)
        }
    }

    public async GetUsers(filters: UserFilter): Promise<User[]> {
        try {
            const query: any = {};
            if(filters.createddate) {
                query.createddate = filters.createddate
            }
            if(filters.lastmodifieddate) {
                query.lastmodifieddate =  filters.lastmodifieddate;
            }
            const ret_data: User[] = [];
            const res = this.db.collection(this.collection).find(query).skip(filters.skip || 0).limit(filters.linit || 0)
            while (await res.hasNext()) {
                const usr: any =  await res.next();
                const user_obj =  await this.MakeUser(usr);
                ret_data.push(user_obj);
            }

            return ret_data;

        } catch(ex) {
            throw new DatabaseOperationError("Could not fetch user data")
        }
    }

    public async GetUserById(id: string): Promise<User|null> {
        try {
            const _id =  this.ID(id);
            const usr = await this.db.collection(this.collection).findOne({_id});
            if(usr) {
                return await this.MakeUser(usr);
            } else {
                return null;
            }

        } catch(ex: any) {
            console.log(ex);
            throw new DatabaseOperationError("Could not retreive user information");
        }
    }



    public async GetUserByUsername(username: string): Promise<User|null> {
        try {
            const usr = await this.db.collection(this.collection).findOne({username});
            if(usr) {
                return await this.MakeUser(usr);
            } else {
                return null;
            }

        } catch(ex: any) {
            console.log(ex);
            throw new DatabaseOperationError("Could not retreive user information");
        }
    }



    private async MakeUser(usr:  any): Promise<User> {
        try {
            const roles = usr.roles;
                const role = await this.db.collection(this.rolecollection).find({_id: {$in: roles}});
                const rls: any[] =  await role.toArray();
                const u_roles =  rls.map(r => new Role({
                        rolename: r.rolename,
                        id:  r._id,
                        createdby: r.createdby,
                        createddate: r.createddate,
                        lastmodifiedby: r.lastmodifiedby,
                        lastmodifieddate: r.lastmodifieddate,
                        description: r.description
                    }));
                const user_obj = new User(
                    usr.userid,
                    usr.createddate,
                    usr.lastmodifieddate,
                    usr.createdby,
                    usr.modifiedby,
                    usr.username,
                    '',
                    u_roles
                );

            return user_obj;

        } catch (ex) {
            throw ex;
        }

    }

}

export default UserDb;


