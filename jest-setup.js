const { execSync } = require('child_process');

module.exports = function() {
  if (process.env.CI !== 'true') {
    console.log(); /** Newline to avoid collision with Jest's output */
    const stdout = execSync(
      'docker-compose -p api_test -f docker-compose.test.yml up -d',
    );
    console.log(stdout.toString('utf-8'));
  }
};
