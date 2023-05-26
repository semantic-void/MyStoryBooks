// Hold the routs defining specific locations example {"/auth/", "/stories/", "/user/"} and we will use express router.
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

/**
 * @desc  Show add page
 * @route GET /stories/add
 */
router.get('/add', ensureAuth, (req, res, next) => {
  res.render('stories/add');
});

/**
 * @desc  Process add form
 * @route Post/stories
 */
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.log(err);
    return res.render('error/500');
  }
});

/**
 * @desc  Show all stories
 * @route GET /stories
 */
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', { stories });
  } catch (err) {
    console.log(err);
    return rs.render('error/500');
  }
});

/**
 * @desc  Show all stories
 * @route GET /stories/edit/:id
 */
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render('/error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story,
      });
    }
  } catch (err) {
    console.log(err);
    res.render('error/500');
  }
});

/**
 * @desc  Update story
 * @route PUT /stories/:id
 */
router.put('/:id', async (req, res) => {
  // await is importatnt to stop te code until this is found, we do this to halt async.
  // without awit story will have a function only with story id in req params or it will be undefined.
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.log(err);
    res.render('error/500');
  }
});

/**
 * @desc  Delete story
 * @route Delete /stories/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }
    if (story.user != req.user.id) {
      res.redirect('/dashboard');
    } else {
      story = await Story.findByIdAndDelete(req.params.id);
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.log(err);
    return res.render('error/500');
  }
});

/**
 * @desc  Show single story
 * @route Get /stories/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('user').lean();
    console.log(story);
    if (!story) {
      return res.render('error/404');
    }
    res.render('stories/show', { story });
  } catch (err) {
    console.log(err);
    // more it can't find it then an error.
    res.render('error/404');
  }
});

/**
 * @desc  User stories
 * @route GET /stories/user/:userId
 */
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('stories/index', { stories });
  } catch (err) {}
});

module.exports = router;
