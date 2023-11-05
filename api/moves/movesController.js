import { MoveModel } from './moveModel.js';
import { validateMove, validatePartialMove } from '../../schemas/moveSchema.js';

export class MovesController {
  static async getAll(req, res) {
    const { tipo, nombre } = req.query;
    const moves = await MoveModel.getAll({ tipo, nombre });
    res.json(moves);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const move = await MoveModel.getById({ id });
    if (move) return res.json(move);
    res.status(404).json({ message: 'Move not found' });
  }

  static async create(req, res) {
    const result = validateMove(req.body);
    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    const newMove = await MoveModel.create({ input: result.data });
    res.status(201).json(newMove);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await MoveModel.delete({ id });
    if (result === false)
      return res.status(404).json({ message: 'Move not found' });
    res.json({ message: 'Move deleted' });
  }

  static async update(req, res) {
    const result = validatePartialMove(req.body);
    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    const { id } = req.params;
    const updatedMove = await MoveModel.update({ id, input: result.data });
    res.json(updatedMove);
  }
}
