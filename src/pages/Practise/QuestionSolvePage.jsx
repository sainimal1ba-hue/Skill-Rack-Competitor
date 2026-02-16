import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../../components/editor/CodeEditor";
import { testCasesRunner } from "../../utils/codeRunner/testCaseRunner";
import { questionService } from "../../services/questionService";
import { submissionService } from "../../services/submissionService";
import { useUser } from "../../context/userStore.jsx";
import { CheckCircle, AlertTriangle, FastForward, Play, AlertCircle, Clock, Activity, Code } from 'lucide-react';
import AiTeacher from "../../components/ai-teacher/AiTeacher";

export default function QuestionSolvePage() {
  const { questionId } = useParams();
  const { user } = useUser();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("c");
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // AI Teacher State
  const [aiState, setAiState] = useState({
    emotion: 'neutral',
    message: "I'm watching you. Don't mess up. 👁️",
    isTalking: false,
    position: 'corner' // corner | editor | results
  });

  useEffect(() => {
    setIsLoading(true);
    questionService.getById(questionId)
      .then(data => {
        setQuestion(data);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [questionId]);

  const [runOutput, setRunOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  async function handleRun() {
    setIsRunning(true);
    setRunOutput(null);
    setResults([]); // Clear submit results if any
    setAiState({
      emotion: 'thinking',
      message: "Running your code against sample input... 🏃‍♂️",
      isTalking: true,
      position: 'corner'
    });

    // Reset talking state and position after a few seconds
    setTimeout(() => {
      setAiState(prev => ({ ...prev, isTalking: false, position: 'corner' }));
    }, 4000);

    // Use sample input or default
    const input = question.sample_input || question.sampleInput || "";

    try {
      const runResults = await testCasesRunner({
        code,
        language,
        testCases: [{ input, expectedOutput: "" }], // We don't care about expected output for Run
        timeLimit: question.time_limit || 2000
      });

      const result = runResults[0];
      setRunOutput({
        stdout: result.output || "",
        stderr: result.stderr || result.error || "",
        status: result.status === 'Error' ? 'Error' : 'Success',
        time: result.time
      });
    } catch (e) {
      setRunOutput({
        stdout: "",
        stderr: "Execution failed to start: " + e.message,
        status: 'Error'
      });
    } finally {
      setIsRunning(false);
      // Give feedback on the run using LOCAL variables, not state
      const outputToCheck = (runResults && runResults[0]) ? runResults[0].output : "";

      if (outputToCheck) {
        setAiState({
          emotion: 'neutral', // Keep neutral for simple run, or make it sassy?
          message: `Execution complete. Output: "${outputToCheck.substring(0, 15)}...". Check if this matches sample output!`,
          isTalking: true,
          position: 'corner'
        });
      } else {
        setAiState({
          emotion: 'angry', // Make it angry for empty output
          message: `Execution complete. No output produced. Did you forget to print? 😡`,
          isTalking: true,
          position: 'corner'
        });
      }
      setTimeout(() => setAiState(prev => ({ ...prev, isTalking: false, position: 'corner' })), 4000);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setRunOutput(null); // Clear run output
    setResults([]);
    setAiState({
      emotion: 'thinking',
      message: "Judging your code... 🧐",
      isTalking: true,
      position: 'corner'
    });

    // Fallback if testCases not present in DB (using sample)
    const testCasesToRun = question.testCases || [
      { input: question.sample_input || question.sampleInput, expectedOutput: question.sample_output || question.sampleOutput }
    ];

    const tcResults = await testCasesRunner({
      code,
      language,
      testCases: testCasesToRun,
      timeLimit: question.time_limit || 2000
    });
    setResults(tcResults);

    // Save submission
    const verdict = tcResults.every(r => r.status === 'Accepted') ? 'Accepted' : 'Wrong Answer';

    // AI Reaction Logic
    const sarcasticMessages = [
      "My grandma codes faster than this.",
      "Are you trying to break the compiler?",
      "I've seen better code in a fortune cookie.",
      "Is this your first day?",
      "Please tell me you're joking with this code.",
      "I'm not mad, just disappointed. Okay, maybe a little mad.",
      "404: Logic not found."
    ];

    const helpfulMessages = [
      "Check your loop conditions carefully.",
      "Maybe print some debug values?",
      "Don't forget to handle edge cases!",
      "Read the error message, it's there for a reason.",
      "Did you initialize your variables correctly?",
      "Take a deep breath and trace your code step-by-step."
    ];

    if (verdict === 'Accepted') {
      setAiState({
        emotion: 'happy',
        message: "Finally! I was about to fall asleep. 😒 (Good job though)",
        isTalking: true,
        position: 'corner'
      });
    } else {
      const errors = tcResults.filter(r => r.error);
      const isSarcastic = Math.random() > 0.4; // 60% Sarcastic, 40% Helpful

      if (errors.length > 0) {
        // Syntax/Runtime Error
        const errorMsg = errors[0].error.split('\n')[0].substring(0, 50);
        // Force Sarcasm: Always true
        setAiState({
          emotion: 'angry',
          message: `Syntax Error? seriously? "${errorMsg}..." Fix it! 😤`,
          isTalking: true,
          position: 'corner'
        });
      } else {
        // Wrong Answer
        const failedCaseIndex = tcResults.findIndex(r => r.status !== 'Accepted');
        const failedResult = tcResults[failedCaseIndex];
        const failedInput = question.testCases?.[failedCaseIndex]?.input || question.sample_input; // Fallback

        // Use LOCAL variable for output check
        const userOut = failedResult.output ? failedResult.output.trim() : "";

        let feedbackMessage = `Wrong Answer on Case ${failedCaseIndex + 1}. ${sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)]}`;

        // Smarter Feedback: Check if output is totally different
        // IMPORTANT: Check userOut (local const), NOT failedResult.output (which might be safe but let's be consistent)

        if (userOut.toLowerCase().includes("superb")) {
          feedbackMessage = `You printed "superb"? The question asks for a number. Stop printing random words! 🤦‍♂️`;
        } else if (isNaN(userOut) && !isNaN(failedInput)) {
          feedbackMessage = `I expected a number, but you gave me text: "${userOut.substring(0, 10)}...". Logic error! 📉`;
        } else if (userOut === "") {
          feedbackMessage = `You printed NOTHING. Literally nothing. Use 'print' or 'printf'! 🌑`;
        } else {
          feedbackMessage = `Your output "${userOut.substring(0, 10)}" is wrong for input "${failedInput}". Check the math! 🧮`;
        }

        // Force Sarcasm: Always true
        setAiState({
          emotion: 'sad', // Disappointed
          message: `${feedbackMessage} 🙄`,
          isTalking: true,
          position: 'corner'
        });
      }
    }

    // Reset talking state after a few seconds
    setTimeout(() => {
      setAiState(prev => ({ ...prev, isTalking: false, position: 'corner' }));
    }, 6000);

    try {
      await submissionService.add({
        userId: user.id,
        questionId: question.id,
        code,
        language,
        verdict
      });

      // Update Question Stats (Fire and forget)
      questionService.incrementStats(question.id, verdict === 'Accepted');

    } catch (e) {
      console.error("Submission save failed", e);
    }

    setSubmitting(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">Question Not Found</h2>
        <p className="text-slate-400 mt-2">The question you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto my-6 gap-6 px-4 animate-fade-in h-[calc(100vh-100px)]">
      {/* Question Description Panel */}
      <div className="lg:w-1/3 flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <h1 className="text-2xl font-bold text-white mb-4 leading-tight">
            {question.title}
          </h1>

          <div className="flex gap-2 mb-6">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              {question.complexity || 'Medium'}
            </span>
          </div>

          <div className="prose prose-invert prose-sm mb-8 text-slate-300 font-light leading-relaxed max-w-none">
            {question.description}
          </div>

          <div className="space-y-6">
            {(question.sample_input || question.sampleInput) && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Play className="w-3 h-3" /> Sample Input
                </span>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                  {question.sample_input || question.sampleInput}
                </div>
              </div>
            )}

            {(question.sample_output || question.sampleOutput) && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" /> Sample Output
                </span>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                  {question.sample_output || question.sampleOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Editor Panel */}
      <div className="lg:w-2/3 flex flex-col gap-4 h-full">
        <div className="flex-1 glass-panel p-1 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
          <CodeEditor
            initialInput={question.sample_input || question.sampleInput || ""}
            initialLanguage={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            theme="vs-dark"
          />
        </div>

        <div className="flex justify-between items-center bg-slate-800/80 backdrop-blur p-4 rounded-xl border border-slate-700/50 shadow-lg">
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>Use standard input/output (stdin/stdout)</span>
          </div>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2 border border-slate-600 ${isRunning || submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isRunning || submitting}
              onClick={handleRun}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Running...</span>
                </>
              ) : (
                <> <Play className="w-4 h-4" /> Run Code </>
              )}
            </button>
            <button
              className={`btn-antigravity px-6 py-2.5 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 ${submitting || isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={submitting || isRunning}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Running...</span>
                </>
              ) : (
                <> <FastForward className="w-4 h-4" /> Submit Solution </>
              )}
            </button>
          </div>
        </div>

        {/* Console Output Panel (Run) */}
        {runOutput && (
          <div className="glass-panel p-6 rounded-xl animate-scale-in">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
              <Code className="w-5 h-5 text-indigo-400" /> Console Output
            </h3>

            {runOutput.stderr && (
              <div className="mb-4">
                <p className="text-red-400 text-xs font-bold mb-1 uppercase">Error / Stderr:</p>
                <pre className="bg-slate-950/50 text-red-300 p-3 rounded-lg font-mono text-sm border border-red-500/20 whitespace-pre-wrap">
                  {runOutput.stderr}
                </pre>
              </div>
            )}

            <div>
              <p className="text-slate-400 text-xs font-bold mb-1 uppercase">Standard Output:</p>
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-sm border border-slate-800 whitespace-pre-wrap min-h-[60px]">
                {runOutput.stdout || <span className="text-slate-600 italic">// No output produced</span>}
              </pre>
            </div>
          </div>
        )}

        {/* Submission Results Panel */}
        {results.length > 0 && (
          <div className="glass-panel p-6 rounded-xl animate-scale-in">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> Execution Results
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-700/50">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/80">
                  <tr>
                    <th className="px-4 py-3">Case</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Output</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 bg-slate-900/40">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-500 font-mono">Test Case {i + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${r.status === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : r.status === 'Wrong Answer'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                          {r.status === 'Accepted' && <CheckCircle className="w-3 h-3" />}
                          {r.status === 'Wrong Answer' && <AlertCircle className="w-3 h-3" />}
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-300 max-w-[200px] truncate">
                        {r.output || <span className="text-slate-600 italic">No output</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {r.time || '0ms'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* AI Teacher Instance */}
      <div className={`fixed z-[1000] transition-all duration-1000 ease-in-out ${aiState.position === 'editor' ? 'ai-pos-editor' : aiState.position === 'results' ? 'ai-pos-results' : 'ai-pos-corner'}`}>
        <AiTeacher
          emotion={aiState.emotion}
          message={aiState.message}
          isTalking={aiState.isTalking}
          isPointing={aiState.position !== 'corner'}
          className="hover:scale-105 transition-transform cursor-pointer"
        />
      </div>
    </div>
  );
}


