import { app } from './app.js';
import { connectDB } from './db/mongoose.js';

const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server on port ${port}`));
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
})();
