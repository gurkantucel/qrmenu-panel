import CryptoJS from 'crypto-js';

/**
 * AES-256-CBC ile encrypt et
 * - Rastgele IV üretir (16 byte)
 * - IV'yi ciphertext'in başına ekler
 * - Sonucu Base64 encode yapar
 */
export function encryptData(plaintext: string, keyStr: string): string {
  // Key'i UTF-8 parse et (32 karakterli sabit key)
  const key = CryptoJS.enc.Utf8.parse(keyStr);

  // 16 byte rastgele IV üret (WordArray olarak)
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt et
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Ciphertext ve IV'yi al (WordArray)
  const ciphertextWords = CryptoJS.enc.Base64.parse(encrypted.ciphertext.toString(CryptoJS.enc.Base64));
  const ivWords = iv;

  // IV + ciphertext birleştir
  const combined = ivWords.clone();
  combined.concat(ciphertextWords);

  // Base64 encode ederek döndür
  return CryptoJS.enc.Base64.stringify(combined);
}

/**
 * AES-256-CBC ile decrypt et
 * - Base64 kodlu veri alır
 * - İlk 16 byte'ı IV olarak ayırır
 * - Kalanı ciphertext olarak kullanır
 */
export function decryptData(encryptedBase64: string, keyStr: string): string {
  // Base64 decode
  const decoded = CryptoJS.enc.Base64.parse(encryptedBase64);

  // IV ve ciphertext ayır
  const iv = CryptoJS.lib.WordArray.create(decoded.words.slice(0, 4)); // 16 byte IV
  const ciphertext = CryptoJS.lib.WordArray.create(decoded.words.slice(4), decoded.sigBytes - 16);

  // Key'i UTF-8 parse et
  const key = CryptoJS.enc.Utf8.parse(keyStr);

  // Decrypt et
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext } as any,
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // UTF-8 string olarak döndür
  return decrypted.toString(CryptoJS.enc.Utf8);
}