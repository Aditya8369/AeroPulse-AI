import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, AlertCircle, Wrench, Calendar, Loader2 } from 'lucide-react';
import { CityAirData, UserFamilyProfile } from '../../types/aqi';
import { ChatMessage, QuickPrompt } from '../../types/chat';
import { askAeroPulseAssistant } from '../../services/aiService';
import { announceToScreenReader } from '../../utils/a11y';

interface ChatInterfaceProps {
  cityData: CityAirData;
  profile: UserFamilyProfile;
  apiKey: string;
  onNavigateTab: (tab: any) => void;
  onOpenCalculator: () => void;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'qp-crbox',
    icon: '🛠️',
    title: 'DIY Corsi-Rosenthal Box',
    prompt: 'How do I build a DIY Corsi-Rosenthal air cleaner box under $50, and how does its CADR compare to commercial HEPA purifiers?',
    category: 'IAQ'
  },
  {
    id: 'qp-asthma',
    icon: '🫁',
    title: 'Asthmatic Child Commute',
    prompt: 'How can I protect my 7-year-old asthmatic child during the morning school run when winter smog is at Hazardous levels?',
    category: 'ROUTINE'
  },
  {
    id: 'qp-vent',
    icon: '🪟',
    title: 'Safe Ventilation Timing',
    prompt: 'When should I open my windows today to flush indoor CO2 without letting winter thermal inversion smog flood my home?',
    category: 'IAQ'
  },
  {
    id: 'qp-plants',
    icon: '🌿',
    title: 'NASA Plants vs Reality',
    prompt: 'Do houseplants like snake plants actually clean winter smog and PM2.5, or is that a myth? What does science say?',
    category: 'SCIENCE'
  },
  {
    id: 'qp-cigs',
    icon: '🚬',
    title: 'Cigarette Equivalence',
    prompt: 'Explain the Berkeley Earth cigarette equivalence of today\'s PM2.5 level in my city and how much my health benefits from indoor filtration.',
    category: 'SCIENCE'
  }
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  cityData,
  profile,
  apiKey,
  onNavigateTab,
  onOpenCalculator,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `### Welcome to AeroPulse AI! 🌬️
I'm your **Winter Smog & Clean Air Copilot**, tuned to live atmospheric telemetry for **${cityData.cityName}** (AQI: **${cityData.currentAQI}** - ${cityData.category}).

I help you and your community:
- 🗓️ **Plan low-emission daily routines** timed around winter thermal inversion lifts.
- 🛠️ **Deploy high-CADR indoor air hacks** like DIY Corsi-Rosenthal boxes for under $50.
- 🚶 **Navigate safe commutes & school runs** tailored for high-risk family members.
- 📊 **Quantify your health impact** (micrograms of PM2.5 avoided & cigarette equivalents).

Pick a quick question below or ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        { title: 'AeroPulse Environmental Engine', publisher: 'DeepMind Air Health Initiative' },
        { title: `Atmospheric Sensor Telemetry (${cityData.cityName})`, publisher: 'Local Environmental Monitor' }
      ],
      suggestedActions: [
        { label: 'Calculate DIY Filter Size', actionType: 'OPEN_CALCULATOR', payload: 'CR_BOX' },
        { label: 'View Today\'s Inversion Window', actionType: 'NAVIGATE', payload: 'DASHBOARD' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    announceToScreenReader('AeroPulse Copilot is formulating advice...');

    try {
      const response = await askAeroPulseAssistant({
        prompt: text,
        cityData,
        profile,
        apiKey,
        conversationHistory: [...messages, userMsg]
      });

      setMessages(prev => [...prev, response]);
      announceToScreenReader('AeroPulse Copilot responded.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedActions']>[0]) => {
    if (action.actionType === 'OPEN_CALCULATOR') {
      onOpenCalculator();
    } else if (action.actionType === 'NAVIGATE') {
      onNavigateTab(action.payload);
    } else if (action.actionType === 'PROMPT') {
      handleSendMessage(action.payload);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[750px] transition-colors">
      
      {/* Copilot Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              AeroPulse AI Assistant
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {apiKey ? 'Gemini 1.5 Active' : 'Offline Science Engine'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized for {cityData.cityName} &bull; Household: {profile.householdMembers.length > 0 ? profile.householdMembers.join(', ') : 'Standard'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCalculator}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
        >
          <Wrench className="w-3.5 h-3.5 text-sky-600" />
          CADR Calculator
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div 
        tabIndex={0}
        aria-label="Conversation with AeroPulse AI Assistant"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 focus:outline-none"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isUser 
                  ? 'bg-sky-600 text-white' 
                  : 'bg-slate-800 text-cyan-400 dark:bg-cyan-950 dark:text-cyan-300 ring-1 ring-cyan-500/30'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Container */}
              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                }`}>
                  {/* Clean Markdown-like Rendering */}
                  <div className="prose prose-sm dark:prose-invert max-w-none space-y-2">
                    {msg.content.split('\n\n').map((paragraph, idx) => {
                      // Check for headers
                      if (paragraph.startsWith('### ')) {
                        return <h4 key={idx} className="font-extrabold text-sm sm:text-base text-sky-700 dark:text-sky-300 mt-2">{paragraph.replace('### ', '')}</h4>;
                      }
                      if (paragraph.startsWith('## ')) {
                        return <h3 key={idx} className="font-extrabold text-base text-slate-900 dark:text-white mt-1">{paragraph.replace('## ', '')}</h3>;
                      }
                      // Check for blockquotes
                      if (paragraph.startsWith('> ')) {
                        return (
                          <blockquote key={idx} className="border-l-4 border-amber-500 bg-amber-500/10 p-2.5 rounded-r text-xs text-amber-900 dark:text-amber-200 my-2">
                            {paragraph.replace('> ', '')}
                          </blockquote>
                        );
                      }
                      // Check for list items
                      if (paragraph.startsWith('- ')) {
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-1">
                            {paragraph.split('\n- ').map((item, i) => (
                              <li key={i} className="text-slate-700 dark:text-slate-300">
                                {item.replace(/^- /, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx} className="whitespace-pre-line">{paragraph}</p>;
                    })}
                  </div>
                </div>

                {/* Suggested Action Pills */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action)}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-3 h-3 text-sky-500" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sources Attribution */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>Scientific Sources:</span>
                    {msg.sources.map((src, i) => (
                      <span key={i} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                        {src.title} ({src.publisher})
                      </span>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className={`text-[10px] text-slate-400 dark:text-slate-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>

              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              <span>Analyzing atmospheric boundary conditions and formulating scientific plan...</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
            Quick Questions:
          </span>
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.id}
              onClick={() => handleSendMessage(qp.prompt)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>{qp.icon}</span>
              <span>{qp.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Corsi-Rosenthal boxes, safe ventilation windows, school routines..."
            aria-label="Message for AeroPulse AI Copilot"
            disabled={isLoading}
            className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-3 px-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="p-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-sky-600/30 transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
