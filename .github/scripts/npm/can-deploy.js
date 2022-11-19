const { execSync } = require('child_process');
const chalk = require('chalk');

if (execSync('git rev-parse --abbrev-ref HEAD').toString('utf8').trim() === 'project-bugfixes') {
    process.exit(0);
} else {
    console.log(chalk.red(`You can only deploy from the ${chalk.white.underline('main')} branch!`));
    console.log(` - Deployment updates the version of the project so it can publish to NPM`);
    console.log(` - This can only be done on the main branch to avoid merge conflicts`);
    process.exit(1);
}