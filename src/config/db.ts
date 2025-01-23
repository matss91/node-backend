import { set, connect } from 'mongoose';

const connectDB = async () => { 
    try { 
        set('strictQuery',false); 
        const connection = await connect(process.env.DB_CONNECTION as string); 

        const url = `${connection.connection.host}:${connection.connection.port}`; 
        console.log(`MongoDB connected in ${url}`) 

    } catch (error: any) { 
        console.log(`error: ${error.message}`); 
        process.exit(1); //obliga a terminar todos los procesos 
    } 
}

export default connectDB
