'use client';

import { AlertCircle, BarChart3, CheckCircle, ChevronLeft, ChevronRight, FileText, Lightbulb, Send, Settings, Target, Users } from 'lucide-react';
import { useCallback, useState } from 'react';

interface DEIResponse {
  answer: string;
  followUp?: string;
}

interface FollowUp {
  yes: string;
  no?: string;
}

interface Question {
  id: string;
  text: string;
  type: 'yesno';
  followUp: FollowUp;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: Question[];
}

const DEIProposalWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, DEIResponse>>({});
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const sections: Section[] = [
    {
      id: 'team',
      title: 'Team Composition',
      icon: Users,
      questions: [
        {
          id: 'team_representative',
          text: 'Is the research team representative of the sample or study population?',
          type: 'yesno',
          followUp: {
            yes: 'Please describe how your team is representative:',
            no: 'Please explain why the team composition differs from your study population:'
          }
        },
        {
          id: 'team_diversity_opportunities',
          text: 'Are there opportunities for teams to incorporate categories of diversity that are also present outside the research team?',
          type: 'yesno',
          followUp: {
            yes: 'How will you incorporate these diverse perspectives?'
          }
        },
        {
          id: 'team_balance',
          text: 'Is there a balance in terms of gender, age, disciplinary background, ethnicity, language skills, socioeconomic position, disability, and other attributes?',
          type: 'yesno',
          followUp: {
            yes: 'Please describe the balance achieved and conscious efforts made:',
            no: 'Please explain the current composition and any constraints:'
          }
        },
        {
          id: 'underrepresented_recruitment',
          text: 'Are you making efforts to recruit underrepresented groups to the team?',
          type: 'yesno',
          followUp: {
            yes: 'Describe your recruitment strategies for underrepresented groups:'
          }
        },
        {
          id: 'sustainable_access',
          text: 'Are you planning to make sustainable efforts to increase access of underrepresented groups to this area of research?',
          type: 'yesno',
          followUp: {
            yes: 'Describe your long-term access and inclusion plans:'
          }
        }
      ]
    },
    {
      id: 'management',
      title: 'Project Management',
      icon: Settings,
      questions: [
        {
          id: 'advisory_board_community',
          text: 'Do you have an advisory board with members from the study population?',
          type: 'yesno',
          followUp: {
            yes: 'Describe how advisory board members are chosen and compensated:'
          }
        },
        {
          id: 'external_advisory',
          text: 'Is there an external advisory board?',
          type: 'yesno',
          followUp: {
            yes: 'How does your external advisory board represent diverse voices?'
          }
        },
        {
          id: 'early_career_opportunities',
          text: 'Are early stage researchers given opportunities to have roles of responsibility?',
          type: 'yesno',
          followUp: {
            yes: 'Describe how early career researchers will be given leadership opportunities:'
          }
        },
        {
          id: 'conflict_resolution',
          text: 'Do you have a conflict resolution procedure to deal specifically with issues related to gender and diversity?',
          type: 'yesno',
          followUp: {
            yes: 'Describe your conflict resolution procedures:',
            no: 'Explain your confidence that existing procedures will handle diversity-related conflicts:'
          }
        }
      ]
    },
    {
      id: 'scope',
      title: 'Research Scope & Community Involvement',
      icon: Target,
      questions: [
        {
          id: 'community_involvement',
          text: 'Is your research about events, procedures, histories, or other aspects that involve a certain group or community of humans?',
          type: 'yesno',
          followUp: {
            yes: 'How do you involve the perspectives of that group in design, execution, analysis, and reporting?'
          }
        }
      ]
    },
    {
      id: 'methods',
      title: 'Research Methods',
      icon: BarChart3,
      questions: [
        {
          id: 'inclusion_criteria',
          text: 'Have you created a clear list of inclusion and exclusion criteria for your study group?',
          type: 'yesno',
          followUp: {
            yes: 'List and justify your inclusion/exclusion criteria:'
          }
        },
        {
          id: 'selection_consequences',
          text: 'Are there consequences of your selection criteria for the subject group and those not included?',
          type: 'yesno',
          followUp: {
            yes: 'Describe these consequences and how you\'ll address them:'
          }
        },
        {
          id: 'generalizability',
          text: 'Can the results be applied to larger groups?',
          type: 'yesno',
          followUp: {
            yes: 'Justify how your results can be generalized:',
            no: 'Explain the limitations of generalizability:'
          }
        },
        {
          id: 'excluded_groups',
          text: 'Are there groups often excluded from comparable research setups?',
          type: 'yesno',
          followUp: {
            yes: 'Explain the reasons for exclusion and consequences:'
          }
        },
        {
          id: 'researcher_positionality',
          text: 'Does your background (gender, nationality, ethnicity, language skills, physical ability, age, socioeconomic status) impact data collection or subject recruitment?',
          type: 'yesno',
          followUp: {
            yes: 'Describe how you accommodate this impact and mitigate risks:'
          }
        },
        {
          id: 'homogeneity_assumptions',
          text: 'Do your methods assume homogeneity of anatomy, physiology, disease processes, cognition, or social behavior across diversity dimensions?',
          type: 'yesno',
          followUp: {
            yes: 'Justify this assumption and describe allowances made:'
          }
        }
      ]
    },
    {
      id: 'analysis',
      title: 'Analysis & Reporting',
      icon: FileText,
      questions: [
        {
          id: 'community_in_analysis',
          text: 'Does your analysis team include members of the community you are studying?',
          type: 'yesno',
          followUp: {
            yes: 'Describe their involvement in analysis:',
            no: 'Explain why community involvement in analysis was not possible:'
          }
        },
        {
          id: 'bias_prevention',
          text: 'Have you ensured you can avoid gender/diversity-related bias in statistical analyses and modeling?',
          type: 'yesno',
          followUp: {
            yes: 'Describe your bias prevention strategies:'
          }
        },
        {
          id: 'community_reporting',
          text: 'Do you have plans to report findings to the community you are studying?',
          type: 'yesno',
          followUp: {
            yes: 'Describe your community reporting plans:',
            no: 'Justify why direct community reporting is not planned:'
          }
        },
        {
          id: 'diverse_dissemination',
          text: 'Do you have plans to report findings to a wide range of audiences beyond academics?',
          type: 'yesno',
          followUp: {
            yes: 'Describe your broader dissemination strategy:'
          }
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impact & Language',
      icon: Lightbulb,
      questions: [
        {
          id: 'diversity_impact',
          text: 'Have you considered the potential scientific, societal, and economic impact of addressing diversity dimensions in your methodology and dissemination?',
          type: 'yesno',
          followUp: {
            yes: 'Describe these potential impacts:'
          }
        },
        {
          id: 'equity_contribution',
          text: 'Does your research contribute to increasing equity in society?',
          type: 'yesno',
          followUp: {
            yes: 'Explain how your research increases societal equity:'
          }
        },
        {
          id: 'inclusive_language',
          text: 'Will you use gender-inclusive language and review all materials for inclusivity?',
          type: 'yesno',
          followUp: {
            yes: 'Describe your approach to inclusive language and review processes:'
          }
        }
      ]
    }
  ];

  const updateResponse = useCallback((questionId: string, value: string, followUpValue: string = '') => {
    setResponses(prev => ({
      ...prev,
      [questionId]: { answer: value, followUp: followUpValue }
    }));
  }, []);

  const generateProposalText = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/dei-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate DEI text');
      }

      const data = await response.json();
      setGeneratedText(data.text);
    } catch (error) {
      console.error('Error generating DEI text:', error);
      setGeneratedText('Sorry, we encountered an error generating your DEI text. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSection = sections[currentStep];
  const isLastStep = currentStep === sections.length - 1;
  const canProceed = currentSection?.questions.every(q => responses[q.id]?.answer);

  const progressPercentage = ((currentStep + 1) / sections.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-accent-950" />
          <h1 className="text-2xl font-bold text-gray-900">DEI Proposal Assistant</h1>
        </div>
        <p className="text-gray-600 mb-4">
          Interactive tool to help you develop the diversity, equity, and inclusion sections of your research proposal.
          <br />
          <span className="text-sm italic">Based on guidelines from Maastricht University</span>
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-accent-950 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Step {currentStep + 1} of {sections.length}: {currentSection?.title}
        </p>
      </div>

      {/* Main content */}
      {currentStep < sections.length ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <currentSection.icon className="w-8 h-8 text-accent-950" />
            <h2 className="text-xl font-semibold text-gray-900">{currentSection.title}</h2>
          </div>

          {currentSection.questions.map((question) => (
            <div key={question.id} className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">{question.text}</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => updateResponse(question.id, 'yes', responses[question.id]?.followUp || '')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      responses[question.id]?.answer === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Yes
                  </button>
                  <button
                    onClick={() => updateResponse(question.id, 'no', responses[question.id]?.followUp || '')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      responses[question.id]?.answer === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    No
                  </button>
                </div>

                {responses[question.id]?.answer && question.followUp && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {question.followUp[responses[question.id]?.answer as keyof FollowUp]}
                    </label>
                    <textarea
                      value={responses[question.id]?.followUp || ''}
                      onChange={(e) => updateResponse(question.id, responses[question.id]?.answer || '', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-950 focus:border-accent-950"
                      rows={3}
                      placeholder="Provide details here..."
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={() => {
                if (isLastStep) {
                  setCurrentStep(sections.length); // Move to generation step
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2 bg-accent-950 text-white rounded-md hover:bg-accent-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastStep ? 'Generate Text' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
              {isLastStep && <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        /* Generation Results */
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your DEI Proposal Section
            </h2>
            {!generatedText && (
              <button
                onClick={generateProposalText}
                disabled={isGenerating}
                className="px-6 py-3 bg-accent-950 text-white rounded-md hover:bg-accent-900 disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {isGenerating ? 'Generating...' : 'Generate Proposal Text'}
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          {generatedText && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Important Disclaimers:</p>
                    <ul className="mt-1 text-yellow-700 list-disc list-inside">
                      <li>This is a draft based on your responses - review and customize thoroughly</li>
                      <li>Check specific requirements for your funding agency</li>
                      <li>Consider having diversity experts review your final text</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded border p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                  {generatedText}
                </pre>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedText)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Copy Text
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setGeneratedText('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Tool based on "A Guide to Addressing Diversity in your Research Proposal"</p>
            <p>© Maastricht University, adapted with permission</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DEIProposalWizard;