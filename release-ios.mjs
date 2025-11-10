#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;

const CONFIG_FILE_JSON = path.join(projectRoot, 'app.json');
const CONFIG_FILE_TS = path.join(projectRoot, 'app.config.ts');

const args = process.argv.slice(2);

const hasFlag = (flag) => args.includes(flag);

const getArg = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1 || index === args.length - 1) {
    return null;
  }
  return args[index + 1];
};

const printHelp = () => {
  console.log(`Daily Peace iOS release helper\n\n` +
    `Usage: npm run release:ios -- [options]\n\n` +
    `Options:\n` +
    `  --set <value>          Set an explicit build number instead of auto bumping\n` +
    `  --profile <name>       EAS build profile (default: production)\n` +
    `  --submit-profile <name>  EAS submit profile (default: production)\n` +
    `  --skip-build           Skip the build step\n` +
    `  --skip-submit          Skip the submit step\n` +
    `  --dry-run              Preview actions without writing files or running commands\n` +
    `  --help                 Show this help text\n`);
};

const bumpIOSBuildNumber = (buildNumber) => {
  const parts = buildNumber.split('.').map((segment) => {
    const parsed = Number(segment);
    if (Number.isNaN(parsed)) {
      throw new Error(`Cannot bump non-numeric iOS build number segment: ${segment}`);
    }
    return parsed;
  });

  parts[parts.length - 1] += 1;
  return parts.join('.');
};

const inspectConfig = () => {
  if (fs.existsSync(CONFIG_FILE_JSON)) {
    const raw = fs.readFileSync(CONFIG_FILE_JSON, 'utf8');
    const config = JSON.parse(raw);
    const current = config?.expo?.ios?.buildNumber;
    if (!current) {
      throw new Error('Cannot find ios.buildNumber in app.json');
    }

    const writer = (next) => {
      const updated = { ...config, expo: { ...config.expo, ios: { ...config.expo.ios, buildNumber: next } } };
      fs.writeFileSync(CONFIG_FILE_JSON, `${JSON.stringify(updated, null, 2)}\n`);
    };

    return { current, writer };
  }

  if (fs.existsSync(CONFIG_FILE_TS)) {
    const text = fs.readFileSync(CONFIG_FILE_TS, 'utf8');
    const match = text.match(/buildNumber:\s*["']([\d.]+)["']/);

    if (!match) {
      throw new Error('Cannot find ios.buildNumber in app.config.ts');
    }

    const current = match[1];

    const writer = (next) => {
      const updated = text.replace(/buildNumber:\s*["'][\d.]+["']/, `buildNumber: "${next}"`);
      fs.writeFileSync(CONFIG_FILE_TS, updated);
    };

    return { current, writer };
  }

  throw new Error('❌ No app.json or app.config.ts found!');
};

const run = (command, dryRun) => {
  if (dryRun) {
    console.log(`[dry-run] ${command}`);
    return;
  }

  execSync(command, { stdio: 'inherit', cwd: projectRoot, shell: process.platform === 'win32' });
};

if (hasFlag('--help')) {
  printHelp();
  process.exit(0);
}

const dryRun = hasFlag('--dry-run');
const skipBuild = hasFlag('--skip-build');
const skipSubmit = hasFlag('--skip-submit');
const explicitBuild = getArg('--set');
const buildProfile = getArg('--profile') ?? 'production';
const submitProfile = getArg('--submit-profile') ?? 'production';

const { current, writer } = inspectConfig();
const nextBuildNumber = explicitBuild ?? bumpIOSBuildNumber(current);

console.log(`Current iOS buildNumber: ${current}`);
console.log(`Next iOS buildNumber:    ${nextBuildNumber}`);

if (dryRun) {
  console.log('[dry-run] Skipping config write');
} else {
  writer(nextBuildNumber);
  console.log('Updated config with new build number.');
}

if (!skipBuild) {
  console.log(`\n📦 Building iOS release with profile "${buildProfile}"…`);
  run(`eas build -p ios --profile ${buildProfile}`, dryRun);
} else {
  console.log('Skipping build step.');
}

if (!skipSubmit) {
  console.log(`\n🚀 Submitting to App Store Connect with profile "${submitProfile}"…`);
  run(`eas submit -p ios --profile ${submitProfile} --latest`, dryRun);
} else {
  console.log('Skipping submit step.');
}

console.log('\n🎉 Done! iOS release script complete.');






