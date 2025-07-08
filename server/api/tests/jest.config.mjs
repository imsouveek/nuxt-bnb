export default {
    rootDir: '../', // The config lives in server/tests — so this points to server/tests
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/jest/setupTestEnv.js'],
    testMatch: [
        '<rootDir>/tests/resources/**/*.test.js',
        '<rootDir>/tests/bootstrap/**/*.test.js',
        '<rootDir>/tests/services/**/*.test.js',
    ],
    testTimeout: 60000,
    transform: {},
    moduleNameMapper: {},
    collectCoverageFrom: [
        '<rootDir>/resources/**/*.js', // app code
        '<rootDir>/middleware/**/*.js',
        '<rootDir>/services/**/*.js',
        '<rootDir>/utils/**/*.js',
        '<rootDir>/bootstrap/**/*.js',
        '!<rootDir>/tests/**'           // exclude all tests
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov']
}