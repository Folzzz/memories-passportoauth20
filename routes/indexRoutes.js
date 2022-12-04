const express = require('express');
const router = express.Router();

const Story = require('../models/story')
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc login/landing page
// @route GET /
// router.get('/', (req, res) => {
//     res.render('home', {
//         title: 'My Memories'
//     });
// })

// @desc Login
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('loginpage', {
        layout: 'login',
        title: 'login'
    });
})

// @desc dashboard
// @route GET /dashboard
router.get('/dashboard',ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ user: req.user.id}).sort({ createdAt: -1 }).lean();

        res.render('dashboard', {
            title: 'My Memories Dashboard',
            name: req.user.firstName,
            stories
        });

    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
})

module.exports = router;