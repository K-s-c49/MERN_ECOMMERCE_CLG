import express from 'express';
import { verifyUserAuth } from '../middleware/userAuth.js';
import { processpayment, sendAPIKey, verifyPayment } from '../controller/paymentController.js';
const router = express.Router();

router.route('/payment/process').post(verifyUserAuth, processpayment); 
router.route('/getKey').get(verifyUserAuth, sendAPIKey);
router.route('/payment/verify').post(verifyUserAuth, verifyPayment);

export default router;