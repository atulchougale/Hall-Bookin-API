const express = require('express');
const uniqid= require("uniqid");

const router = express.Router();

let rooms = [];
let roomNo = 50;
let bookings = [];
let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
let time_regex = /^(0[0-9]|1\d|2[0-3])\:(00)/;

router.get("/",(req, res)=> {
    res.status(200).send({
      message: "Homepage",
    });
  });

  // Get All Rooms

  router.get("/AllRooms", (req, res)=> {
    if (rooms.length) {
      res.status(200).send({rooms});
 
    } else {
      res.status(200).send({
        message: "No rooms created",
      });
    }
  });

  // Get All Customers list with Booked Data
router.get("/AllBookings",  (req, res)=> {
    if (bookings.length) {
      res.status(200).send({
        bookings
      });
    } else {
      res.status(200).send({
        message: "No bookings available",
      });
    }
  });

  // Get All Rooms list with Booked Data
router.get("/RoomBookings",(req, res)=> {
    if (rooms.length) {
      const roomsList = rooms.map((room) => ({
        roomNo: room.roomNo,
        bookings: room.bookings,
      }));
      res.status(200).send({
        roomsList
      });
    } else {
      res.status(200).send({
        message: "No rooms created",
      });
    }
  });

    // Get All Rooms list with Booked Data
router.get("/cutsmomerBookings",(req, res)=> {
    if (rooms.length) {
      const roomsList = rooms.map((room) => ({
        
        bookings: room.bookings,
      }));
      res.status(200).send({
        roomsList
      });
    } else {
      res.status(200).send({
        message: "No rooms created",
      });
    }
  });

  // Create Room ................
router.post("/createRoom",(req, res)=> {
    let room = {};
    room.id = uniqid();
    room.roomNo = roomNo;
    room.bookings = [];
    let isCorrect = true;
  
    if (req.body.noSeats) {
      if (!Number.isInteger(req.body.noSeats)) {
        res
          .status(400)
          .send({ message: "Enter only integer values for Number of Seats" });
        isCorrect = false;
        return;
      }
    } else {
      res
        .status(400)
        .send({ message: "Please specify No of seats for Room" });
      isCorrect = false;
      return;
    }
    if (req.body.amenities) {
      if (!Array.isArray(req.body.amenities)) {
        res
          .status(400)
          .send({ message: "Amenities list accepts only array of strings" });
        isCorrect = false;
        return;
      }
    } else {
      res.status(400).send({
        message: "Please specify all Amenities for Room in Array format",
      });
      isCorrect = false;
      return;
    }
    if (req.body.pricePerHour) {
      if (isNaN(req.body.pricePerHour)) {
        res
          .status(400)
          .send({ message: "Enter only digits for Price per Hour" });
        isCorrect = false;
        return;
      }
    } else {
      res
        .status(400)
        .send({ message: "Please specify price per hour for Room" });
      isCorrect = false;
      return;
    }
  
    if (isCorrect) {
      room.noSeats = req.body.noSeats;
      room.amenities = req.body.amenities;
      room.pricePerHour = req.body.pricePerHour;
      rooms.push(room);
      roomNo++;
      res.status(200).send({ message: "Room Created Successfully" });
    }
  });

  // Create Bookings.................
router.post("/createBooking",(req, res)=>{
    let isCorrect = true;
    let checkRoom = [];
  
    if (rooms.length) {

        if (!req.body.custName) {
            res.status(400).send({ 
                message: "Please Enter customer Name for booking" 
            });
            isCorrect = false;
            return;
          }

      if (req.body.roomNo) {
        if (Number.isInteger(req.body.roomNo)) {
          checkRoom = rooms.filter((room) => room.roomNo === req.body.roomNo);
          if (!checkRoom.length) {
            res.status(400).send({
              message: `No room available with room ${req.body.roomNo} for booking`,
            });
            return;
          }
        } else {
          res.status(400).send({ 
            message: "Enter only Numbers for Room Number" 
        });
          isCorrect = false;
          return;
        }
      } else {
        res.status(400).send({
          message: `Please Enter a Room Number(field: "roomNo") for booking`,
        });
        isCorrect = false;
        return;
      }
  
      
  
      if (req.body.date) {
        if (!date_regex.test(req.body.date)) {
          res.status(400).send({
             message: "Please Enter date in MM/DD/YYYY" 
            });
          isCorrect = false;
          return;
        }
      } else {
        res.status(400).send({ message: "Please Enter date for booking." });
        isCorrect = false;
        return;
      }
  
      if (req.body.startTime) {
        if (time_regex.test(req.body.startTime)) {
          let dateTime = `${req.body.date.substring(6)}-${req.body.date.substring(0, 2)}-${req.body.date.substring(3,5)}`;
          const currentDateTime = new Date(new Date().toString()).getTime();
          dateTime = new Date(
            new Date(`${dateTime}T${req.body.startTime}`).toString()).getTime();
  
          if (dateTime < currentDateTime) {
            res.status(400).send({
              message:
                "Please Enter a current or future date and time for booking.",
            });
            isCorrect = false;
            return;
          }
        } else {
          res.status(400).send({
            message:
              "Please Enter time in hh:min(24-hr format) where minutes should be 00 only",
          });
          isCorrect = false;
          return;
        }
      } else {
        res
          .status(400)
          .send({ message: "Please Enter Starting time for booking." });
        isCorrect = false;
        return;
      }
  
      if (req.body.endTime) {
        if (time_regex.test(req.body.endTime)) {
          if (
            parseInt(req.body.startTime.substring(0, 2)) >=
            parseInt(req.body.endTime.substring(0, 2))
          ) {
            res.status(400).send({
              message: "End time must be greater than Start time",
            });
            isCorrect = false;
            return;
          }
        } else {
          res.status(400).send({
            message:
              "Please Enter time in hh:min(24-hr format) where minutes should be 00 only",
          });
          isCorrect = false;
          return;
        }
      } else {
        res
          .status(400)
          .send({ message: "Please Enter Ending time for booking." });
        isCorrect = false;
        return;
      }
  
      let isAvailable = false;
      if (checkRoom[0].bookings.length) {
        const sameDateBookings = checkRoom[0].bookings.filter(
          (book) => book.date === req.body.date && book.bookingStatus === true
        );
  
        if (sameDateBookings.length) {
          let isTimeAvailable = true;
  
          sameDateBookings.map((book) => {
            if (
              !(
                (parseInt(book.startTime.substring(0, 2)) >
                  parseInt(req.body.startTime.substring(0, 2)) &&
                  parseInt(book.startTime.substring(0, 2)) >=
                    parseInt(req.body.endTime.substring(0, 2))) ||
                (parseInt(book.endTime.substring(0, 2)) <=
                  parseInt(req.body.startTime.substring(0, 2)) &&
                  parseInt(book.endTime.substring(0, 2)) <
                    parseInt(req.body.endTime.substring(0, 2)))
              )
            ) {
              isTimeAvailable = false;
            }
          });
  
          if (isTimeAvailable) {
            isAvailable = true;
          }
        } else {
          isAvailable = true;
        }
      } else {
        isAvailable = true;
      }
  
      if (!isAvailable) {
        res.status(400).send({
          message: `Room ${req.body.roomNo} is not available on Selected Date and Time`,
        });
        return;
      } else {
        if (isCorrect) {
          let count = 0;
          rooms.forEach((element) => {
            if (element.roomNo === req.body.roomNo) {
              rooms[count].bookings.push({
                id: uniqid(),
                customerName: req.body.custName,
                bookingStatus: true,
                date: req.body.date,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
              });
            }
            count++;
          });
  
          let bookingRec = req.body;
          bookingRec.cost =
            checkRoom[0].pricePerHour *
            (parseInt(bookingRec.endTime.substring(0, 2)) -
              parseInt(bookingRec.startTime.substring(0, 2)));
  
          bookings.push(bookingRec);
          res.status(200).send({ message: "Room Booking Successfully" });
        } else {
          res.status(400).send({ message: "Error in entered data" });
          return;
        }
      }
    } else {
      res.status(400).send({ message: "No rooms created for booking" });
      return;
    }
  });







module.exports = router;