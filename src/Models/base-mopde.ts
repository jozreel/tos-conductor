class BaseModel {
    protected createddate:Date;
    protected lastmodifieddate:Date;
    protected createdby: string;
    protected modifiedby: string;

    public constructor(created: Date, lastmod: Date, created_by: string, lastmod_by: string) {
        this.createddate =  created;
        this.lastmodifieddate =  lastmod;
        this.createdby =  created_by;
        this.modifiedby =  lastmod_by;
    }

    public set CreatedDate(cdate: Date) {
        this.createddate = cdate;
    }

    public get LastmodifiedDate(): Date {
        return this.lastmodifieddate;
    }

    public set LastmodifiedDate(lmd: Date) {
        this.lastmodifieddate = lmd;
    }

    public get  GreatedBy(): string {
        return this.createdby;
    }

    public set CreatedBy(user:  string) {
        this.createdby =  user;
    }

    public get ModifiedBy(): string {
        return this.modifiedby;
    }

    public set ModifiedBy(user: string) {
        this.modifiedby =  user;
    }
}

export default BaseModel;