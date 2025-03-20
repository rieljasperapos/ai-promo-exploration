module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    // Add any path mappings if you're using path aliases in tsconfig
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Configure transformIgnorePatterns if you need to transform specific node_modules
  transformIgnorePatterns: [
    '/node_modules/(?!algoliasearch)/'
  ]
};
