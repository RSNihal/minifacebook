const router = require("express").Router();

const Hostel = require("../models/Hostel");

//CREATE POST
router.post("/", async (req, res) => {
  const newHostel = new Hostel(req.body);
  
  try {
    const savedHostel = await newHostel.save();
    
    res.status(200).json(savedHostel);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (hostel.username === req.body.username) {
      try {
        const updatedHostel = await Hostel.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedHostel);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (hostel.username === req.body.username) {
      try {
        await hostel.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    res.status(200).json(hostel);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let hostels;
    if (username) {
      hostels = await Hostel.find({ username });
    } else if (catName) {
      hostels = await Hostel.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      hostels = await Hostel.find();
    }
    res.status(200).json(hostels);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;