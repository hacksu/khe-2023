const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(process.env)
if (execSync('git rev-parse --abbrev-ref HEAD').toString('utf8').trim() === 'main' || process.env.npm_config_argv.original.find(o => o.includes('--force'))) {
    process.exit(0);
} else {
    console.log(chalk.red(`You can only deploy from the ${chalk.white.underline('main')} branch!`));
    console.log(` - Deployment updates the version of the project so it can publish to NPM`);
    console.log(` - This can only be done on the main branch to avoid merge conflicts`);
    process.exit(1);
}