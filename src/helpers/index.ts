import { Response } from "express";
import { Types } from "mongoose";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import 'dotenv/config'

export interface TokenInterface {
    id : Types.ObjectId
}

export interface DataSendMail {
    name : string;
    email : string;
    token : string ;
}

export const errorResponse = (res: Response, error: any, origin : string) => {

    return res.status(error.status || 500).json({ 
        ok : false, 
        msg : error instanceof Error ? error.message : `Upss, hubo un error en ${origin}`
    }) 
}

export const generateTokenRandom = () => {
    const random = Math.random().toString(32).substring(2);
    const date = Date.now().toString(32);
    return random + date
}

export const generateJWT = (payload : TokenInterface) => jwt.sign(payload, process.env.JWT_SECRET as string,{
 expiresIn : '1h'
})

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 2525,
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASSWORD,
    }
});


export const confirmRegister = async (data : DataSendMail) => {

    const {name, email, token} = data;

    try {

        const responseMail = await transporter.sendMail({
            from : "Project Manager <info@projectmanager.com>",
            to : email,
            subject : "Confirmá tu cuenta",
            text : "Confirmá tu registro en Project Manager",
            html : `
            <p>Hola ${name}, hacé click en el siguiente enlace:</p>
            <a href=${process.env.URL_FRONTEND}/confirmar/${token}>confirma tu cuenta<a/>
            `
        })
        console.log(responseMail);
        

        
    } catch (error) {
        console.log(error);
        
    }

}