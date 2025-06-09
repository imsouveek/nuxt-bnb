export default {
    rootDir: '../', // this points to server/api/
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/jest/setupTestEnv.js'],
    testMatch: [
        '<rootDir>/tests/resources/**/*.test.js',
        '<rootDir>/tests/bootstrap/**/*.test.js'
    ],
    testTimeout: 30000,
    transform: {},
    moduleNameMapper: {},
    collectCoverageFrom: [
        '<rootDir>/resources/**/*.js', // app code
        '<rootDir>/middleware/**/*.js',
        '<rootDir>/strategies/**/*.js',
        '<rootDir>/utils/**/*.js',
        '<rootDir>/bootstrap/**/*.js',
        '!<rootDir>/tests/**',           // exclude all tests
        '!<rootDir>/bootstrap/prisma/generated/**',
        '!<rootDir>/bootstrap/prisma/migrations/**'
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov']
}