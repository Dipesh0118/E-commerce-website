// orderSeed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/OrderModel.js';

dotenv.config();

// Dummy order data
const dummyOrders = [
  {
    user: new mongoose.Types.ObjectId(), // Replace with real user id if needed
    orderItems: [
      {
        name: 'Anker PowerCore 20000mAh',
        qty: 3,
        image: 'https://rukminim2.flixcart.com/image/832/832/jb890nk0/power-bank/a/k/g/anker-powercore-20100-original-imaexhh6ryhyywfs.jpeg',
        price: 3999,
        product: new mongoose.Types.ObjectId('6806816e0dd18a1577fc1360')
      },
      {
        name: 'Apple AirPods Pro (2nd Gen)',
        qty: 4,
        image: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1699959404/Croma%20Assets/Communication/Headphones%20and%20Earphones/Images/300850_0_dzlhio.png',
        price: 24900,
        product: new mongoose.Types.ObjectId('6806816e0dd18a1577fc1361')
      }
    ],
    shippingAddress: {
      address: '123 Main Street',
      city: 'Kathmandu',
      postalCode: '44600',
      country: 'Nepal'
    },
    taxPrice: 2889.9,
    shippingPrice: 500,
    totalPrice: (3 * 3999 + 4 * 24900) + 2889.9 + 500, // items total + tax + shipping
    isDelivered: false
  }
];

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected');

    await Order.deleteMany({});
    console.log('Existing orders deleted');

    await Order.insertMany(dummyOrders);
    console.log('Dummy orders inserted successfully!');

    process.exit();
  } catch (err) {
    console.error('Error seeding orders:', err);
    process.exit(1);
  }
};

seedOrders();
