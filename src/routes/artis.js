import { artis } from "../controllers/artis";
import express from 'express';
import { authenticateToken } from '../middleware/authToken.js';
const router = express.Router();

router.post('/createArtis', artis.createArtis);
router.get('/getAllArtis', artis.getAllArtis);
router.get('/getSpecificArtis/:id', artis.getSpecificArtis);
router.put('/updateArtis/:id', artis.updateArtis);
router.delete('/deleteArtis/:id', artis.deleteArtis);

export default router;