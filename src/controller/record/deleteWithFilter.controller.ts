import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Record } from '../../models/records/recordSchema.js';

export async function deleteWithFilter(req: Request, res: Response) {
  try {
    const filter = req.body;

    if (!filter || Object.keys(filter).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Filter cannot be empty',
      });
      return;
    }

    const result = await Record.deleteMany(filter);

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: 'No records found matching the filter',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} record(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        success: false,
        message: 'Invalid filter criteria',
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting records',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
