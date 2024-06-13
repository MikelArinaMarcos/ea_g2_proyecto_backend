import { Request, Response } from 'express';
import { IActivity } from '../models/activities/model';
import ActivityService from '../models/activities/service';
import UserService from '../models/users/service';
import { ObjectId } from 'mongodb';

export class ActivityController {
  private activity_service: ActivityService = new ActivityService();
  private user_service: UserService = new UserService();

  public async createActivity(req: Request, res: Response) {
    try {
      // Verificar si la solicitud incluye datos de ubicación
      const hasLocation =
        req.body.location && req.body.location.coordinates.length === 2;

      // Verificar si se proporcionan todos los campos requeridos
      if (
        req.body.name &&
        req.body.description &&
        req.body.owner &&
        req.body.date
      ) {
        // Crear objeto de parámetros de actividad
        const activity_params: IActivity = {
          name: req.body.name,
          rate: 0,
          description: req.body.description,
          owner: req.body.owner,
          date: req.body.date,
          image: req.body.image,
          active: true,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        };

        // Agregar datos de ubicación si están presentes
        if (hasLocation) {
          activity_params.location = req.body.location;
        }

        // Crear la actividad utilizando el servicio correspondiente
        const activity_data =
          await this.activity_service.createActivity(activity_params);

        // Agregar la actividad al usuario
        await this.user_service.addActivityToUser(
          req.body.owner,
          activity_data._id
        );

        // Enviar respuesta exitosa
        return res.status(201).json({
          message: 'Activity created successfully',
          activity: activity_data,
        });
      } else {
        // Enviar respuesta de error si faltan campos requeridos
        return res.status(400).json({ error: 'Missing fields' });
      }
    } catch (error) {
      // Manejar errores internos del servidor
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getActivity(req: Request, res: Response) {
    try {
      if (req.params.id) {
        const activity_filter = { _id: new ObjectId(req.params.id) }; // Convertir a ObjectId
        // Fetch user
        const post_data =
          await this.activity_service.filterActivity(activity_filter);
        // Send success response
        return res.status(200).json({ data: post_data, message: 'Successful' });
      } else {
        return res.status(400).json({ error: 'Missing fields' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const user_filter = { _id: req.params.id };
      const user_data = await this.user_service.filterUser(user_filter);
      const activity_data = await this.activity_service.getAll(user_data, parseInt(req.params.distance, 10));
      const total = activity_data.length; 
      const page = Number(req.params.page); // Convertir a número
      const limit = Number(req.params.limit); // Convertir a número
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const totalPages = Math.ceil(total / limit);

      const resultActivity = activity_data.slice(startIndex, endIndex);
      return res.status(200).json({
        activities: resultActivity,
        totalPages: totalPages,
        totalActivity: total,
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  public async getUserActivities(req: Request, res: Response) {
    try {
      if (req.params.id) {
        const activity_filter = { _id: new ObjectId(req.params.id) }; // Convertir a ObjectId
        const activities =
          await this.activity_service.filterUserActivities(activity_filter);
        return res
          .status(200)
          .json({ data: activities, message: 'Successful' });
      } else {
        return res.status(400).json({ error: 'Missing fields' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async deleteActivity(req: Request, res: Response) {
    try {
      if (req.params.id) {
        console.log(req.params.id);
        // Convertir a ObjectId
        const delete_details = await this.activity_service.deleteActivity(
          new ObjectId(req.params.id)
        );
        if (delete_details.deletedCount !== 0) {
          // Send success response if user deleted
          return res.status(200).json({ message: 'Successful' });
        } else {
          // Send failure response if user not found
          return res.status(400).json({ error: 'Post not found' });
        }
      } else {
        // Send error response if ID parameter is missing
        return res.status(400).json({ error: 'Missing Id' });
      }
    } catch (error) {
      // Catch and handle any errors
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async updateActivity(req: Request, res: Response) {
    try {
      if (req.params.id) {
        const activity_filter = { _id: new ObjectId(req.params.id) }; // Convertir a ObjectId
        // Fetch user
        const activity_data =
          await this.activity_service.filterActivity(activity_filter);
        if (!activity_data) {
          // Send failure response if user not found
          return res.status(400).json({ error: 'Activity not found' });
        }

        const activity_params: IActivity = {
          name: req.body.name,
          description: req.body.description,
          owner: req.body.owner,
          date: req.body.date,
          image: req.body.image,
          active: true,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        };
        await this.activity_service.updateActivity(
          activity_params,
          activity_filter
        );
        //get new activity data
        const new_activity_data =
          await this.activity_service.filterActivity(activity_filter);
        // Send success response
        return res
          .status(200)
          .json({ data: new_activity_data, message: 'Successful update' });
      } else {
        // Send error response if ID parameter is missing
        return res.status(400).json({ error: 'Missing ID parameter' });
      }
    } catch (error) {
      // Catch and handle any errors
      console.error('Error updating:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async participateActivity(req: Request, res: Response) {
    try {
      const userId = new ObjectId(req.params.id); // Convertir a ObjectId
      const activityId = new ObjectId(req.params.activityId); // Convertir a ObjectId

      await this.user_service.addActivityListToUser(userId, activityId);
      await this.activity_service.addListUsersToActivity(activityId, userId);

      return res.status(201).json({ message: 'Successful update' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
