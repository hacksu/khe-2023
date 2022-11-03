
import { config } from '@kenthackenough/config';

export default function handler(req, res) {
    console.log('staff config', { config })
    res.send('hi');
}