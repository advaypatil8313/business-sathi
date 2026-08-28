export function buildBusinessContext(business) {
  if (!business) {
    return 'No business profile has been set up yet. If the user asks something specific to their business, ask them to complete onboarding first.';
  }
  return [
    `Business name: ${business.name}`,
    `Business type: ${business.type}`,
    business.location ? `Location: ${business.location}` : null,
    business.products ? `Products/services: ${business.products}` : null,
    business.customers ? `Target customers: ${business.customers}` : null,
    business.goal ? `Main goal: ${business.goal}` : null,
  ].filter(Boolean).join('\n');
}

export function withContext(systemPrompt, business) {
  return `${systemPrompt}\n\nBusiness context (use this to tailor every answer; do not repeat it verbatim back to the user):\n${buildBusinessContext(business)}`;
}
