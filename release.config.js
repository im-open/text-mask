const {execSync} = require('child_process')
const MAIN_BRANCH = 'main'

const packageName = process.env.PACKAGE_NAME
const tagFormat = packageName ?
  `${packageName}-v\${version}` :
  'all-v${version}'
const pkgRoot = packageName || '.'
const packageSubjectName = packageName || 'all'
const packagePackageJson = require(`./${pkgRoot}/package.json`)
const packageNpmName = packagePackageJson.name

const branchName = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .replace('\n', '')

const branchSha = execSync('git rev-parse --short HEAD')
  .toString()
  .replace('\n', '')

const isMainBranch = branchName === MAIN_BRANCH
const extraGithubConfig = isMainBranch ?
  {} :
  {
    successComment: `
This PR is part of this prerelease version on \`${packageNpmName}\` for testing: \${nextRelease.version}
You can test it by using:
\`\`\`bash
npm install ${packageNpmName}@${branchName}
\`\`\`
`,
  }

const extraPlugins = isMainBranch ?
  [
    [
      '@semantic-release/git',
      {
        message: `docs(${packageSubjectName}): \${nextRelease.version} [skip ci]\n\n\${nextRelease.note}`,
      },
    ],
  ] :
  []

module.exports = {
  repositoryUrl: 'git@github.com:im-open/text-mask.git',
  tagFormat,
  branches: [
    'main',
    {
      name: '*',
      prerelease: `\${name}-${branchSha}`,
      channel: '${name}',
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        pkgRoot,
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: ['../*.tgz', '../**/*.tgz'],
        ...extraGithubConfig,
      },
    ],
    ...extraPlugins,
  ],
}
