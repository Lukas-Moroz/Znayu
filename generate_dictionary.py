"""
Russian Dictionary Generator using pymorphy2
Creates a complete JSON dictionary with all word forms, cases, and conjugations

Setup:
pip install pymorphy2 pymorphy2-dicts-ru

Usage:
python generate_dictionary.py

Output: 
russian_dictionary.json - Place in src/data/
"""

import pymorphy2
import json

morph = pymorphy2.MorphAnalyzer()

# Complete vocabulary from your app
VOCABULARY = [
    # Module 0 - Alphabet examples
    'Анна', 'библиотека', 'вторник', 'говорить', 'дом', 'день',
    'ёлка', 'жить', 'зима', 'имя', 'мой', 'кот', 'лампа', 'мама',
    'нет', 'окно', 'папа', 'рука', 'сын', 'там', 'утро', 'фильм',
    'хорошо', 'цирк', 'час', 'школа', 'борщ', 'объект', 'мы',
    'это', 'юг', 'я',
    
    # Module 1 - Greetings
    'Здравствуйте', 'студент', 'студентка', 'американец', 
    'американка', 'жить', 'университет',
    
    # Module 2 - Family
    'папа', 'мама', 'брат', 'сестра', 'работать', 
    'врач', 'учительница', 'дом',
    
    # Module 3 - Hobbies
    'читать', 'книга', 'смотреть', 'фильм', 'слушать',
    'музыка', 'любить', 'ходить', 'кино', 'футбол',
    
    # Food Pack
    'кафе', 'ресторан', 'столовая', 'меню', 'счёт', 'официант',
    
    # Common words for sentence generation
    'я', 'ты', 'он', 'она', 'мы', 'вы', 'они',
    'в', 'на', 'с', 'к', 'у', 'о',
    'и', 'а', 'но',
    'хотеть', 'мочь', 'знать', 'думать', 'говорить',
    'большой', 'маленький', 'хороший', 'плохой', 'новый', 'старый',
]

def get_word_info(word):
    """Get comprehensive morphological info for a word"""
    parsed = morph.parse(word)[0]
    
    result = {
        'word': word,
        'normal_form': parsed.normal_form,
        'pos': str(parsed.tag.POS),
        'gender': str(parsed.tag.gender) if parsed.tag.gender else None,
        'animacy': str(parsed.tag.animacy) if parsed.tag.animacy else None,
        'aspect': str(parsed.tag.aspect) if parsed.tag.aspect else None,
    }
    
    # Add case forms for nouns, adjectives, pronouns
    if parsed.tag.POS in ['NOUN', 'ADJF', 'NPRO']:
        result['cases'] = generate_cases(parsed)
    
    # Add conjugations for verbs
    if parsed.tag.POS in ['INFN', 'VERB']:
        result['conjugations'] = generate_conjugations(parsed)
    
    # Add comparison forms for adjectives
    if parsed.tag.POS == 'ADJF':
        result['comparison'] = generate_comparison(parsed)
    
    return result

def generate_cases(parsed):
    """Generate all case forms (singular and plural)"""
    cases = {}
    case_tags = [
        ('nomn', 'nominative'),
        ('gent', 'genitive'),
        ('datv', 'dative'),
        ('accs', 'accusative'),
        ('ablt', 'instrumental'),
        ('loct', 'prepositional'),
    ]
    
    for tag, name in case_tags:
        cases[name] = {}
        
        # Singular
        sing = parsed.inflect({tag, 'sing'})
        cases[name]['singular'] = sing.word if sing else None
        
        # Plural
        plur = parsed.inflect({tag, 'plur'})
        cases[name]['plural'] = plur.word if plur else None
    
    return cases

def generate_conjugations(parsed):
    """Generate verb conjugations"""
    conjugations = {}
    
    # Present/Future tense
    persons = [
        (('1per', 'sing'), 'я'),
        (('2per', 'sing'), 'ты'),
        (('3per', 'sing'), 'он_она'),
        (('1per', 'plur'), 'мы'),
        (('2per', 'plur'), 'вы'),
        (('3per', 'plur'), 'они'),
    ]
    
    conjugations['present'] = {}
    for tags, pronoun in persons:
        # Try present tense first
        form = parsed.inflect(set(tags) | {'pres'})
        if not form:
            # Try future for perfective verbs
            form = parsed.inflect(set(tags) | {'futr'})
        
        if form:
            conjugations['present'][pronoun] = form.word
    
    # Past tense
    conjugations['past'] = {}
    genders = [
        (('past', 'masc', 'sing'), 'он'),
        (('past', 'femn', 'sing'), 'она'),
        (('past', 'neut', 'sing'), 'оно'),
        (('past', 'plur'), 'они'),
    ]
    
    for tags, pronoun in genders:
        form = parsed.inflect(set(tags))
        if form:
            conjugations['past'][pronoun] = form.word
    
    # Imperative
    conjugations['imperative'] = {}
    imp_sing = parsed.inflect({'impr', 'sing'})
    imp_plur = parsed.inflect({'impr', 'plur'})
    
    if imp_sing:
        conjugations['imperative']['ты'] = imp_sing.word
    if imp_plur:
        conjugations['imperative']['вы'] = imp_plur.word
    
    return conjugations

def generate_comparison(parsed):
    """Generate comparative and superlative forms for adjectives"""
    comparison = {}
    
    comp = parsed.inflect({'COMP'})
    if comp:
        comparison['comparative'] = comp.word
    
    # Superlative (самый + adjective)
    comparison['superlative'] = f"самый {parsed.word}"
    
    return comparison

# Generate dictionary
print("🔄 Generating Russian dictionary...")
dictionary = {}
errors = []

for i, word in enumerate(VOCABULARY, 1):
    try:
        print(f"[{i}/{len(VOCABULARY)}] Processing: {word}")
        dictionary[word] = get_word_info(word)
    except Exception as e:
        print(f"❌ Error with '{word}': {e}")
        errors.append((word, str(e)))

# Save as JSON
output_file = 'russian_dictionary.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(dictionary, f, ensure_ascii=False, indent=2)

print(f"\n✅ Generated dictionary with {len(dictionary)} words!")
print(f"📁 Saved to: {output_file}")

if errors:
    print(f"\n⚠️  {len(errors)} errors occurred:")
    for word, error in errors:
        print(f"   - {word}: {error}")
else:
    print("✨ No errors!")

# Print sample entry
print("\n📖 Sample entry (книга):")
if 'книга' in dictionary:
    print(json.dumps(dictionary['книга'], ensure_ascii=False, indent=2))

print("\n🎯 Next steps:")
print("1. Copy 'russian_dictionary.json' to your app's src/data/ folder")
print("2. Import it in your React Native code")
print("3. Use the helper functions to access word forms")