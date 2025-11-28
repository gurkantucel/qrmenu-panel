const currency = (amount: number,currency?:string) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency ?? 'TRY' }).format(amount);
};

export default currency;
