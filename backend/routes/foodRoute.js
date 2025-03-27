import express from 'express';
import {addFood } from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();


// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({storage: storage});

foodRouter.post("/add", upload.single("image"), addFood);

export default foodRouter;

// import express from 'express';
// import {addFood } from '../controllers/foodController.js';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const foodRouter = express.Router();

// // Image Storage Engine
// const storage = multer.diskStorage({
//     destination: path.join(__dirname, '../uploads'),
//     filename: (req, file, cb) => {
//         return cb(null, `${Date.now()}${file.originalname}`);
//     }
// });

// const upload = multer({storage: storage});

// foodRouter.post("/add", upload.single("image"), addFood);

// export default foodRouter;