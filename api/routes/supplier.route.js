import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createsupplier, getsuppliers, deletesupplier, updatesupplier } from '../controllers/supplier.controller.js';


const router = express.Router();

router.post('/createsupplier', verifyToken, createsupplier)
router.get('/getsuppliers', getsuppliers)
router.delete('/deletesupplier/:supplierId/:userId', verifyToken, deletesupplier)
router.put('/updatesupplier/:supplierId/:userId', verifyToken, updatesupplier)


export default router;