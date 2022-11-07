import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.connect(config.mongo).then(() => {
    console.log(`connected to ${config.mongo}`);
});

