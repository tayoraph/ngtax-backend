import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()

export class CblHash{

async hashPassword(password:string){
const saltRounds = 7;
const salt = await bcrypt.genSalt(saltRounds);
const hash = await bcrypt.hash(password, salt);
return hash;
}

/** compare hashed */
async compare(data:any, hash:string):Promise<boolean>{
    const isMatch = await bcrypt.compare(data, hash);
    return isMatch;
}

}