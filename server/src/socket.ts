import { Server, Socket } from 'socket.io';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join user-specific room for private notifications
        socket.on('join_room', (userId: string) => {
            socket.join(userId);
            console.log(`User ${socket.id} joined room ${userId}`);
        });

        // Booking Updates
        socket.on('booking_update', (data: { bookingId: string; status: string; userId: string; providerId: string }) => {
            // Notify customer and provider
            io.to(data.userId).emit('booking_status_changed', data);
            io.to(data.providerId).emit('booking_status_changed', data);
        });

        // Chat
        socket.on('send_message', (data: { receiverId: string; message: string; senderId: string }) => {
            io.to(data.receiverId).emit('receive_message', data);
        });

        // Location Updates (Real-time tracking)
        socket.on('location_update', (data: { providerId: string; lat: number; lng: number }) => {
            // Broadcast to relevant users (e.g., active bookings) or just general room
            // data.userIds to notify
            if (data.providerId) {
                io.emit(`provider_${data.providerId}_location`, data);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
