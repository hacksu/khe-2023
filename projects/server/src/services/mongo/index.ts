import mongoose from 'mongoose';
import { config } from '../../config';
import { log } from '../../utils/logging';
import chalk from 'chalk';

mongoose.connect(config.mongo).then(() => {
    log.info(`Connected to ${chalk.green('MongoDB')}`, 'with', chalk.grey(config.mongo));
});

