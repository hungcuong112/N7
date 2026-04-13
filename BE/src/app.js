const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ==== Register routes ====
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const patientRoutes = require('./routes/patient');
app.use('/api/patients', patientRoutes);

const doctorRoutes = require('./routes/doctors');
app.use('/api/doctors', doctorRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const appointmentRoutes = require('./routes/appointment');
app.use('/api/appointments', appointmentRoutes);

const specialtyRoutes = require('./routes/specialty');
app.use('/api/specialties', specialtyRoutes);

const serviceRoutes = require('./routes/service');
app.use('/api/services', serviceRoutes);

const scheduleRoutes = require('./routes/schedule');
app.use('/api/schedules', scheduleRoutes);

const doctorServiceRoutes = require('./routes/doctorService');
app.use('/api/doctor-services', doctorServiceRoutes);

const medicalRoutes = require('./routes/medical');
app.use('/api/medical', medicalRoutes);

const ratingRoutes = require('./routes/rating');
app.use('/api/ratings', ratingRoutes);

const statisticsRoutes = require('./routes/statistics');
app.use('/api/statistics', statisticsRoutes);

const notificationRoutes = require('./routes/notification');
app.use('/api/notifications', notificationRoutes);

const messageRoutes = require('./routes/message');
app.use('/api/messages', messageRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);

const shiftRoutes = require('./routes/shifts');
app.use('/api/shifts', shiftRoutes);

const availableSchedulesRoutes = require('./routes/availableSchedules');
app.use('/api/available-schedules', availableSchedulesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

// ==== Kết nối & sync DB ====
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected!');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('❌ Model synchronization error:', err);
  });

// ==== Start server ====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const reportRoutes = require('./routes/report');
app.use('/api/admin/reports', reportRoutes);
