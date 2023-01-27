const { execSync } = require('child_process');

module.exports = function () {
  if (process.env.CI !== 'true') {
    const stdout = execSync(
      'docker-compose -p api_test -f docker-compose.test.yml down',
    );
    console.log(stdout.toString('utf-8'));
  }
};
