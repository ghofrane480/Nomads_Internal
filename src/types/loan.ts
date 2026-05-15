export interface LoanInputs {
  amount: number;
  annualRate: number;
  durationYears: number;
  startDate: string;
}

export interface AmortizationRow {
  period: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

export interface LoanResults {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule: AmortizationRow[];
}
