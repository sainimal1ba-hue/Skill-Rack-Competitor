/**
 * Verdict calculator for test cases
 * Compares output vs expected, supports trimming and numeric leniency.
 */
export function getVerdict(output, expectedOutput) {
  // Accepts: output and expectedOutput as strings
  function normalize(s) {
    return s.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }
  if (normalize(output) === normalize(expectedOutput)) return "Accepted";
  // For small numbers, tolerate whitespace issues
  if (
    normalize(output).replace(/\s+/g, '') === normalize(expectedOutput).replace(/\s+/g, '')
  ) return "Presentation Error";
  return "Wrong Answer";
}