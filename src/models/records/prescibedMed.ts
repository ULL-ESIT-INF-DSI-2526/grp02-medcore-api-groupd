import mongoose from 'mongoose';

export interface prescribedMed {
  medication: mongoose.Types.ObjectId;
  amount: number;
  instructions: string;
}
