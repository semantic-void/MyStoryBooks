// Hold the routs defining specific locations example {"/auth/", "/stories/", "/user/"} and we will use express router.
const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @desc Auth with google
 * @route GET /auth/google
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
); //'email is not accepted in oauth20s'

/**
 * @desc  Google auth callback
 * @route GET /auth/google/callback
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

/**
 * @desc    Logout User
 * @route   /auth/logout
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log('Error logging out:', err);
      res.status(500).send('Error logging out');
    } else {
      req.session.destroy((err) => {
        if (err) {
          console.log('Error destroying session while logging out:', err);
          res.status(500).send('Error destroying session while logging out');
        } else {
          res.redirect('/');
        }
      });
    }
  });
});

module.exports = router;
