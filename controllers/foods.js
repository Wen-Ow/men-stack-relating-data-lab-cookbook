const express = require("express");
const router = express.Router();

const User = require("../models/user.js");

// Index
router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("foods/index.ejs", { pantry: currentUser.pantry });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// New
router.get("/new", async (req, res) => {
  res.render("foods/new.ejs");
});

// Create
router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.pantry.push(req.body);
    await currentUser.save();
    // Redirect back to the user's pantry
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Edit
router.get("/:itemId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const pantryItem = currentUser.pantry.id(req.params.itemId);
    res.render(`foods/edit.ejs`, { pantry: pantryItem });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Update
router.put("/:itemId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const pantryItem = currentUser.pantry.id(req.params.itemId);
    pantryItem.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Delete
router.delete("/:itemId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.pantry.id(req.params.itemId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the index view
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
