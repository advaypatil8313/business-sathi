import businessAnalyst from './businessAnalyst.js';
import marketingSathi from './marketingSathi.js';
import customerSathi from './customerSathi.js';
import businessAdvisor from './businessAdvisor.js';

export const assistants = [businessAnalyst, marketingSathi, customerSathi, businessAdvisor];

export function getAssistant(key) {
  return assistants.find((a) => a.key === key);
}
