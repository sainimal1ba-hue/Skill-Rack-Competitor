/**
 * Run a set of test cases on given code and language via backend
 */
import { runCode } from './runC';
import { getVerdict } from './verdictEngine';

export async function testCasesRunner({ code, language, testCases, timeLimit = 2000 }) {
  const results = [];
  const TIME_LIMIT = timeLimit;

  for (let i = 0; i < testCases.length; i++) {
    const { input, expectedOutput } = testCases[i];

    // Create a timeout promise
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ error: "Time Limit Exceeded", status: "Time Limit Exceeded", time: `>${TIME_LIMIT}ms` }), TIME_LIMIT);
    });

    // Race the execution against the timeout
    const raceResult = await Promise.race([
      runCode({ code, input, language }),
      timeoutPromise
    ]);

    let runResult = raceResult;

    if (runResult.status === "Time Limit Exceeded") {
      results.push({
        status: "Time Limit Exceeded",
        error: "Execution timed out",
        output: "",
        stderr: "",
        time: `>${TIME_LIMIT}ms`
      });
      continue;
    }

    if (runResult.error) {
      results.push({
        status: "Error",
        error: runResult.error,
        output: runResult.stdout || "",
        stderr: runResult.stderr || "",
        time: runResult.time
      });
    } else {
      const verdict = getVerdict(runResult.stdout, expectedOutput);
      results.push({
        status: verdict,
        output: runResult.stdout,
        stderr: runResult.stderr,
        time: runResult.time
      });
    }
  }
  return results;
}
