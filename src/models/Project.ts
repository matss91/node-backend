import mongoose, { Types } from 'mongoose';  
import { Task } from './Task';
import { User } from './User';
 
var projectSchema = new mongoose.Schema({ 
    name:{ 
        type:String, 
        required:true, 
        trim:true, 
    }, 
    description:{ 
        type:String, 
        required:true, 
        trim:true, 
    }, 
    dateExpire:{ 
        type:Date, 
        default:Date.now(), 
    }, 
    client:{ 
        type:String, 
        required:true, 
        trim:true, 
    }, 
    createdBy:{ 
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required : true
    },
    tasks : [
        { 
            type:mongoose.Schema.Types.ObjectId, 
            ref: 'Task', 
        } 
    ],
    collaborators :[ 
        { 
            type:mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
        } 
    ], 
},{ 
    timestamps : true, 
}); 


export type Project = {
    name : string;
    description : string;
    dateExpire : Date;
    createdBy : Types.ObjectId;
    client : string;
    tasks : Types.Array<Task>;
    collaborators : Types.Array<Types.ObjectId>;
}
 
export default  mongoose.model<Project>('Project', projectSchema);