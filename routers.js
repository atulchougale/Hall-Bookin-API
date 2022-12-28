const express = require('express');
const uniqid= require("uniqid");

const router = express.Router();

let rooms = [];
let roomNo = 100;
let bookings = [];
let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
let time_regex = /^(0[0-9]|1\d|2[0-3])\:(00)/;

router.get("/", function (req, res) {
    res.status(200).send({
      output: "Homepage",
    });
  });

  router.get("/AllRooms", function (req, res) {
    if (rooms.length) {
      res.status(200).send({
        output: rooms,
      });
    } else {
      res.status(200).send({
        message: "No rooms created",
      });
    }
  });









module.exports = router;