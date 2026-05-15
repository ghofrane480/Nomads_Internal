import { addMonths, format } from "date-fns";
import { fr } from "date-fns/locale";
import { LoanInputs, LoanResults, AmortizationRow } from "../types/loan";

/**
 * Calcule les détails d'un prêt amortissable.
 */
export function calculateLoan(inputs: LoanInputs): LoanResults {
  const { amount, annualRate, durationYears, startDate } = inputs;
  
  const monthlyRate = (annualRate / 100) / 12;
  const numberOfPayments = durationYears * 12;
  
  // Formule pour la mensualité : M = P * [r(1+r)^n] / [(1+r)^n - 1]
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = amount / numberOfPayments;
  } else {
    monthlyPayment = 
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let remainingBalance = amount;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  const start = new Date(startDate);

  for (let i = 1; i <= numberOfPayments; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    totalInterestPaid += interestPayment;
    totalPrincipalPaid += principalPayment;
    remainingBalance -= principalPayment;
    
    // Correction pour le dernier paiement (pb arrondis)
    if (i === numberOfPayments) {
      remainingBalance = 0;
    }

    schedule.push({
      period: i,
      date: format(addMonths(start, i - 1), "MMMM yyyy", { locale: fr }),
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
      totalInterestPaid: totalInterestPaid,
      totalPrincipalPaid: totalPrincipalPaid
    });
  }

  return {
    monthlyPayment,
    totalInterest: totalInterestPaid,
    totalCost: amount + totalInterestPaid,
    amortizationSchedule: schedule
  };
}

/**
 * Formate un nombre en monnaie euro.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
