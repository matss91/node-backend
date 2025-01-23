import { Request, Response } from "express";
import createError from "http-errors";
import Project, {Project as IProject} from "../models/Project";
import { Types } from "mongoose";
import Task from "../models/Task";
import { Priority } from "../types";
import { User } from "../models/User";


export const taskStore = async (req : any,res : Response) => { 
        try { 

            const {name, description, dateExpire, priority, project } = req.body;

            if([name, description, dateExpire, priority, project].includes("")) throw createError(400, "Todos los campos obligatorios");

            if(!Object.values(Priority).includes(priority)) throw createError(400, "La prioridad tiene un valor inválido!")

            const projectFound = await Project.findById(project);
            if(!projectFound) throw createError(404, "El proyecto no existe");

            if(projectFound.createdBy.toString() !== (req.user._id as Types.ObjectId).toString()) throw createError(403, "No estas autorizado!")

            const taskStore = await Task.create(req.body);

            projectFound.tasks.push(taskStore._id);
            await projectFound.save();

            return res.status(201).json({ 
                ok : true, 
                msg :'Tarea guardada con éxito',
                task : taskStore 
            }) 
        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ 
                ok : false, 
                msg : error instanceof Error ? error.message : 'Upss, hubo un error en TASK-STORE' 
            }) 
        } 
        
    }

export const taskUpdate = async (req : Request,res : Response) => { 
        try { 

            const { id } = req.params;
            const {name, description, priority, dateExpire} = req.body;

            if (
                [name, description, priority, dateExpire].includes("") ||
                !name ||
                !description ||
                !priority ||
                !dateExpire
            ) throw createError(400, "El nombre, la descripción, la prioridad y el cliente son datos obligatorios");

            if(!Object.values(Priority).includes(priority)) throw createError(400, "La prioridad tiene un valor inválido");

            if (!Types.ObjectId.isValid(id)) throw createError(400, "No es un ID válido");

            const task = await Task.findById(id).populate<{project : IProject}>("project");

            if (!task) throw createError(404, "Tarea no encontrada");

            if(task.project.createdBy.toString() !== (req.user._id as Types.ObjectId).toString()) throw createError(403, "No estas autorizado!")

            task.name = name || task.name;
            task.description = description || task.description;
            task.priority = priority || task.priority;
            task.dateExpire = dateExpire || task.dateExpire;

            await task.save();

            const taskUpadated = await Task.findById(id).populate<{project : IProject}>("project").populate<{user: User}>("assigned");

            return res.status(201).json({ 
                ok : true, 
                msg :'Tarea actualizada',
                task : taskUpadated
            }) 
        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ 
                ok : false, 
                msg : error instanceof Error ? error.message : 'Upss, hubo un error en TASK-UPDATE' 
            }) 
        } 
    }
export const taskRemove = async (req : Request,res : Response) => { 
        try { 

            const { id } = req.params;
            if (!Types.ObjectId.isValid(id)) throw createError(400, "No es un ID válido");

            const task = await Task.findById(id).populate<{project : IProject}>("project");
            if (!task) throw createError(404, "Tarea no encontrada");

            const projectFound = await Project.findById(task.project);
            if(!projectFound) throw createError(404, "El proyecto no existe");

            if(task.project.createdBy.toString() !== (req.user._id as Types.ObjectId).toString()) throw createError(403, "No estas autorizado!")

            projectFound.tasks.pull(id);

            await Promise.allSettled([
                await projectFound.save(),
                await task.deleteOne()
            ]);

            return res.status(200).json({ 
                ok : true, 
                msg :'Tarea eliminada' 
            }) 
        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ 
                ok : false, 
                msg : error instanceof Error ? error.message : 'Upss, hubo un error en TASK-REMOVE' 
            }) 
        } 
    }
export const taskChangeState = async (req : Request,res : Response) => { 
        try { 

            const { id } = req.params;
            if (!Types.ObjectId.isValid(id)) throw createError(400, "No es un ID válido");

            const task = await Task.findById(id).populate<{project : IProject}>("project");
            if (!task) throw createError(404, "Tarea no encontrada");

            if(task.project.createdBy.toString() !== (req.user._id as Types.ObjectId).toString()) throw createError(403, "No estas autorizado!")

            task.state = !task.state;
            task.assigned = req.user._id as Types.ObjectId ;
            await task.save();

            const taskUpadated = await Task.findById(id).populate<{project : IProject}>("project").populate<{user: User}>("assigned");


            return res.status(200).json({ 
                ok : true, 
                msg :'Estado actualizado',
                task : taskUpadated
            }) 
        } catch (error) { 
            console.log(error); 
           return res.status(500).json({ 
                ok : false, 
                msg : error instanceof Error ? error.message : 'Upss, hubo un error en TASK-CHANGE-STATE' 
            }) 
        } 
    }
