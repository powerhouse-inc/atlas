import express from 'express';
import createInvoiceRouter from './api/createInvoice';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Allow requests from your React app
    credentials: true
  }));

// Use the invoice router
app.use('/api', createInvoiceRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 