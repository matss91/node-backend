import { compare, hash } from 'bcryptjs';
import mongoose, { InferSchemaType } from 'mongoose';

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        trim: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        trim: true,
    },
    token:{
        type:String,
    },
    checked :{ 
        type: Boolean, 
        default : false, 
    },
},{
    timestamps : true
});

userSchema.pre('save', async function (next) { 
    if(!this.isModified('password')){ //evita volver a hashear el password cuando este no ha sido modificado 
        next() 
    } 
    this.password = await hash(this.password, 10); 
}); 

 /* puedo crear más métodos */ 
 userSchema.methods.checkedPassword = async function(password : string){ 
    return await compare(password, this.password) 
}

export type User = InferSchemaType<typeof userSchema>

//Export the model
export default mongoose.model<User>('User', userSchema);