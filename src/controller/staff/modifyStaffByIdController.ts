import { Request, Response } from 'express';
import mongoose from 'mongoose';
import iStaff from '../../models/staff/staffInterface.js';
import { modifyStaffById } from '../../services/staff/modifyStaffById.js';

export async function modifyStaffByIdController(
  req: Request<{ id: string }, {}, Partial<iStaff>>,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await modifyStaffById(id, req.body);

    if (!result) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    return res.status(200).json(result);

  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}