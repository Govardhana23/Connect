import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes';
import marketplaceRoutes from './routes/marketplace.routes';
import productRoutes from './routes/product.routes';
import financialRoutes from './routes/financial.routes';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hyper-Local Service Platform API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/marketplace', productRoutes);
app.use('/api/financial', financialRoutes);

// Socket.io Setup
setupSocket(io);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
