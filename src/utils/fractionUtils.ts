import { FractionType } from '@/types';

// Greatest Common Divisor (GCD) using Euclidean algorithm
export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b === 0) return a;
  return gcd(b, a % b);
};

// Least Common Multiple (LCM)
export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

// Simplify a fraction to its simplest form
export const simplifyFraction = (fraction: FractionType): FractionType => {
  if (fraction.denominator === 0) {
    throw new Error('Cannot simplify a fraction with denominator 0');
  }

  // Handle negative fractions consistently
  let sign = 1;
  if (fraction.numerator < 0) {
    sign *= -1;
    fraction.numerator = Math.abs(fraction.numerator);
  }
  if (fraction.denominator < 0) {
    sign *= -1;
    fraction.denominator = Math.abs(fraction.denominator);
  }

  const divisor = gcd(fraction.numerator, fraction.denominator);
  return {
    numerator: (sign * fraction.numerator) / divisor,
    denominator: fraction.denominator / divisor
  };
};

// Add two fractions
export const addFractions = (a: FractionType, b: FractionType): FractionType => {
  if (a.denominator === 0 || b.denominator === 0) {
    throw new Error('Cannot add fractions with denominator 0');
  }

  const commonDenominator = lcm(a.denominator, b.denominator);
  const factorA = commonDenominator / a.denominator;
  const factorB = commonDenominator / b.denominator;

  return simplifyFraction({
    numerator: a.numerator * factorA + b.numerator * factorB,
    denominator: commonDenominator
  });
};

// Subtract two fractions
export const subtractFractions = (a: FractionType, b: FractionType): FractionType => {
  return addFractions(a, { numerator: -b.numerator, denominator: b.denominator });
};

// Multiply two fractions
export const multiplyFractions = (a: FractionType, b: FractionType): FractionType => {
  if (a.denominator === 0 || b.denominator === 0) {
    throw new Error('Cannot multiply fractions with denominator 0');
  }

  return simplifyFraction({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator
  });
};

// Divide two fractions
export const divideFractions = (a: FractionType, b: FractionType): FractionType => {
  if (a.denominator === 0 || b.denominator === 0 || b.numerator === 0) {
    throw new Error('Cannot divide by zero or use a fraction with denominator 0');
  }

  return simplifyFraction({
    numerator: a.numerator * b.denominator,
    denominator: a.denominator * b.numerator
  });
};

// Compare fractions (a > b returns 1, a < b returns -1, a === b returns 0)
export const compareFractions = (a: FractionType, b: FractionType): number => {
  if (a.denominator === 0 || b.denominator === 0) {
    throw new Error('Cannot compare fractions with denominator 0');
  }

  // Convert to common denominator for comparison
  const commonDenominator = lcm(a.denominator, b.denominator);
  const aNew = a.numerator * (commonDenominator / a.denominator);
  const bNew = b.numerator * (commonDenominator / b.denominator);

  if (aNew > bNew) return 1;
  if (aNew < bNew) return -1;
  return 0;
};

// Convert fraction to decimal
export const fractionToDecimal = (fraction: FractionType): number => {
  if (fraction.denominator === 0) {
    throw new Error('Cannot convert a fraction with denominator 0 to decimal');
  }
  return fraction.numerator / fraction.denominator;
};

// Convert decimal to fraction with approximation
export const decimalToFraction = (decimal: number, precision = 1000): FractionType => {
  let numerator = Math.round(Math.abs(decimal) * precision);
  let denominator = precision;
  const sign = decimal < 0 ? -1 : 1;
  
  const divisor = gcd(numerator, denominator);
  return {
    numerator: sign * (numerator / divisor),
    denominator: denominator / divisor
  };
};

// Format fraction as a string
export const formatFraction = (fraction: FractionType): string => {
  const simplified = simplifyFraction(fraction);
  
  if (simplified.denominator === 1) {
    return `${simplified.numerator}`;
  }
  
  return `${simplified.numerator}/${simplified.denominator}`;
};