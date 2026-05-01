type Unit = 'kg' | 'hg' | 'dag' | 'g' | 'dg' | 'cg' | 'mg';

export interface intDose{
  amount: number,
  unit: Unit;
}