import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

await connectDB();

const importData = async () => {
    try {
        // Your custom credentials
        const myCustomEmail = 'priyanshu@ems.com';
        const myCustomPassword = 'supersecret123';

        const userExists = await User.findOne({ email: myCustomEmail });

        if (userExists) {
            console.log(`⚠️ User ${myCustomEmail} already exists in the database!`);
            process.exit();
        }

        // Inject your custom user into the database
        await User.create({
            name: 'Priyanshu (Super Admin)',
            email: myCustomEmail,
            password: myCustomPassword,
            role: 'Admin',
        });

        console.log('✅ Custom admin user injected successfully!');
        console.log(`Email: ${myCustomEmail}`);
        console.log(`Password: ${myCustomPassword}`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error with seed script: ${error.message}`);
        process.exit(1);
    }
};

importData();