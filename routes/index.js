// Hold the routs defining specific locations example {"/auth/", "/stories/", "/user/"} and we will use express router.
const { log } = require('console');
const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');

/**
 * @desc Login/Landing Page
 * @route GET /
 */
router.get('/', ensureGuest, (req, res) => {
  //   res.send("Login");// send to send files and text, for templates or pages we have render("pageURL");
  res.render('login', {
    layout: 'login',
  });
});

/**
 * @desc Dashboard
 * @route GET / Dashboard
 */
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    // const pass =
    //   stories.length === 0
    //     ? 'Sorry, no stories available at the moment.'
    //     : stories;
    res.render('dashboard', {
      name: req.user.displayName,
      stories: stories,
    });
  } catch (err) {
    console.log(err);
    res.render('error/500');
  }
});

module.exports = router;
