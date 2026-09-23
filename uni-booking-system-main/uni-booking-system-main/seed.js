// seed.js
const sequelize = require('./config/db');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');

const seedDatabase = async () => {
  try {
    console.log('🔄 Syncing database tables...');
    // Force sync drops existing tables and recreates them clean
    await sequelize.sync({ force: true });

    console.log('🌱 Seeding Users...');
    const users = await User.bulkCreate([
      {
        name: 'Mustaqim Admin',
        email: 'admin@university.edu',
        password: 'password123', // In production, hash with bcrypt
        role: 'ADMIN',
        department: 'IT & Facilities Management'
      },
      {
        name: 'Dr. Sarah Ahmad',
        email: 'sarah.ahmad@university.edu',
        password: 'password123',
        role: 'STAFF',
        department: 'Computer Science'
      },
      {
        name: 'Alex Tan',
        email: 'alextan@student.university.edu',
        password: 'password123',
        role: 'STUDENT',
        department: 'Design & Technology'
      }
    ]);

    console.log('🌱 Seeding Resources...');
    const resources = await Resource.bulkCreate([
      // 1. Study Pods & Rooms
      {
        name: 'Acoustic Study Pod A',
        category: 'FACILITY',
        location: 'Main Library, Level 2',
        capacity: 2,
        requiresApproval: false,
        isActive: true
      },
      {
        name: 'Collaborative Study Pod B',
        category: 'FACILITY',
        location: 'Main Library, Level 2',
        capacity: 4,
        requiresApproval: false,
        isActive: true
      },
      {
        name: 'Computer Science Lab 3B',
        category: 'FACILITY',
        location: 'Block C, Room 204',
        capacity: 35,
        requiresApproval: true,
        isActive: true
      },
      {
        name: 'Grand Lecture Theatre 1',
        category: 'FACILITY',
        location: 'Academic Block A',
        capacity: 200,
        requiresApproval: true,
        isActive: true
      },

      // 2. Media & Hardware Equipment
      {
        name: 'Canon EOS R6 DSLR Kit (Kit #1)',
        category: 'EQUIPMENT',
        location: 'Media Studio Store, Block D',
        capacity: 1,
        requiresApproval: true,
        isActive: true
      },
      {
        name: 'Sony FX3 Cinema Camera Package',
        category: 'EQUIPMENT',
        location: 'Media Studio Store, Block D',
        capacity: 1,
        requiresApproval: true,
        isActive: true
      },
      {
        name: 'Podcast Audio Kit (Røde Caster Pro + 4 Mics)',
        category: 'EQUIPMENT',
        location: 'Digital Media Lab',
        capacity: 1,
        requiresApproval: false,
        isActive: true
      },
      {
        name: 'Meta Quest 3 VR Headset (Set A)',
        category: 'EQUIPMENT',
        location: 'AR/VR Innovation Lab',
        capacity: 1,
        requiresApproval: false,
        isActive: true
      },

      // 3. Vehicles
      {
        name: 'Departmental Shuttle Van (12 Seater)',
        category: 'VEHICLE',
        location: 'Transport Bay A',
        capacity: 12,
        requiresApproval: true,
        isActive: true
      }
    ]);

    console.log('🌱 Seeding Initial Sample Bookings...');
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startTime = new Date(tomorrow.setHours(10, 0, 0, 0));
    const endTime = new Date(tomorrow.setHours(12, 0, 0, 0));

    await Booking.create({
      userId: users[2].id, // Alex Tan (Student)
      resourceId: resources[0].id, // Acoustic Study Pod A
      startTime,
      endTime,
      status: 'APPROVED',
      purpose: 'Preparation for Final Year Project presentation'
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();