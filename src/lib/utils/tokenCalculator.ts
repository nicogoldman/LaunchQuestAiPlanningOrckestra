export const calculateCost = (tokens: number, ratePerThousand: number = 0.05) => {
  return (tokens / 1000) * ratePerThousand;
};

export const formatTokens = (tokens: number) => {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return tokens.toString();
};
