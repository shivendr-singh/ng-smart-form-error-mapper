module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterFramework: ['<rootDir>/setup-jest.ts'],
  testPathPattern: 'projects/.*\\.spec\\.ts$',
  collectCoverageFrom: [
    'projects/ng-smart-form-error-mapper/src/**/*.ts',
    '!projects/**/*.spec.ts',
    '!projects/**/public-api.ts'
  ],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  moduleNameMapper: {
    'ng-smart-form-error-mapper': '<rootDir>/dist/ng-smart-form-error-mapper'
  }
};
