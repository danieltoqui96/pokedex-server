import { AbilityModel } from './abilityModel.js';
import {
  validateAbility,
  validatePartialAbility,
} from '../../schemas/abilitySchema.js';

export class AbilitiesController {
  static async getAll(req, res) {
    const { nombre } = req.query;
    const abilities = await AbilityModel.getAll({ nombre });
    res.json(abilities);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const ability = await AbilityModel.getById({ id });
    if (ability) return res.json(ability);
    res.status(404).json({ message: 'Ability not found' });
  }

  static async create(req, res) {
    const result = validateAbility(req.body);
    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    const newAbility = await AbilityModel.create({ input: result.data });
    res.status(201).json(newAbility);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await AbilityModel.delete({ id });
    if (result === false)
      return res.status(404).json({ message: 'Ability not found' });
    res.json({ message: 'Ability deleted' });
  }

  static async update(req, res) {
    const result = validatePartialAbility(req.body);
    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    const { id } = req.params;
    const updatedAbility = await AbilityModel.update({
      id,
      input: result.data,
    });
    res.json(updatedAbility);
  }
}
