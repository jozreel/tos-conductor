import BaseModel from "./base-mopde";
import { FieldLengthError, FieldValueError } from "../errors";

class User extends BaseModel {
    private userid: string;
    private username: string;
    private role: string;
    private readonly userid_length: number =  64;
    private readonly username_length: number = 20;
    private readonly role_length:number =  64;
    public constructor(userid: string, created: Date, lasemodified: Date, createdby: string, lastmodby: string, username='', role="",) {
        super(created, lasemodified, createdby, lastmodby);
        if(!userid) {
            throw new FieldValueError("userid is required");
        }
        if(userid && userid.length > this.userid_length) {
            throw new FieldLengthError(`User id has a max length of ${this.userid_length}`);
        }
        if(username && username.length > this.username_length) {
            throw new FieldLengthError(`Username has a mx length od ${this.username_length}`)
        }
        if(role && role.length > this.role_length) {
            throw new FieldLengthError(`Role has a max length of ${this.role_length}`);
        }
        this.userid =  userid;
        this.username =  username;
        this.role =  role;
    }

    public get UserId(): string {
        return this.userid;
    }

    public set UserId(val: string) {
        this.userid =  val;;
    }

    public get Username(): string {
        return this.username;
    }

    public set Username(user_name: string) {
        this.username = this.username;
    }

    public get Role(): string {
        return this.role;
    }

    public set Role(role: string) {
        this.role = role;
    }
}

export default User;