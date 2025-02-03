import { Request, Response } from "express";
import createError from "http-errors";
import { confirmRegister, errorResponse, generateJWT, generateTokenRandom } from "../helpers";
import User from "../models/User";
import { compare } from "bcryptjs";

export const register = async (req : Request,res : Response) => { 
        try {

            const {name,email,password} = req.body;
if(name==undefined || email==undefined || password==undefined) throw createError(400,"Todos los campos son obligatorios");

 if([name,email,password].includes("")) throw createError(400,"Todos los campos son requeridos");

 let user = await User.findOne({email});

 if(user) throw createError(400,"El email ya se encuentra registrado");

 user = new User(req.body);
 user.token = generateTokenRandom();

 const userStore = await user.save();

 //TODO: enviar el email de confirmación con el TOKEN
await confirmRegister({
    name : userStore.name,
    email : userStore.email,
    token : userStore.token as string
})

 
            return res.status(201).json({ 
                ok : true, 
                msg :'Recibirás un mail con las instrucciones para completar tu registro',
                data:userStore
            }) 
        } catch (error) {                 
            
            errorResponse(res,error, 'REGISTER')
          
        } 
    }
    
export const login = async (req : Request,res : Response) => { 
        try { 
            const {email,password} = req.body;

            if(!email || !password) throw createError(400,"Todos los campos son obligatorios");
            
                let user = await User.findOne({email });
                if(!user) throw createError(403,"Credenciales inválidas | EMAIL");
                
                if(!user.checked) throw createError(403,"Tu cuenta no ha sido confirmada");
    
                if (!(await compare(password, user.password))) throw createError(403,"Credenciales inválidas | PASSWORD"); 
                        

            return res.status(200).json({ 
                ok : true, 
                msg :'Usuario Logueado',
                token : generateJWT({ id: user._id }),
                user : {
                    _id :  user._id,
                    name : user.name,
                    email : user.email,
                    }
                   
            }) 
        } catch (error) { 
            errorResponse(res,error, 'LOGIN')

        } 
    }
    export const checked = async (req : Request,res : Response) => { 
        try { 

            const {token} = req.query; 

            if(!token) throw createError(400,"Se require un Token");
            
            const user = await User.findOne({token});
            
            if(!user) throw createError(400,"Token inválido");
                
            user.checked = true;
            user.token = "";
            await user.save()

            return res.status(201).json({ 
                ok : true, 
                msg :'Registro completado exitosamente'
            }) 
        } catch (error) { 
            errorResponse(res,error, 'CHECKED')

        } 
    }
export const sendToken = async (req : Request,res : Response) => { 
        try { 
            const {email} = req.body;
            
            if(!email) throw createError(400,"Se require un email");

            let user = await User.findOne({email});
            
            if(!user) throw createError(400,"Email incorrecto");
            
            user.token = generateTokenRandom();
            await user.save();
            
            //TODO: Enviar email para reestablecer la contraseña

            return res.status(200).json({ 
                ok : true, 
                msg :'Se ha enviado un mail con las intrucciones' 
            }) 
        } catch (error) { 
            errorResponse(res,error, 'SEND-TOKEN')

        } 
    }
export const verifyToken = async (req : Request,res : Response) => { 
        try { 
            return res.status(200).json({ 
                ok : true, 
                msg :'Token verificado' 
            }) 
        } catch (error) { 
            errorResponse(res,error, 'VERIFY-TOKEN')

        } 
    }
export const changePassword = async (req : Request,res : Response) => { 
        try { 
            return res.status(200).json({ 
                ok : true, 
                msg :'Password actualizado' 
            }) 
        } catch (error) { 
            errorResponse(res,error, 'CHANGE-PASSWORD')

        } 
    }