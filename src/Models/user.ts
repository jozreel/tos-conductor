import BaseModel from "./base-mopde";
import { FieldLengthError, FieldValueError } from "../errors";
import Role from "./role";

class User extends BaseModel {
    private userid: string;
    private username: string;
    private password?: string;
    private roles: Role[];
    private readonly userid_length: number =  64;
    private readonly username_length: number = 20;
    private readonly role_length:number =  64;
    public constructor(userid: string, created: Date, lasemodified: Date, createdby: string, lastmodby: string, username='', password='', roles:Role[]=[],) {
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

        if(password && !this.test_password(password)) {
            throw('Weak Password');
        }
        
        this.userid =  userid;
        this.username =  username;
        this.roles =  roles;
        this.password =  password;
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

    public get Roles(): Role[] {
        return this.roles;
    }

    public set Roles(roles: Role[]) {
        this.roles = roles;
    }

    private test_password(pass: string): boolean {
    const strongPasswordRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
      );

      return strongPasswordRegex.test(pass);
    }

}

export default User;