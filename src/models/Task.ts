import mongoose, { Types } from 'mongoose'; 
import { Priority } from '../types';
 
var taskSchema = new mongoose.Schema({ 
    name:{ 
        type:String, 
        required:true, 
        trim : true, 
    }, 
    description:{ 
        type:String, 
        required:true, 
        trim:true, 
    }, 
    state:{ 
        type:Boolean, 
        default:false, 
    }, 
    dateExpire:{ 
        type:Date, 
        required:true, 
        default : Date.now() 
    }, 
    priority : { 
        type : String, 
        required:true, 
        enum : Priority, //opciones cerradas 
    }, 
    project : { 
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
    },
    assigned : {
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    }
},{ 
    timestamps : true 
}); 

export type Task = {
    name : string;
    description : string;
    dateExpire : Date;
    state : boolean;
    priority : Priority;
    project : Types.ObjectId;
    assigned? : Types.ObjectId;
}
 
export default mongoose.model<Task>('Task', taskSchema); 
