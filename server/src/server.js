import app from './app.js'
import { prisma } from './config/db.config.js';

const PORT = process.env.PORT || 3001;

app.get('/',(req,res)=>{
  res.send('hello');
})

const startServer = async () => {
  try {
    await prisma.$connect();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

