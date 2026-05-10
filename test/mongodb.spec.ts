import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { connectDB } from '../src/db/mongoose';
import { connect } from 'mongoose';

vi.mock('mongoose', () => ({
  connect: vi.fn(),
}));

describe('connectDB()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test('debería lanzar un error si MONGODB_URL no está definida', async () => {
    vi.stubEnv('MONGODB_URL', '');

    await expect(connectDB()).rejects.toThrow(
      'MONGODB_URL is not defined in environment variables',
    );

    expect(connect).not.toHaveBeenCalled();
  });

  test('debería conectarse a MongoDB exitosamente', async () => {
    const testUrl = 'mongodb://localhost:27017/testdb';
    vi.stubEnv('MONGODB_URL', testUrl);

    vi.mocked(connect).mockResolvedValueOnce(true);
    await connectDB();

    expect(connect).toHaveBeenCalledWith(testUrl, { connectTimeoutMS: 10000 });
    expect(console.log).toHaveBeenCalledWith('Connected to MongoDB');
    expect(console.error).not.toHaveBeenCalled();
  });

  test('debería registrar y lanzar el error si la conexión falla', async () => {
    // 1. Preparación
    const testUrl = 'mongodb://localhost:27017/testdb';
    vi.stubEnv('MONGODB_URL', testUrl);

    const errorSimulado = new Error('Conexión rechazada por el servidor');

    vi.mocked(connect).mockRejectedValueOnce(errorSimulado);

    await expect(connectDB()).rejects.toThrow(
      'Conexión rechazada por el servidor',
    );

    expect(console.error).toHaveBeenCalledWith(
      'Error connecting to MongoDB:',
      errorSimulado,
    );
    expect(console.log).not.toHaveBeenCalled();
  });
});
