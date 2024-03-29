# Prime Numbers Recruitment Task

Code is written in TypeScript using ESM. Base implementation was fixed, improved and splitted on smaller parts following single responsibility principle (SRP).

## Prepare

Run **npm i** to install required dependencies.

## Development

Run **npm run dev** to start app using ts-node (runs MUCH slower than compiled version).

## Run

Run **npm run build** and **npm start**. **npm start** should be used for production app usage.

## Test

Vitest is used as tests framework. Unit and E2E tests should be separated, but for simplicity of code reviewing they are in same file.
Run using command **npm test**. Final test runs as slow as development version of app, because Vitests is also working from uncompiled files.

## Info

### Errors in task requirements

I found 2 errors in the task:

1. the implementation of the function "generatePrimes" takes "range" as the second argument, while it is used with a value named "end". In fact, we should pass "end - start" in place of "end".
2. In the implementation of "generatePrimes", the comparison of "i < end" makes it impossible to handle the value of "end", which makes it impossible to get the correct result in case "end" is a prime number.
