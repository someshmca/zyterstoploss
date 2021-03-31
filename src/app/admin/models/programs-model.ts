export interface IProgram{
    programId: string;
    description: string;
    createid: string;
    createdOn: string;
    updateid: string;
    lastupdate: Date;
}

export interface IProgramIDRequest{
    programId: string;
}

export interface IProgramAdd{
    programId: string;
    description: string;
    createid: string;
    createdOn: string;
    updateid: string;
    lastupdate: Date;
}

export interface IAddProgramSuccess{
    id: string;
    message: string;
}

export interface IProgramUpdate{
    programId: string;
    description: string;
    createid: string;
    createdOn: string;
    updateid: string;
    lastupdate: Date;
}

export interface IUpdateProgramSuccess{
    id: string;
    message: string;
}


