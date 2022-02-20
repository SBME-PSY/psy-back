const express = require('express');
const { advancedResults, authorize } = require('../middleware');
const { slotController } = require('../controllers');

const { authFun } = require('../utils');

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .post(authFun.protect, authorize.authorize('doctor'), slotController.addSlot)
  .get(
    authFun.protect,
    authorize.authorize('doctor'),
    slotController.getClinicSlots
  );

router
  .route('/:slotId')
  .patch(
    authFun.protect,
    authorize.authorize('doctor'),
    advancedResults.filterBody('from', 'to', 'reserved'),
    slotController.updateSlot
  );
module.exports = router;
