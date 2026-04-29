import { connect } from 'mongoose';

export async function connectDB() {
  const url = process.env.MONGODB_URL;
  if (!url) throw new Error('MONGODB_URL is not defined in environment variables');
  try {
    await connect(url, {connectTimeoutMS: 10000});
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
