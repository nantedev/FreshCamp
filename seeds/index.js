const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground'); // attention '..' pour revenir vers le droit chemin.


mongoose.connect('mongodb://localhost:27017/freshcamp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '66ab1ea8b97150f4415ab33d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et tempor ligula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam ullamcorper iaculis quam ut dictum. Nam et quam leo. Suspendisse venenatis elit id feugiat tempor. Suspendisse ipsum neque, vestibulum vitae erat in, fringilla auctor elit. Nulla eget felis ipsum.',
            price: price,
            images: [
                  {
                    url: 'https://res.cloudinary.com/dxeknypze/image/upload/v1722484051/FreshCamp/lfqexbe0bqpfnrmmwie6.jpg',
                    filename: 'FreshCamp/lfqexbe0bqpfnrmmwie6',
                  }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

