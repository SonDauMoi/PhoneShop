require('dotenv').config();
const argon2 = require('argon2');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const UserGroup = require('./models/UserGroup');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		await checkUserGroup();
		console.log('Đã kết nối với MongoDB!');
	} catch (error) {
		console.error('Không thể kết nối với MongoDB!', error.message);
		process.exit(1); // Thoát nếu không kết nối được
	}
};

// Kiểm tra và tạo dữ liệu mặc định
const checkUserGroup = async () => {
	try {
		// Kiểm tra và tạo nhóm CUSTOMER
		let group = await UserGroup.findOne({ name: 'CUSTOMER' });
		if (!group) {
			const customerGroup = new UserGroup({ name: 'CUSTOMER' });
			await customerGroup.save();
		}

		// Kiểm tra và tạo nhóm ADMIN
		group = await UserGroup.findOne({ name: 'ADMIN' });
		if (!group) {
			const adminGroup = new UserGroup({ name: 'ADMIN' });
			await adminGroup.save();
		}

		// Kiểm tra và tạo tài khoản admin
		const user = await User.findOne({ username: 'admin' });
		if (!user) {
			const hashedPassword = await argon2.hash('12345678');
			const adminGroupId = (await UserGroup.findOne({ name: 'ADMIN' }))._id;

			const adminUser = new User({
				username: 'admin',
				password: hashedPassword,
				userGroup: adminGroupId.toString(),
				name: 'Admin',
				gender: 'Nam',
				dateOfBirth: new Date('1998-11-21'),
				address: 'TDM, Bình Dương',
				phone: '0385968197',
				email: 'admin@gmail.com',
				status: true,
			});

			await adminUser.save();
		}
	} catch (error) {
		console.error('Lỗi kiểm tra nhóm tài khoản:', error.message);
	}
};

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');
const categoryRouter = require('./routes/category');
const phoneRouter = require('./routes/phone');
const orderRouter = require('./routes/order');
const discountRouter = require('./routes/discount');
const feedbackRouter = require('./routes/feedback');
const bannerRouter = require('./routes/banner');

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/phones', phoneRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/orders', orderRouter);
app.use('/api/discounts', discountRouter);
app.use('/api/feedbacks', feedbackRouter);
app.use('/api/banners', bannerRouter);

// Lắng nghe kết nối
app.listen(PORT, () => console.log(`Server đang chạy tại cổng ${PORT}!`));
