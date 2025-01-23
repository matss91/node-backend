import { Request, Response } from "express";

export const profile = async(req: Request,res : Response) => { 
        try { 
            return res.status(200).json({ 
                ok : true, 
                msg :'Perfil de Usuario',
                user : req.user
            }) 
        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ 
                ok : false, 
                msg : error instanceof Error ? error.message : 'Upss, hubo un error en USERS-PROFILE' 
            }) 
        } 
    } 
