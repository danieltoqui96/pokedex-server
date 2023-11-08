import { AbilityModel } from './abilityModel.js';
import {
  validateAbility,
  validatePartialAbility,
} from '../../schemas/abilitySchema.js';
import { randomUUID } from 'node:crypto';

export class AbilitiesController {
  static async getAll(req, res) {
    const { nombre } = req.query;
    try {
      const abilities = await AbilityModel.getAll({ nombre });
      res.json({
        count: abilities.length,
        filters: { nombre },
        timestamp: new Date(),
        data: abilities,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while retrieving the Abilities',
        errorId: errorId,
      });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;
    try {
      const ability = await AbilityModel.getById({ id });
      if (!ability)
        return res.status(404).json({
          status: 'error',
          message: 'Ability not found',
        });
      res.json({
        status: 'success',
        timestamp: new Date(),
        data: ability,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while retrieving the Ability',
        errorId: errorId,
      });
    }
  }

  static async create(req, res) {
    const result = validateAbility(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Ability data',
        error: JSON.parse(result.error.message),
      });
    try {
      const newAbility = await AbilityModel.create({ input: result.data });
      res.status(201).json({
        status: 'success',
        message: 'Ability created successfully',
        timestamp: new Date(),
        data: newAbility,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while creating the Ability',
        errorId: errorId,
      });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await AbilityModel.delete({ id });
      if (result === false)
        return res.status(404).json({
          status: 'error',
          message: 'Ability not found',
        });
      res.json({ status: 'success', message: 'Ability deleted' });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while deleting the Ability',
        errorId: errorId,
      });
    }
  }

  static async update(req, res) {
    const result = validatePartialAbility(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Ability data',
        error: JSON.parse(result.error.message),
      });
    try {
      const { id } = req.params;
      const updatedAbility = await AbilityModel.update({
        id,
        input: result.data,
      });
      res.json({
        status: 'success',
        message: 'Ability updated successfully',
        timestamp: new Date(),
        data: updatedAbility,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating the Ability',
        errorId: errorId,
      });
    }
  }
}
