import Agenda from 'agenda';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
  console.log("Development mode: Environment variables loaded.");
}

const agenda = new Agenda({
  db: { 
    address: process.env.DATABASE_URL, 
    collection: 'agendaJobs',
    options: {
      useUnifiedTopology: true,
    }
  },
  processEvery: '1 minute',      
  maxConcurrency: 5,               
  defaultConcurrency: 2,
  defaultLockLifetime: 10 * 60 * 1000, 
});

agenda.on('ready', () => {
  console.log('Agenda ready and connected to MongoDB!');
});

agenda.on('start',
   job => {
  console.log(`Starting job: ${job.attrs.name} for user: ${job.attrs.data.userId}`);
});

agenda.on('complete', job => {
  console.log(`Job completed: ${job.attrs.name}`);
});

agenda.on('fail', (err, job) => {
  console.error(`Job failed: ${job.attrs.name}`, err.message);
});

// Graceful shutdown for GCP
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down Agenda gracefully...');
  await agenda.stop();
  process.exit(0);
});

export { agenda };