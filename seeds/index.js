const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


const cities = require('./cities');
const {places, descriptors, descriptions} = require('./seedHelpers');
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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '66ab1ea8b97150f4415ab33d',
            location: `${cities[random1000].city_code}, ${cities[random1000].region_geojson_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `${sample(descriptions)}`,
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,

                ]
            },
            images: [
                  {
                    url: 'https://res.cloudinary.com/dxeknypze/image/upload/v1722484051/FreshCamp/lfqexbe0bqpfnrmmwie6.jpg',
                    filename: 'FreshCamp/lfqexbe0bqpfnrmmwie6',
                  }
            ]
        })
        console.log(camp);
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

