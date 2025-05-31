// This script will run the ftso code using ts-node with proper configuration
const { execSync } = require('child_process');

try {
  // Run the TypeScript file directly with ts-node and the proper flags
  execSync(
    'npx ts-node --skipProject --transpileOnly --compilerOptions \'{"module":"commonjs","jsx":"react"}\' utils/ftso.tsx',
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('Error executing the script:', error.message);
}
