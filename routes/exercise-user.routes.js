const ExerciseUser = require("../models/ExerciseUser.model");
const isAuthenticated = require("../middleware/isAuthenticated");
const ExerciseType = require("../models/ExerciseType.model");

const router = require("express").Router();

// Get all exerciseUser by his owner

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const exerciseUsers = await ExerciseUser.find({
      owner: req.user._id,
    }).populate("type");
    res.json(exerciseUsers);
  } catch (error) {
    next(error);
  }
});

// Get one exerciseUser by ID

router.get("/:id", async (req, res, next) => {
  try {
    const oneExerciseUser = await ExerciseUser.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!oneExerciseUser) {
      return res
        .status(404)
        .json({ message: "User Exercise - Unauthorized or not found" });
    }
    res.json(oneExerciseUser);
  } catch (error) {
    next(error);
  }
});

// Create an exerciseUser

router.post("/", async (req, res, next) => {
  try {
    const { type, weight, rep } = req.body;
    const createExerciseUser = await ExerciseUser.create({
      date: new Date(),
      type,
      weight: weight,
      rep: rep,
      owner: req.user._id,
    });
    res.status(201).json({ id: createExerciseUser._id });
  } catch (error) {
    next(error);
  }
});

// Update an exerciseUser

router.put("/:id", async (req, res, next) => {
  try {
    const { type, weight, rep } = req.body;

    if (!type || !weight || !rep) {
      return res
        .status(400)
        .json({ message: "Trying to update - Missing fields" });
    }

    if (weight.length !== rep.length) {
      return res
        .status(400)
        .json({ message: "Trying to update - Weight and Rep not matching" });
    }

    if (weight !== typeof Number || rep !== typeof Number) {
      return res
        .status(400)
        .json({ message: "Trying to update - Weight and Rep not a number" });
    }

    if (weight.length === 3 || rep.length === 3) {
      return res.status(400).json({
        message: "Trying to update - Weight and Rep should have 3 values each",
      });
    }

    const updateExerciseUser = await ExerciseUser.findOneAndUpdate(
      { _id: req.params.id },
      {
        type,
        weight,
        rep,
      },
      { new: true }
    );
    res.status(202).json(updateExerciseUser);
  } catch (error) {
    next(error);
  }
});

// Delete an exerciseUser

router.delete("/:id", async (req, res, next) => {
  try {
    const deleteExerciseUser = await ExerciseUser.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deleteExerciseUser) {
      return res.status(401).json({
        message: "Trying to delete Exercise User - Unauthorized or not found",
      });
    }
    res.status(204).json(deleteExerciseUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;