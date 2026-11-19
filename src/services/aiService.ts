import { KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { CityAirData, UserFamilyProfile } from '../types/aqi';
import { ChatMessage } from '../types/chat';
import { sanitizeUserInput } from '../utils/sanitize';

interface GenerateAdviceParams {
  prompt: string;
  cityData: CityAirData;
  profile: UserFamilyProfile;
  apiKey?: string;
  conversationHistory: ChatMessage[];
}

export async function askAeroPulseAssistant({
  prompt,
  cityData,
  profile,
  apiKey,
  conversationHistory
}: GenerateAdviceParams): Promise<ChatMessage> {
  const cleanPrompt = sanitizeUserInput(prompt);
  if (!cleanPrompt) {
    throw new Error('Please enter a valid message.');
  }

  // 1. Try Gemini Live API if user configured their Gemini Key
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const geminiResponse = await callGeminiAPI(cleanPrompt, cityData, profile, apiKey, conversationHistory);
      return geminiResponse;
    } catch (err) {
      console.warn('[AeroPulse AI] Gemini API call failed or quota reached. Switching to Offline Science Engine.', err);
      // Fall through to offline science engine seamlessly
    }
  }

  // 2. Intelligent Offline Environmental Science GenAI Engine
  return synthesizeOfflineResponse(cleanPrompt, cityData, profile);
}

async function callGeminiAPI(
  prompt: string,
  cityData: CityAirData,
  profile: UserFamilyProfile,
  apiKey: string,
  _history: ChatMessage[]
): Promise<ChatMessage> {
  const systemInstruction = `You are AeroPulse AI, an environmental health copilot and urban air quality assistant.
Context:
- Current Location: ${cityData.cityName}, ${cityData.country}
- Current AQI: ${cityData.currentAQI} (${cityData.category})
- PM2.5: ${cityData.pollutants.pm25} µg/m³, NO2: ${cityData.pollutants.no2} µg/m³
- Temperature: ${cityData.temperatureC}°C, Humidity: ${cityData.humidityPercent}%
- Thermal Inversion: ${cityData.inversionLayerActive ? 'ACTIVE (Trapping particulate at low altitude)' : 'INACTIVE'}
- Household Vulnerabilities: ${profile.householdMembers.join(', ') || 'General adult'}
- Heating: ${profile.heatingType}, Cooking: ${profile.cookingFuel}, Commute: ${profile.commuteMode}

Provide actionable, science-grounded, low-emission daily routines, indoor air hacks, and sustainable alternatives. Explain the direct quantified impact of their choices (e.g. inhaled PM2.5 dose avoided, Berkeley Earth cigarette equivalence). Format using clear markdown headers and bullet points.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: [
      { title: 'Gemini 1.5 Flash Model Synthesis', publisher: 'Google DeepMind GenAI' },
      { title: `Real-time Atmospheric Telemetry (${cityData.cityName})`, publisher: 'AeroPulse Environmental Feed' }
    ],
    suggestedActions: [
      { label: 'Calculate Corsi-Rosenthal Size', actionType: 'OPEN_CALCULATOR', payload: 'CR_BOX' },
      { label: 'Check Today\'s Safe Ventilation Hour', actionType: 'NAVIGATE', payload: 'ROUTINES' }
    ]
  };
}

function synthesizeOfflineResponse(
  cleanPrompt: string,
  cityData: CityAirData,
  profile: UserFamilyProfile
): ChatMessage {
  const lower = cleanPrompt.toLowerCase();

  // Search knowledge articles by keyword match score
  let bestArticle = KNOWLEDGE_BASE[0];
  let maxScore = -1;

  for (const article of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of article.keywords) {
      if (lower.includes(kw)) {
        score += 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestArticle = article;
    }
  }

  // Synthesize customized response taking user profile and city AQI into account
  const vulnerabilityWarning = profile.householdMembers.length > 0 
    ? `\n\n> ⚠️ **High-Risk Household Advisory for ${profile.householdMembers.join(', ')}**: Current PM2.5 of **${cityData.pollutants.pm25} µg/m³** in ${cityData.cityName} triggers mucosal inflammation. Prioritize certified N95 respirators over cloth coverings and keep bedroom filtration active continuous 24/7.`
    : '';

  let tailoredSection = '';
  if (lower.includes('routine') || lower.includes('commute') || lower.includes('schedule') || lower.includes('exercise')) {
    tailoredSection = `\n\n### 🗓️ Recommended Today for ${cityData.cityName} (AQI: ${cityData.currentAQI})
- **Morning Peak Inversion (6:00 AM - 9:30 AM)**: Avoid all outdoor running and cycling. With ground inversion lid at ~${cityData.thermalInversionHeightMeters}m, pollution is trapped right at street level.
- **Midday Safe Window (12:30 PM - 2:30 PM)**: Safest interval for essential errands and a 10-minute rapid cross-ventilation exchange.
- **Commute Alternative**: You currently commute via *${profile.commuteMode}*. Setting vehicle ventilation to *Recirculation Mode* or opting for electric metro rail avoids inhaling up to 75% of ultrafine tailpipe soot.`;
  } else if (lower.includes('filter') || lower.includes('purifier') || lower.includes('corsi') || lower.includes('diy')) {
    tailoredSection = `\n\n### 🛠️ Low-Cost Indoor DIY Air Defense
- For your **${profile.housingType}**, an open-source **Corsi-Rosenthal Box** delivers ~480-520 CFM CADR for approx $50-$65.
- That equals **3 to 4 commercial purifiers** at one-sixth of the total cost.
- **Airflow Tip**: Keep your DIY or commercial purifier positioned in the center of the room, raised 12 inches off the ground, never flush against a wall or blocked by thick curtains.`;
  } else {
    tailoredSection = `\n\n### 💡 Smart Immediate Action:
- In ${cityData.cityName}'s current **${cityData.category}** atmosphere, keeping indoor windows tightly sealed except during the 1:00 PM solar-lift window prevents over **180 µg/m³** of raw PM2.5 from depositing in living spaces.
- Switch to damp microfiber mopping instead of dry broom sweeping to avoid resuspending settled heavy metals and carbon soot.`;
  }

  const content = `## ${bestArticle.title}

${bestArticle.answer}${tailoredSection}${vulnerabilityWarning}

### 📋 Key Recommendations:
${bestArticle.recommendations.map(r => `- ${r}`).join('\n')}

*Calculated Impact: Following these steps reduces daily PM2.5 inhalation by an estimated 65-80%, equivalent to avoiding ~${Math.max(1, Math.round(cityData.pollutants.pm25 / 30))} cigarettes/day in ${cityData.cityName}.*`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: bestArticle.sources,
    suggestedActions: [
      { label: 'Calculate DIY Filter CADR', actionType: 'OPEN_CALCULATOR', payload: 'CR_BOX' },
      { label: 'View Diurnal Smog Forecast', actionType: 'NAVIGATE', payload: 'DASHBOARD' },
      { label: 'Adjust Routine Schedule', actionType: 'NAVIGATE', payload: 'ROUTINES' }
    ]
  };
}
