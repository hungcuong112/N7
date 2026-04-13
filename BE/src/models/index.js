const User = require('./User');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const Specialty = require('./Specialty');
const Doctor = require('./Doctor');
const Service = require('./Service');
const Schedule = require('./Schedule');
const DoctorService = require('./DoctorService');
const MedicalRecord = require('./MedicalRecord');
const Prescription = require('./Prescription');
const PrescriptionItem = require('./PrescriptionItem');
const MedicalLog = require('./MedicalLog');
const Rating = require('./Rating');
const NotificationLog = require('./NotificationLog');
const Message = require('./Message');
const Payment = require('./Payment');
const Shift = require('./Shift');

Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Patient, { foreignKey: 'userId', as: 'patient' });

User.hasOne(Doctor, { foreignKey: 'userId', as: 'profile' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Doctor.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' });
Specialty.hasMany(Doctor, { foreignKey: 'specialtyId', as: 'doctors' });

Schedule.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Doctor.hasMany(Schedule, { foreignKey: 'doctorId', as: 'schedules' });

Schedule.belongsTo(Shift, { foreignKey: 'shiftId', as: 'shift' });
Shift.hasMany(Schedule, { foreignKey: 'shiftId', as: 'schedules' });

module.exports = { User, Appointment, Specialty, Doctor, Service, Schedule, DoctorService, MedicalRecord, 
                   Prescription, PrescriptionItem, MedicalLog, Rating, NotificationLog, Message, Payment, Patient, Shift };
