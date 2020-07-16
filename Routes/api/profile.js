const express = require('express');
const router = express.Router();

//@route   GET api/proile
//@desc    Test Route
//@access  public
router.get("/", (req,res) => {
    res.send('Proile route');
});

module.exports = router; 