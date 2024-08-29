"use server"


export const generateQRCodeAction = async (upiId: string, amount: string) => {
  let error: undefined | string = undefined;
  let qrCodeUrl: undefined | string = undefined;

  if (!upiId || !amount) {
    error = 'Please enter both UPI ID and amount.';
    console.log(error);
    qrCodeUrl = undefined;
    // return;
  } 
  if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
    error = 'Invalid UPI ID format.'
    console.log(error);
    qrCodeUrl = undefined;
    return;
  }
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    error = 'Please enter a valid amount.';
    console.log(error);
    qrCodeUrl = undefined;
    return;
  }

  const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`
  error = undefined;
  qrCodeUrl = upiUrl;

  return {
    qrCodeUrl,
    error
  }
}