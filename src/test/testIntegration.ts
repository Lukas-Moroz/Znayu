import { getCaseForm, getVerbForm, buildPhrase, wordExists, getNormalForm } from '../utils/russianDictionary';
import { generateSentence, canGenerateSentences, generateSentences } from '../utils/sentenceGenerator';
import { speak, isRussianSupported, checkAndAlertTTS } from '../services/audioService';

// Test dictionary
console.log('Testing dictionary...');
console.log('getCaseForm("книга", "accusative"):', getCaseForm('книга', 'accusative')); // Expected: книгу
console.log('getVerbForm("читать", "я"):', getVerbForm('читать', 'я')); // Expected: читаю
console.log('buildPhrase("я", "читать", "книга"):', buildPhrase('я', 'читать', 'книга')); // Expected: Я читаю книгу
console.log('wordExists("книга"):', wordExists('книга')); // Expected: true
console.log('getNormalForm("книгу"):', getNormalForm('книгу')); // Expected: книга (approximate)

// Test sentence generator
console.log('\nTesting sentence generator...');
const userVocab = ['читать', 'книга', 'смотреть', 'фильм'];
console.log('canGenerateSentences:', canGenerateSentences(userVocab)); // Expected: true
const sentence = generateSentence(userVocab, 'easy');
console.log('Generated sentence:', sentence); // Expected: Я читаю книгу or similar
const sentences = generateSentences(userVocab, 3, 'easy');
console.log('Generated multiple sentences:', sentences);

// Test audio (async - will speak if TTS is available)
console.log('\nTesting audio...');
try {
  const supported = await isRussianSupported();
  console.log('Russian TTS supported:', supported);
  
  if (supported) {
    await speak('Здравствуйте'); // Speaks Russian!
    console.log('Audio test completed successfully');
  } else {
    console.log('Russian TTS not available on this device');
    await checkAndAlertTTS(); // Will show alert on mobile devices
  }
} catch (error) {
  console.error('Audio test failed:', error);
}