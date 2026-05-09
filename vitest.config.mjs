import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
<<<<<<< HEAD
    include: ['test/**/*.spec.ts'],
=======
    include: ['test/**/*.spec.ts'], 
>>>>>>> staff
    fileParallelism: false,
    globals: true
  },
});
