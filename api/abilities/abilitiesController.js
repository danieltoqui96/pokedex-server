import { AbilityModel } from './abilityModel.js';
import {
  validateAbility,
  validatePartialAbility,
} from '../../schemas/abilitySchema.js';
import { randomUUID } from 'node:crypto';

export class AbilitiesController {
  // Obtener todas las habilidades
  static async getAll(req, res) {
    try {
      const { nombre } = req.query;
      const abilities = await AbilityModel.getAll({ nombre });
      res.json({
        count: abilities.length,
        filters: { nombre },
        data: abilities,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar habilidades',
        errorId: errorId,
      });
    }
  }

  // Obtener una habilidad por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const ability = await AbilityModel.getById({ id });
      res.json({
        status: 'success',
        data: ability,
      });
    } catch (error) {
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Habilidad no encontrada',
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar habilidad',
        errorId: errorId,
      });
    }
  }

  // Crear una nueva habilidad
  static async create(req, res) {
    try {
      const result = validateAbility(req.body);
      if (!result.success) throw { message: 'INVALID_DATA', result: result };
      const newAbility = await AbilityModel.create({ input: result.data });
      res.status(201).json({
        status: 'success',
        message: 'Habilidad creada con éxito',
        data: newAbility,
      });
    } catch (error) {
      if (error.message === 'INVALID_DATA')
        return res.status(400).json({
          status: 'error',
          message: 'Datos de habilidad inválidos',
          error: JSON.parse(error.result.error),
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al crear habilidad',
        errorId: errorId,
      });
    }
  }

  // Eliminar una habilidad
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await AbilityModel.delete({ id });
      res.json({ status: 'success', message: 'Habilidad eliminada' });
    } catch (error) {
      if (error.message === 'ABILITY_IN_USE')
        return res.status(409).json({
          status: 'error',
          message: 'Habilidad en uso',
          error: `Habilidad presente en: ${error.pokemon.join(', ')}`,
        });
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Habilidad no encontrada',
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al eliminar habilidad',
        errorId: errorId,
      });
    }
  }

  // Actualizar una habilidad
  static async update(req, res) {
    try {
      const result = validatePartialAbility(req.body);
      if (!result.success) throw { message: 'INVALID_DATA', result: result };
      const { id } = req.params;
      const updatedAbility = await AbilityModel.update({
        id,
        input: result.data,
      });
      res.json({
        status: 'success',
        message: 'Habilidad actualizada con éxito',
        data: updatedAbility,
      });
    } catch (error) {
      if (error.message === 'INVALID_DATA')
        return res.status(400).json({
          status: 'error',
          message: 'Datos de habilidad inválidos',
          error: JSON.parse(error.result.error),
        });
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Habilidad no encontrada',
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al actualizar habilidad',
        errorId: errorId,
      });
    }
  }
}
