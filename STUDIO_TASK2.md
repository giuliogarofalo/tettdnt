# RenamePhotos - Guida allo Studio

## Panoramica del Problema

**Input:** Una stringa con record di foto, ogni riga nel formato:
```
<nome_foto>.<estensione>, <citta>, yyyy-mm-dd hh:mm:ss
```

**Output:** Nuovi nomi delle foto nello **stesso ordine** dell'input, con formato:
```
<Citta><Numero>.<estensione>
```

**Regole chiave:**
- Raggruppare le foto per citta
- Ordinare cronologicamente all'interno di ogni gruppo
- Numerare da 1 in poi
- Padding con zeri (se 10 foto -> 01, 02... 10)
- Restituire nell'ordine originale

---

## Le 4 Sfide Principali

### Sfida 1: Parsing dell'Input
**Problema:** Estrarre correttamente citta, timestamp ed estensione da ogni riga.

**Insidie:**
- L'estensione puo essere `jpg`, `png`, o `jpeg` (lunghezze diverse)
- Il nome del file potrebbe contenere punti (es: `my.photo.jpg`)

**Soluzione:** Usare `split('.').pop()` per prendere l'ULTIMA parte dopo il punto.

```javascript
const extension = filename.split('.').pop();  // Prende sempre l'estensione corretta
```

---

### Sfida 2: Mantenere l'Ordine Originale
**Problema:** Dopo aver raggruppato e ordinato, devi restituire i risultati nell'ordine originale dell'input.

**Soluzione:** Salvare l'indice originale di ogni foto e usarlo per ricostruire l'array finale.

```javascript
// Durante il parsing, salva l'indice
const photos = lines.map((line, index) => {
    return { index: index, city, timestamp, extension };
});

// Alla fine, usa l'indice per posizionare il risultato
result[photo.index] = newName;
```

---

### Sfida 3: Ordinamento per Timestamp
**Problema:** Ordinare le foto cronologicamente all'interno di ogni citta.

**Perche funziona il confronto di stringhe:**
Il formato `yyyy-mm-dd hh:mm:ss` e progettato per essere ordinabile lessicograficamente:
- `2013-09-05` viene prima di `2016-01-02` perche "2013" < "2016"
- `14:07:13` viene prima di `14:08:15` perche "07" < "08"

```javascript
group.sort((a, b) => {
    if (a.timestamp < b.timestamp) return -1;
    if (a.timestamp > b.timestamp) return 1;
    return 0;
});
```

---

### Sfida 4: Padding Dinamico dei Numeri
**Problema:** Il padding dipende dal numero totale di foto per citta.
- 9 foto -> 1 cifra (1, 2, 3...)
- 10-99 foto -> 2 cifre (01, 02... 99)
- 100+ foto -> 3 cifre (001, 002...)

**Soluzione:**
```javascript
const padLength = String(group.length).length;  // 10 -> "10".length = 2

let number = String(i + 1);
while (number.length < padLength) {
    number = '0' + number;
}
```

---

## I 4 Step della Soluzione

### Step 1: Parse
```javascript
const photos = lines.map((line, index) => {
    const parts = line.split(', ');
    return {
        index: index,
        city: parts[1],
        timestamp: parts[2],
        extension: parts[0].split('.').pop()
    };
});
```

### Step 2: Raggruppa per Citta
```javascript
const cityGroups = {};
for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    if (!cityGroups[photo.city]) {
        cityGroups[photo.city] = [];
    }
    cityGroups[photo.city].push(photo);
}
```

### Step 3: Ordina e Assegna Numeri
```javascript
const cities = Object.keys(cityGroups);
for (let c = 0; c < cities.length; c++) {
    const city = cities[c];
    const group = cityGroups[city];

    group.sort((a, b) => a.timestamp < b.timestamp ? -1 : 1);

    const padLength = String(group.length).length;
    group.forEach((photo, i) => {
        let number = String(i + 1);
        while (number.length < padLength) number = '0' + number;
        result[photo.index] = city + number + '.' + photo.extension;
    });
}
```

### Step 4: Ricostruisci Output
```javascript
return result.join('\n');
```

---

## Domande Probabili all'Interview

### Domande sulla Soluzione

**Q: Perche hai usato un oggetto per raggruppare invece di un array?**
> R: L'oggetto permette accesso O(1) per chiave (citta). Con un array dovrei cercare ogni volta se la citta esiste gia -> O(n).

**Q: Perche il confronto di stringhe funziona per le date?**
> R: Il formato ISO 8601 (yyyy-mm-dd hh:mm:ss) e progettato per essere lessicograficamente ordinabile. Le parti piu significative (anno) vengono prima.

**Q: Come gestisci il caso di input vuoto?**
> R: Controllo all'inizio: `if (!S || S.length === 0) return "";`

**Q: Qual e la complessita temporale?**
> R: O(n log n) dove n = numero totale di foto. Il collo di bottiglia e l'ordinamento dei gruppi.

**Q: Perche salvi l'indice originale?**
> R: Perche l'output deve mantenere lo stesso ordine dell'input, ma devo raggruppare e ordinare per elaborare correttamente.

### Domande su Edge Cases

**Q: Cosa succede se due foto hanno lo stesso timestamp?**
> R: Il problema garantisce che non ci sono duplicati nella stessa citta. Tra citta diverse e permesso (fusi orari).

**Q: E se il nome del file contiene piu punti?**
> R: Uso `split('.').pop()` che prende solo l'ultima parte, quindi `my.photo.jpg` -> `jpg`.

**Q: E se c'e una sola foto in una citta?**
> R: padLength = 1, quindi nessun padding. Es: `Paris1.jpg`

---

## Soluzioni Alternative

### Alternativa 1: Usare Map invece di Object
```javascript
const cityGroups = new Map();
photos.forEach(photo => {
    if (!cityGroups.has(photo.city)) {
        cityGroups.set(photo.city, []);
    }
    cityGroups.get(photo.city).push(photo);
});
```
**Pro:** Mantiene l'ordine di inserimento, metodi piu puliti.
**Contro:** Sintassi leggermente piu verbosa.

### Alternativa 2: Usare reduce per raggruppare
```javascript
const cityGroups = photos.reduce((groups, photo) => {
    (groups[photo.city] = groups[photo.city] || []).push(photo);
    return groups;
}, {});
```
**Pro:** Piu funzionale, una sola riga.
**Contro:** Meno leggibile per chi non conosce reduce.

### Alternativa 3: Ordinare una volta sola
Invece di ordinare ogni gruppo separatamente, ordinare tutte le foto per (citta, timestamp) e poi processare:
```javascript
photos.sort((a, b) => {
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    return a.timestamp.localeCompare(b.timestamp);
});
```
**Pro:** Un solo sort.
**Contro:** Devi comunque raggruppare per calcolare il padding.

### Alternativa 4: padStart invece del while loop
```javascript
const number = String(i + 1).padStart(padLength, '0');
```
**Pro:** Piu pulito e moderno.
**Contro:** Potrebbe non essere supportato in ambienti JS vecchi.

---

## Complessita

| Operazione | Complessita |
|------------|-------------|
| Parsing | O(n) |
| Raggruppamento | O(n) |
| Ordinamento | O(n log n) nel caso peggiore |
| Assegnazione numeri | O(n) |
| **Totale** | **O(n log n)** |

**Spazio:** O(n) per gli array ausiliari.

---

## Soluzione in Python (Elegante)

Python rende questo problema molto più pulito grazie a `defaultdict`, `sorted`, list comprehension e `str.zfill`.

### Soluzione completa

```python
from collections import defaultdict

def solution(S):
    if not S:
        return ""

    # Step 1: Parse
    photos = []
    for i, line in enumerate(S.split('\n')):
        filename, city, timestamp = line.split(', ')
        ext = filename.rsplit('.', 1)[1]  # rsplit prende l'ultima estensione
        photos.append((i, city.strip(), timestamp.strip(), ext.strip()))

    # Step 2: Raggruppa per città
    groups = defaultdict(list)
    for photo in photos:
        groups[photo[1]].append(photo)

    # Step 3: Ordina ogni gruppo per timestamp e assegna numeri
    result = [''] * len(photos)
    for city, group in groups.items():
        group.sort(key=lambda p: p[2])  # Ordina per timestamp
        pad = len(str(len(group)))      # Cifre necessarie per il padding
        for num, (orig_idx, city, _, ext) in enumerate(group, 1):
            result[orig_idx] = f"{city}{str(num).zfill(pad)}.{ext}"

    return '\n'.join(result)
```

### Perché è più elegante di JavaScript?

| Aspetto | JavaScript | Python |
|---------|-----------|--------|
| **Raggruppamento** | Ciclo for manuale con check `if (!obj[key])` | `defaultdict(list)` - una riga |
| **Estensione** | `split('.').pop()` | `rsplit('.', 1)[1]` - più esplicito |
| **Padding** | `while` loop o `padStart` | `str.zfill(pad)` - built-in |
| **Ordinamento** | `sort` con comparator `(a, b) => ...` | `sort(key=lambda)` - più leggibile |
| **String format** | Concatenazione `city + number + '.' + ext` | f-string `f"{city}{num}.{ext}"` |
| **Destructuring** | Non disponibile nei for loop | `for num, (idx, city, _, ext)` nel loop |
| **Enumerazione** | Indice manuale `i + 1` | `enumerate(group, 1)` - parte da 1 |

### Versione ultra-compatta (one-liner style)

```python
from collections import defaultdict

def solution(S):
    if not S:
        return ""

    photos = [
        (i, *line.split(', '))
        for i, line in enumerate(S.split('\n'))
    ]  # [(0, 'photo.jpg', 'Warsaw', '2013-09-05 14:08:15'), ...]

    groups = defaultdict(list)
    for i, filename, city, ts in photos:
        groups[city].append((i, filename.rsplit('.', 1)[1], ts))

    result = [''] * len(photos)
    for city, group in groups.items():
        group.sort(key=lambda x: x[2])
        pad = len(str(len(group)))
        for num, (idx, ext, _) in enumerate(group, 1):
            result[idx] = f"{city}{str(num).zfill(pad)}.{ext}"

    return '\n'.join(result)
```

### Trucchi Python da conoscere per il colloquio

**1. `defaultdict` vs dizionario normale:**
```python
# Senza defaultdict (come in JavaScript)
groups = {}
if city not in groups:
    groups[city] = []
groups[city].append(photo)

# Con defaultdict - automatico!
groups = defaultdict(list)
groups[city].append(photo)  # Crea la lista se non esiste
```

**2. `rsplit` vs `split` per l'estensione:**
```python
# split('.') su "my.photo.jpg" → ['my', 'photo', 'jpg'] poi .pop()
# rsplit('.', 1) su "my.photo.jpg" → ['my.photo', 'jpg'] - più diretto!
filename.rsplit('.', 1)[1]  # Splitta da DESTRA, max 1 volta
```

**3. `enumerate` con start:**
```python
# JavaScript: group.forEach((photo, i) => { num = i + 1; })
# Python:
for num, photo in enumerate(group, 1):  # num parte da 1, non da 0!
    ...
```

**4. `zfill` per padding con zeri:**
```python
# JavaScript: while (number.length < padLength) number = '0' + number;
# Python:
str(5).zfill(3)  # → '005'
str(42).zfill(3) # → '042'
```

**5. Unpacking nelle tuple:**
```python
# JavaScript: const { index, city, ext } = photo;
# Python - direttamente nel for:
for num, (orig_idx, city, _, ext) in enumerate(group, 1):
    # _ ignora il valore del timestamp (non serve qui)
```

### Domande potenziali sulla versione Python

- "Perché `defaultdict` invece di un dizionario normale?"
  > Elimina il boilerplate del check `if key not in dict`. Quando accedi a una chiave inesistente, `defaultdict(list)` crea automaticamente una lista vuota. Più pulito e meno soggetto a errori.

- "Perché `rsplit` invece di `split`?"
  > `rsplit('.', 1)` splitta **da destra** con un limite di 1 split. Per `"my.photo.jpg"` produce `['my.photo', 'jpg']` mentre `split('.')` produce `['my', 'photo', 'jpg']`. `rsplit` è più robusto per nomi file con punti multipli.

- "Perché `enumerate(group, 1)` e non range?"
  > `enumerate` fornisce sia l'**indice** che l'**elemento** in un colpo solo. Il parametro `1` fa partire il conteggio da 1 invece che da 0, evitando il `+1` manuale. È più pythonico e meno soggetto a errori off-by-one.

- "Qual è la complessità di `defaultdict`?"
  > L'accesso e l'inserimento sono **O(1)** in media (come un dizionario normale). Il vantaggio è puramente sintattico, non prestazionale.

- "Come gestiresti timestamp duplicati nella stessa città?"
  > Il problema garantisce unicità, ma se servisse: si potrebbe aggiungere l'indice originale come tiebreaker nel `sort`: `key=lambda x: (x[2], x[0])`. Così foto con lo stesso timestamp vengono ordinate per posizione originale.

---

## Errori Comuni da Evitare

1. **Confondere `photo` con `photos`** - Errore di battitura classico
2. **Dimenticare di salvare l'indice originale** - L'output sarebbe nell'ordine sbagliato
3. **Usare l'indice del loop invece del nome della citta** - `cityGroups[c]` vs `cityGroups[cities[c]]`
4. **Non gestire l'input vuoto** - Potrebbe causare errori
5. **Shorthand object syntax** - `{index}` vs `{index: index}` - alcuni ambienti non lo supportano




Example test:   'photo.jpg, Warsaw, 2013-09-05 14:08:15\nJay.png, London, 2015-06-20 15:13:22\nmyFriends.png, Warsaw, 2013-09-05 14:07:13\nEiffel.jpg, Paris, 2015-07-23 08:03:02\npisatower.jpg, Paris, 2015-07-22 23:59:59\nBOB.jpg, London, 2015-08-05 00:02:03\nnotredame.png, Paris, 2015-09-01 12:00:00\nme.jpg, Warsaw, 2013-09-06 15:40:22\na.png, Warsaw, 2016-02-13 13:33:50\nb.jpg, Warsaw, 2016-01-02 15:12:22\nc.jpg, Warsaw, 2016-01-02 14:34:30\nd.jpg, Warsaw, 2016-01-02 15:15:01\ne.png, Warsaw, 2016-01-02 09:49:09\nf.png, Warsaw, 2016-01-02 10:55:32\ng.jpg, Warsaw, 2016-02-29 22:13:11'
OK

Your test case: ['photo.jpg, Warsaw, 2013-09-05 14:08:15\nJay.png, London, 2015-06-20 15:13:22\nmyFriends.png, Warsaw, 2013-09-05 14:07:13\nEiffel.jpg, Paris, 2015-07-23 08:03:02\npisatower.jpg, Paris, 2015-07-22 23:59:59\nBOB.jpg, London, 2015-08-05 00:02:03\nnotredame.png, Paris, 2015-09-01 12:00:00\nme.jpg, Warsaw, 2013-09-06 15:40:22\na.png, Warsaw, 2016-02-13 13:33:50\nb.jpg, Warsaw, 2016-01-02 15:12:22\nc.jpg, Warsaw, 2016-01-02 14:34:30\nd.jpg, Warsaw, 2016-01-02 15:15:01\ne.png, Warsaw, 2016-01-02 09:49:09\nf.png, Warsaw, 2016-01-02 10:55:32\ng.jpg, Warsaw, 2016-02-29 22:13:11']
Returned value: 'Warsaw02.jpg\nLondon1.png\nWarsaw01.png\nParis2.jpg\nParis1.jpg\nLondon2.jpg\nParis3.png\nWarsaw03.jpg\nWarsaw09.png\nWarsaw07.jpg\nWarsaw06.jpg\nWarsaw08.jpg\nWarsaw04.png\nWarsaw05.png\nWarsaw10.jpg'

Your code is syntactically correct and works properly on the example test.
Note that the example tests are not part of your score. On submission at least 8 test cases not shown here will assess your solution.