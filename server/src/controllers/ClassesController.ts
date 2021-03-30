import {Request, Response} from 'express';

import db from '../database/connection';
// import do conversor e horas e minutos
import convertHourToMinutes from '../utils/convertHourToMinutes';

//aqui defunindo os tipos do scheuduleItem
interface scheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class ClassController {

    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        //console.log(timeInMinutes);

        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule` . `class_id` = `classes` . `id`')
                .whereRaw('`class_schedule` . `week_day` = ??', [Number(week_day)])
                .whereRaw('`class_schedule` . `from` <= ?? ', [timeInMinutes])
                .whereRaw('`class_schedule` . `to` > ?? ', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);

    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        //assim com o trx o banco de dados vai comitar tudo de uma vez, se um dos inserts dá erro, ele vai desfazer todos os insert feitos antes
        const trx = await db.transaction();
    
        try{
     
        //insert na tabela users
        const insertedUsersIds = await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio,
        });
    
        //recebe o ID
        const user_id = insertedUsersIds[0];
    
    
        //insert na tabela classes
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id,
        })
    
        //recebe o ID
        const class_id = insertedClassesIds[0];
    
        //aqui vamos receber o class_id e vamos converter horas em minutos
        const classSchedule = schedule.map((scheduleItem: scheduleItem) => {
            return{
                class_id,
                week_day: scheduleItem.week_day,
                //aqui ele converteu as horas em minutos
                from: convertHourToMinutes(scheduleItem.from),
                to: convertHourToMinutes(scheduleItem.to),
            };
        })
    
        //insert na cllass_schedule
        await trx('class_schedule').insert(classSchedule);
    
    
        //aqui ele da o commit e executa tudo de uma vez
        await trx.commit();
    
        return response.status(201).send();
    
        } catch(err){
            //desfazer em caso de erro
            await trx.rollback();
    
            return response.status(400).json({
                erro: 'Unexpected erro while creating new class'
                
            })
        }
    
    
    }
}