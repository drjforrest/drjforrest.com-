"use client";

import { useState } from 'react';

type ContextKey = 'communication' | 'brainFog' | 'autism';

type Step = {
  label: string;
  value: number;
  time: string;
};

type ContextData = {
  name: string;
  person: string;
  task: string;
  before: {
    steps: Step[];
    cognitiveLoad: number;
    outcome: string;
    quote: string;
  };
  after: {
    steps: Step[];
    cognitiveLoad: number;
    outcome: string;
    quote: string;
  };
};

const LevelingEffectVisualization = () => {
  const [selectedContext, setSelectedContext] = useState<ContextKey>('communication');

  const contexts: Record<ContextKey, ContextData> = {
    communication: {
      name: "Communication Disability",
      person: "Fiona Given, Lawyer with Cerebral Palsy",
      task: "Writing Professional Email",
      before: {
        steps: [
          { label: "Compose thoughts", value: 85, time: "Extended time" },
          { label: "Find appropriate professional tone", value: 90, time: "Significant effort" },
          { label: "Add 'polite parts' and formalities", value: 95, time: "Each word takes substantially more time" },
          { label: "Check for errors", value: 60, time: "Additional time" }
        ],
        cognitiveLoad: 95,
        outcome: "Hours of work for single email",
        quote: "Each word takes substantially more time and effort"
      },
      after: {
        steps: [
          { label: "Compose core message", value: 50, time: "Focused time" },
          { label: "AI adds tone and polish", value: 5, time: "Seconds" },
          { label: "Review and verify accuracy", value: 30, time: "Quick review" },
          { label: "Final check", value: 20, time: "Standard time" }
        ],
        cognitiveLoad: 35,
        outcome: "Competitive with neurotypical colleagues",
        quote: "ChatGPT maintains my professionalism without the exhausting labor"
      }
    },
    brainFog: {
      name: "Brain Fog / Post-COVID",
      person: "Researcher, UW Accessibility Study",
      task: "Reading Research Papers",
      before: {
        steps: [
          { label: "Read full paper", value: 90, time: "Hours, often incomplete" },
          { label: "Extract key points", value: 85, time: "Mentally exhausting" },
          { label: "Synthesize information", value: 80, time: "Difficult with brain fog" },
          { label: "Remember for later use", value: 70, time: "Often fails" }
        ],
        cognitiveLoad: 90,
        outcome: "Incomplete understanding, high fatigue",
        quote: "I can't process dense academic text like I used to"
      },
      after: {
        steps: [
          { label: "Upload paper to ChatPDF", value: 10, time: "Seconds" },
          { label: "AI summarizes key points", value: 5, time: "Instant" },
          { label: "Ask targeted questions", value: 30, time: "Minutes" },
          { label: "Verify critical details", value: 35, time: "Focused attention" }
        ],
        cognitiveLoad: 30,
        outcome: "Effective research despite limitations",
        quote: "Shifted from generation to verification - a task I can actually do"
      }
    },
    autism: {
      name: "Autism Spectrum",
      person: "Autistic Researcher, UW Study",
      task: "Writing Work Messages",
      before: {
        steps: [
          { label: "Compose technical content", value: 50, time: "Natural" },
          { label: "Add social pleasantries", value: 85, time: "Unnatural, stressful" },
          { label: "Guess appropriate tone", value: 90, time: "High anxiety" },
          { label: "Second-guess everything", value: 80, time: "Delays sending" }
        ],
        cognitiveLoad: 85,
        outcome: "Messages seen as 'robotic' or 'cold'",
        quote: "Colleagues said my messages felt robotic"
      },
      after: {
        steps: [
          { label: "Write direct message content", value: 40, time: "Quick" },
          { label: "AI adds social context", value: 10, time: "Seconds" },
          { label: "Review for accuracy", value: 25, time: "Comfortable" },
          { label: "Send with confidence", value: 15, time: "No anxiety" }
        ],
        cognitiveLoad: 30,
        outcome: "Professional communication, reduced anxiety",
        quote: "My confidence increased - I could focus on the work, not the performance"
      }
    }
  };

  const context = contexts[selectedContext];

  const CognitiveLoadBar = ({ load, label }: { load: number; label: string }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm">{load}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="h-3 rounded-full transition-all duration-500"
          style={{ 
            width: `${load}%`,
            backgroundColor: load > 70 ? '#E31B23' : load > 40 ? '#FFA500' : '#4CAF50'
          }}
        />
      </div>
    </div>
  );

  const TaskBreakdown = ({ steps, title }: { steps: Step[]; title: string }) => (
    <div className="space-y-3">
      <h4 className="font-semibold text-lg mb-4">{title}</h4>
      {steps.map((step: Step, idx: number) => (
        <div key={idx} className="border-l-4 border-gray-300 pl-4 py-2">
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-medium">{step.label}</span>
            <span className="text-xs text-gray-600 ml-2">{step.time}</span>
          </div>
          <div className="w-full bg-gray-100 rounded h-2">
            <div 
              className="bg-blue-600 h-2 rounded transition-all duration-500"
              style={{ width: `${step.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#003688' }}>
          The Leveling Effect: How AI Transforms Tasks
        </h2>
        <p className="text-gray-600 mb-4">
          AI doesn't eliminate work—it transforms generation tasks (impossible for some) into verification tasks (accessible to most)
        </p>

        {/* Context Selector */}
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(contexts) as ContextKey[]).map((key) => {
            const ctx = contexts[key];
            return (
            <button
              key={key}
              onClick={() => setSelectedContext(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedContext === key 
                  ? 'text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedContext === key ? { backgroundColor: '#E31B23' } : {}}
            >
              {ctx.name}
            </button>
            );
          })}
        </div>
      </div>

      {/* Selected Context Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: '#E31B23' }}>
        <p className="font-medium">{context.person}</p>
        <p className="text-sm text-gray-600">Task: {context.task}</p>
      </div>

      {/* Before/After Comparison */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Before AI */}
        <div className="border rounded-lg p-6" style={{ borderColor: '#E31B23', borderWidth: '2px' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">❌</span>
            <h3 className="text-2xl font-bold" style={{ color: '#E31B23' }}>
              Before AI
            </h3>
          </div>
          
          <TaskBreakdown steps={context.before.steps} title="Task Breakdown" />
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <CognitiveLoadBar load={context.before.cognitiveLoad} label="Cognitive Load" />
            
            <div className="mt-4 p-3 bg-red-50 rounded">
              <p className="text-sm font-medium text-gray-700 mb-1">Outcome:</p>
              <p className="text-sm">{context.before.outcome}</p>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded italic text-sm">
              "{context.before.quote}"
            </div>
          </div>
        </div>

        {/* After AI */}
        <div className="border rounded-lg p-6" style={{ borderColor: '#4CAF50', borderWidth: '2px' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-2xl font-bold" style={{ color: '#4CAF50' }}>
              After AI
            </h3>
          </div>
          
          <TaskBreakdown steps={context.after.steps} title="Task Breakdown" />
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <CognitiveLoadBar load={context.after.cognitiveLoad} label="Cognitive Load" />
            
            <div className="mt-4 p-3 bg-green-50 rounded">
              <p className="text-sm font-medium text-gray-700 mb-1">Outcome:</p>
              <p className="text-sm">{context.after.outcome}</p>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded italic text-sm">
              "{context.after.quote}"
            </div>
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#003688', color: 'white' }}>
        <h3 className="text-xl font-bold mb-3">The Key Transformation</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold mb-2">Generation Task →</p>
            <p className="text-sm opacity-90">
              Creating something from scratch: high cognitive load, time-intensive, 
              often impossible for people with certain disabilities
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">→ Verification Task</p>
            <p className="text-sm opacity-90">
              Reviewing and confirming: lower cognitive load, more accessible, 
              allows focus on judgment and expertise
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm italic opacity-90">
          When you've always found generation easy, verification looks like cheating.
        </p>
      </div>

      {/* Data Source */}
      <div className="mt-6 text-xs text-gray-500 border-t pt-4">
        <p className="font-medium mb-1">Sources:</p>
        <ul className="space-y-1">
          <li>• Fiona Given, "I'm a Disabled Lawyer - AI Helps Me Work, It's Not Cheating," The Conversation</li>
          <li>• University of Washington Accessibility Study (Mankoff et al.)</li>
          <li>• The A11Y Project, "ChatGPT and Traumatic Brain Injury"</li>
        </ul>
      </div>
    </div>
  );
};

export default LevelingEffectVisualization;