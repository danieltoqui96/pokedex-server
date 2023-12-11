import { MoveModel } from './moveModel.js';
import { validateMove, validatePartialMove } from '../../schemas/moveSchema.js';
import { randomUUID } from 'node:crypto';

export class MovesController {
  // Obtener todos los movimientos
  static async getAll(req, res) {
    try {
      const { tipo, nombre } = req.query;
      const moves = await MoveModel.getAll({ tipo, nombre });
      res.json({
        count: moves.length,
        filters: { tipo, nombre },
        data: moves,
      });
    } catch (error) {
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar movimientos',
        errorId: errorId,
      });
    }
  }

  // Obtener un movimiento por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const move = await MoveModel.getById({ id });
      res.json({
        status: 'success',
        data: move,
      });
    } catch (error) {
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Movimiento no encontrado',
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al recuperar movimiento',
        errorId: errorId,
      });
    }
  }

  // Crear un nuevo movimiento
  static async create(req, res) {
    try {
      const result = validateMove(req.body);
      if (!result.success) throw { message: 'INVALID_DATA', result: result };
      const newMove = await MoveModel.create({ input: result.data });
      res.status(201).json({
        status: 'success',
        message: 'Movimiento creado con éxito',
        data: newMove,
      });
    } catch (error) {
      if (error.message === 'INVALID_DATA')
        return res.status(400).json({
          status: 'error',
          message: 'Datos de movimiento inválidos',
          error: JSON.parse(error.result.error),
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al crear movimiento',
        errorId: errorId,
      });
    }
  }

  // Eliminar un movimiento
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await MoveModel.delete({ id });
      res.json({ status: 'success', message: 'Movimiento eliminado' });
    } catch (error) {
      if (error.message === 'MOVE_IN_USE')
        return res.status(409).json({
          status: 'error',
          message: 'Movimiento en uso',
          error: `Movimiento presente en: ${error.pokemon.join(', ')}`,
        });
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Movimiento no encontrado',
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al eliminar movimiento',
        errorId: errorId,
      });
    }
  }

  // Actualizar un movimiento
  static async update(req, res) {
    try {
      const result = validatePartialMove(req.body);
      if (!result.success) throw { message: 'INVALID_DATA', result: result };
      const { id } = req.params;
      const updatedMove = await MoveModel.update({ id, input: result.data });
      res.json({
        status: 'success',
        message: 'Movimiento actualizado con éxito',
        data: updatedMove,
      });
    } catch (error) {
      if (error.message === 'INVALID_DATA')
        return res.status(400).json({
          status: 'error',
          message: 'Datos de movimiento inválidos',
          error: JSON.parse(error.result.error),
        });
      if (error.message === 'NOT_FOUND')
        return res.status(404).json({
          status: 'error',
          message: 'Movimiento no encontrado',
        });
      const errorId = randomUUID();
      console.error(`🔴 Error Id:${errorId}, msj: `, error.message);
      res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al actualizar movimiento',
        errorId: errorId,
      });
    }
  }
}
