import { MoveModel } from './moveModel.js';
import { validateMove, validatePartialMove } from '../../schemas/moveSchema.js';
import { randomUUID } from 'node:crypto';

export class MovesController {
  static async getAll(req, res) {
    const { tipo, nombre } = req.query;
    try {
      const moves = await MoveModel.getAll({ tipo, nombre });
      res.json({
        count: moves.length,
        filters: { tipo, nombre },
        timestamp: new Date(),
        data: moves,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while retrieving the Moves',
        errorId: errorId,
      });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;
    try {
      const move = await MoveModel.getById({ id });
      if (!move)
        return res.status(404).json({
          status: 'error',
          message: 'Move not found',
        });
      res.json({
        status: 'success',
        timestamp: new Date(),
        data: move,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while retrieving the Move',
        errorId: errorId,
      });
    }
  }

  static async create(req, res) {
    const result = validateMove(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Move data',
        error: JSON.parse(result.error.message),
      });
    try {
      const newMove = await MoveModel.create({ input: result.data });
      res.status(201).json({
        status: 'success',
        message: 'Move created successfully',
        timestamp: new Date(),
        data: newMove,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while creating the Move',
        errorId: errorId,
      });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await MoveModel.delete({ id });
      if (result === false)
        return res.status(404).json({
          status: 'error',
          message: 'Move not found',
        });
      res.json({ status: 'success', message: 'Move deleted' });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while deleting the Move',
        errorId: errorId,
      });
    }
  }

  static async update(req, res) {
    const result = validatePartialMove(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Pokemon data',
        error: JSON.parse(result.error.message),
      });
    try {
      const { id } = req.params;
      const updatedMove = await MoveModel.update({ id, input: result.data });
      res.json({
        status: 'success',
        message: 'Move updated successfully',
        timestamp: new Date(),
        data: updatedMove,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`Error ID: ${errorId}`, error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating the Move',
        errorId: errorId,
      });
    }
  }
}
