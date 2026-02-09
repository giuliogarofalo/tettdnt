# Algoritmi e Strutture Dati - Lezione Accelerata

## Partiamo dalla tua domanda: cosa significa O(1)?

Quando diciamo "l'accesso e l'inserimento sono **O(1)**", stiamo parlando di **quanto tempo ci mette** un'operazione a completarsi, indipendentemente dalla quantità di dati.

**O(1) = tempo costante.** Che tu abbia 10 elementi o 10 milioni, ci mette sempre lo stesso tempo.

Pensa a un **dizionario** (il libro vero): se sai che la parola inizia per "M", vai direttamente alla sezione M. Non devi leggere tutte le pagine dalla A. Questo è O(1).

---

## Big O Notation - La "Velocità" degli Algoritmi

Big O descrive **come scala** il tempo di esecuzione al crescere dei dati (n).

### Le complessità dalla più veloce alla più lenta:

```
O(1)        → Costante      → Istantaneo, sempre uguale
O(log n)    → Logaritmica   → Cresce lentissimamente
O(n)        → Lineare       → Cresce proporzionalmente
O(n log n)  → Linearitmica  → Tipica del sorting ottimale
O(n²)       → Quadratica    → Cresce molto velocemente
O(2ⁿ)       → Esponenziale  → Esplode, inutilizzabile su grandi input
```

### Tabella concreta con numeri reali:

| n | O(1) | O(log n) | O(n) | O(n log n) | O(n²) | O(2ⁿ) |
|---|------|----------|------|------------|-------|--------|
| 10 | 1 | 3 | 10 | 33 | 100 | 1.024 |
| 100 | 1 | 7 | 100 | 664 | 10.000 | 1.26 × 10³⁰ |
| 1.000 | 1 | 10 | 1.000 | 9.966 | 1.000.000 | ☠️ |
| 1.000.000 | 1 | 20 | 1.000.000 | 19.931.568 | 10¹² | ☠️ |

> **Regola pratica:** Se n può arrivare a 10⁶, devi stare sotto O(n log n). O(n²) è troppo lento.

---

## Come si calcola Big O?

### Regola 1: Conta i loop

```javascript
// Un loop → O(n)
for (let i = 0; i < n; i++) {
    doSomething();  // O(1) per iterazione
}

// Due loop annidati → O(n²)
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        doSomething();  // eseguito n × n volte
    }
}

// Due loop separati → O(n) + O(n) = O(n)  (si prende il dominante)
for (let i = 0; i < n; i++) { ... }
for (let j = 0; j < n; j++) { ... }
```

### Regola 2: Ignora le costanti

```javascript
// Questo è O(n), NON O(3n)
for (let i = 0; i < n; i++) { a(); }
for (let i = 0; i < n; i++) { b(); }
for (let i = 0; i < n; i++) { c(); }
// 3 loop separati su n → comunque O(n)
```

### Regola 3: Prendi solo il termine dominante

```
O(n² + n)     → O(n²)      // n² domina su n
O(n + log n)  → O(n)        // n domina su log n
O(n³ + n² + n) → O(n³)     // il più grande vince
```

### Regola 4: O(log n) = "dimezzi ogni volta"

```javascript
// Binary search → O(log n)
while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
}
// Su 1.000.000 di elementi servono solo ~20 passi!
```

---

## Le Strutture Dati Fondamentali

---

### 1. Array (Lista)

**Cos'è:** Sequenza ordinata di elementi, accesso per indice.

```javascript
const arr = [10, 20, 30, 40, 50];
arr[2];          // 30 → O(1) accesso diretto per indice
```

**Complessità:**

| Operazione | Complessità | Perché |
|-----------|-------------|--------|
| Accesso per indice `arr[i]` | **O(1)** | Indirizzo memoria = base + i × dimensione |
| Ricerca di un valore | **O(n)** | Devi scorrere tutto nel caso peggiore |
| Inserimento alla fine `.push()` | **O(1)** | Aggiunge in coda |
| Inserimento all'inizio `.unshift()` | **O(n)** | Deve spostare TUTTI gli elementi |
| Rimozione dalla fine `.pop()` | **O(1)** | Toglie l'ultimo |
| Rimozione dall'inizio `.shift()` | **O(n)** | Deve spostare tutti a sinistra |
| Ricerca in array ordinato (binary search) | **O(log n)** | Dimezza ogni volta |

**Analogia:** Un **treno** con vagoni numerati. Per andare al vagone 7, vai direttamente al vagone 7 (O(1)). Per trovare il vagone con il sedile rotto, devi controllare uno per uno (O(n)).

```javascript
// BUONO - O(1)
arr.push(60);     // Aggiunge alla fine
arr.pop();        // Rimuove dalla fine
arr[3];           // Accesso diretto

// LENTO - O(n)
arr.unshift(5);   // Inserisce all'inizio → sposta tutto!
arr.shift();      // Rimuove dall'inizio → sposta tutto!
arr.indexOf(30);  // Cerca 30 → scorre tutto
```

---

### 2. Object / Hash Map / Dizionario

**Cos'è:** Coppie chiave-valore. La chiave viene "hashata" per calcolare dove salvare il valore.

```javascript
const map = { "Bitcoin": 45000, "Ethereum": 3000 };
map["Bitcoin"];   // 45000 → O(1)!
```

**Come funziona internamente (semplificato):**
```
Chiave "Bitcoin" → hash("Bitcoin") → 7  → salva in posizione 7
Chiave "Ethereum" → hash("Ethereum") → 3 → salva in posizione 3

Lettura: hash("Bitcoin") → 7 → vai a posizione 7 → trovi 45000
```

Non devi cercare in tutto l'array: calcoli la posizione direttamente!

**Complessità:**

| Operazione | Media | Caso peggiore |
|-----------|-------|--------------|
| Accesso `obj[key]` | **O(1)** | O(n) collisioni |
| Inserimento `obj[key] = val` | **O(1)** | O(n) collisioni |
| Rimozione `delete obj[key]` | **O(1)** | O(n) collisioni |
| Verifica esistenza `key in obj` | **O(1)** | O(n) collisioni |

> **Caso peggiore O(n):** succede quando troppe chiavi hanno lo stesso hash ("collisione"). In pratica è rarissimo con buone funzioni hash. Per il colloquio: rispondi **O(1) in media**.

**Python `defaultdict` = stessa cosa:**
```python
groups = defaultdict(list)
groups["Warsaw"].append(photo)   # O(1) accesso + O(1) append
groups["Warsaw"]                 # O(1) lettura
```

**Analogia:** Un **armadietto con lucchetti a combinazione**. Ogni nome ha la sua combinazione (hash). Con la combinazione giusta, apri direttamente il cassetto giusto senza controllare tutti gli altri.

**Quando usarlo:**
- Contare frequenze: `counts[item] = (counts[item] || 0) + 1`
- Raggruppare: `groups[category].push(item)`
- Lookup veloci: "ho già visto questo elemento?"
- Cache / memoizzazione

---

### 3. Set (Insieme)

**Cos'è:** Come un Object, ma salva solo chiavi (senza valori). Niente duplicati.

```javascript
const seen = new Set();
seen.add("Bitcoin");    // O(1)
seen.has("Bitcoin");    // true → O(1)
seen.has("Dogecoin");   // false → O(1)
seen.add("Bitcoin");    // Non aggiunge duplicati
seen.size;              // 1
```

**Complessità:** Tutte le operazioni sono **O(1)** in media (come Object).

**Uso classico - trovare duplicati:**
```javascript
// LENTO - O(n²) con array
function hasDuplicates(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) return true;  // confronta ogni coppia
        }
    }
    return false;
}

// VELOCE - O(n) con Set
function hasDuplicates(arr) {
    return new Set(arr).size !== arr.length;
}
```

**Analogia:** Una **lista invitati** ad una festa. Puoi controllare istantaneamente se qualcuno è già in lista. Se provi ad aggiungere lo stesso nome, viene ignorato.

---

### 4. Stack (Pila) - LIFO

**Cos'è:** Last In, First Out. L'ultimo inserito è il primo ad uscire.

```
Immagina una pila di piatti:
  push → metti un piatto sopra
  pop  → togli il piatto in cima

    [4]  ← top (ultimo inserito, primo a uscire)
    [3]
    [2]
    [1]
```

```javascript
const stack = [];
stack.push(1);    // [1]
stack.push(2);    // [1, 2]
stack.push(3);    // [1, 2, 3]
stack.pop();      // 3 → [1, 2]
stack.pop();      // 2 → [1]
```

**Complessità:** push e pop sono entrambi **O(1)**.

**Uso reale:**
- Il browser "Back button" (stack di pagine visitate)
- Ctrl+Z (undo) - stack di azioni
- Validazione parentesi `({[]})`
- Call stack di JavaScript

**Esempio classico da colloquio - parentesi bilanciate:**
```javascript
function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', ']': '[', '}': '{' };

    for (const char of s) {
        if ('([{'.includes(char)) {
            stack.push(char);              // Aperta → push
        } else {
            if (stack.pop() !== pairs[char]) return false;  // Chiusa → pop e verifica
        }
    }
    return stack.length === 0;
}

isValid("({[]})");  // true
isValid("([)]");    // false
```

---

### 5. Queue (Coda) - FIFO

**Cos'è:** First In, First Out. Il primo inserito è il primo ad uscire.

```
Immagina la coda al supermercato:
  enqueue → una persona si mette in fondo
  dequeue → la prima persona viene servita

  front → [1] [2] [3] [4] ← back
          ↑ esce            ↑ entra
```

```javascript
const queue = [];
queue.push(1);      // enqueue: [1]
queue.push(2);      // enqueue: [1, 2]
queue.push(3);      // enqueue: [1, 2, 3]
queue.shift();      // dequeue: 1 → [2, 3]
```

> **Attenzione:** `shift()` in JS è O(n) perché sposta tutti gli elementi. Per una queue performante serve un'implementazione con linked list o indici.

**Uso reale:**
- Coda di stampa (primo documento inviato = primo stampato)
- BFS (Breadth-First Search) nei grafi/alberi
- Task queue di JavaScript (event loop)
- Buffer di messaggi

---

### 6. Linked List (Lista Concatenata)

**Cos'è:** Ogni nodo punta al successivo. Non c'è accesso diretto per indice.

```
Array:        [10] [20] [30] [40]    → accesso diretto arr[2] = 30

Linked List:  [10]→[20]→[30]→[40]→null   → per arrivare a 30, parti da 10
               head
```

```javascript
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

// 10 → 20 → 30
const head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);
```

**Complessità:**

| Operazione | Array | Linked List |
|-----------|-------|-------------|
| Accesso per indice | **O(1)** | O(n) |
| Inserimento all'inizio | O(n) | **O(1)** |
| Inserimento alla fine | **O(1)** | O(n)* |
| Inserimento nel mezzo (se hai il riferimento) | O(n) | **O(1)** |
| Ricerca | O(n) | O(n) |

*O(1) se mantieni un riferimento alla coda (tail).

**Analogia:** Un **trenino di vagoni** dove ogni vagone ha un gancio che lo collega al prossimo. Per aggiungere un vagone in mezzo, basta sganciare e riagganciare. Ma per trovare il vagone #50, devi partire dalla locomotiva e contare.

**Quando usarlo:** Quando fai molti inserimenti/rimozioni nel mezzo e pochi accessi per indice.

---

### 7. Tree (Albero) e Binary Search Tree (BST)

**Cos'è:** Struttura gerarchica. Ogni nodo ha figli. Nel BST: a sinistra valori minori, a destra maggiori.

```
        [8]              ← root
       /   \
     [3]   [10]
    /   \      \
  [1]   [6]   [14]
       /   \   /
     [4]  [7] [13]
```

**Cercare il 7:**
```
8 → 7 < 8, vai a sinistra
3 → 7 > 3, vai a destra
6 → 7 > 6, vai a destra
7 → trovato! (solo 4 passi su 9 nodi)
```

**Complessità BST bilanciato:**

| Operazione | Complessità |
|-----------|-------------|
| Ricerca | **O(log n)** |
| Inserimento | **O(log n)** |
| Rimozione | **O(log n)** |

> Ad ogni passo elimini metà dell'albero → O(log n).

**Uso reale:**
- DOM del browser (albero di nodi HTML)
- File system (cartelle → sottocartelle → file)
- Componenti React (albero di componenti)
- Database index (B-Tree)

---

## Gli Algoritmi di Sorting

| Algoritmo | Complessità media | Spazio | Stabile? | Note |
|-----------|-------------------|--------|----------|------|
| Bubble Sort | O(n²) | O(1) | Sì | Semplice ma lento, solo didattico |
| Selection Sort | O(n²) | O(1) | No | Sempre lento |
| Insertion Sort | O(n²) | O(1) | Sì | Veloce se quasi ordinato |
| **Merge Sort** | **O(n log n)** | O(n) | Sì | Sempre O(n log n), usa spazio extra |
| **Quick Sort** | **O(n log n)** | O(log n) | No | Il più usato, O(n²) nel caso peggiore |
| **Tim Sort** | **O(n log n)** | O(n) | Sì | Usato da JS `.sort()` e Python `sorted()` |

> **Per il colloquio:** Sappi che `.sort()` è O(n log n) e che non puoi fare meglio di O(n log n) con confronti.

### Quick Sort spiegato semplice:

```
[3, 6, 8, 10, 1, 2, 1]

1. Scegli un pivot (es: 6)
2. Partiziona: [minori di 6] [6] [maggiori di 6]
   → [3, 1, 2, 1] [6] [8, 10]
3. Ripeti ricorsivamente su ogni metà
4. Risultato: [1, 1, 2, 3, 6, 8, 10]
```

---

## Algoritmi di Ricerca

### Linear Search - O(n)
```javascript
// Scorre tutto finché non trova
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}
```

### Binary Search - O(log n) (solo su array ordinati!)
```javascript
function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;   // Cerca a destra
        else high = mid - 1;                      // Cerca a sinistra
    }
    return -1;
}

// Esempio: cerca 7 in [1, 3, 5, 7, 9, 11, 13]
// Passo 1: mid=7 → trovato! (1 solo passo)
// Su 1.000.000 elementi → max ~20 passi
```

**Analogia:** Cercare una parola nel **dizionario**. Apri a metà: se la parola viene prima, guardi la prima metà. Se viene dopo, la seconda. Ogni volta dimezzi le pagine da cercare.

---

## Pattern Algoritmici Comuni nei Colloqui

### 1. Two Pointers (Due Puntatori)

Usato per: array ordinati, rimuovere duplicati, trovare coppie.

```javascript
// Trova se esistono due numeri che sommano a target (array ordinato)
function twoSum(arr, target) {
    let left = 0, right = arr.length - 1;

    while (left < right) {
        const sum = arr[left] + arr[right];
        if (sum === target) return [left, right];
        if (sum < target) left++;    // Serve un numero più grande
        else right--;                 // Serve un numero più piccolo
    }
    return null;
}
// O(n) invece di O(n²) con due loop!
```

### 2. Sliding Window (Finestra Scorrevole)

Usato per: sottostringhe, somme contigue, max/min in sotto-array.

```javascript
// Trova la somma massima di k elementi consecutivi
function maxSubarraySum(arr, k) {
    let windowSum = 0;

    // Calcola la prima finestra
    for (let i = 0; i < k; i++) windowSum += arr[i];

    let maxSum = windowSum;

    // Scorri: aggiungi il nuovo, togli il vecchio
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];  // entra uno, esce uno
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
// O(n) invece di O(n×k) ricalcolando ogni volta!
```

### 3. Frequency Counter (Contatore di Frequenza)

Usato per: anagrammi, duplicati, frequenza caratteri.

```javascript
// Verifica se due stringhe sono anagrammi
function isAnagram(s1, s2) {
    if (s1.length !== s2.length) return false;

    const freq = {};
    for (const char of s1) freq[char] = (freq[char] || 0) + 1;
    for (const char of s2) {
        if (!freq[char]) return false;
        freq[char]--;
    }
    return true;
}
// O(n) con hash map invece di O(n log n) con sort!
```

---

## Tabella Riepilogativa Completa

### Strutture Dati

| Struttura | Accesso | Ricerca | Inserimento | Rimozione | Uso tipico |
|-----------|---------|---------|-------------|-----------|------------|
| **Array** | O(1) | O(n) | O(n)* | O(n)* | Dati ordinati, accesso per indice |
| **Object/HashMap** | O(1) | O(1) | O(1) | O(1) | Lookup, conteggi, raggruppamenti |
| **Set** | - | O(1) | O(1) | O(1) | Unicità, "già visto?" |
| **Stack** | O(n) | O(n) | O(1) | O(1) | Undo, validazione, DFS |
| **Queue** | O(n) | O(n) | O(1) | O(1) | Scheduling, BFS |
| **Linked List** | O(n) | O(n) | O(1)** | O(1)** | Inserimenti/rimozioni frequenti |
| **BST (bilanciato)** | O(log n) | O(log n) | O(log n) | O(log n) | Dati ordinati con inserimenti |

*O(1) alla fine con push/pop, O(n) all'inizio o nel mezzo
**O(1) se hai il riferimento al nodo, O(n) per trovarlo

### Algoritmi

| Algoritmo | Complessità | Quando usarlo |
|-----------|-------------|---------------|
| **Linear Search** | O(n) | Array non ordinato |
| **Binary Search** | O(log n) | Array ordinato |
| **Sort (generico)** | O(n log n) | Quando serve ordinamento |
| **Two Pointers** | O(n) | Array ordinato, coppie |
| **Sliding Window** | O(n) | Sotto-array contigui |
| **Frequency Counter** | O(n) | Conteggi, anagrammi |
| **BFS/DFS** | O(V + E) | Grafi, alberi |

---

## Domande da Colloquio - Algoritmi e Big O

- "Cos'è Big O notation?"
  > Descrive il **limite superiore** della crescita del tempo di esecuzione al crescere dell'input. Non misura il tempo esatto, ma **come scala**. O(n) non significa "n millisecondi", significa "se raddoppio l'input, il tempo raddoppia".

- "Qual è la differenza tra O(1) e O(n)?"
  > **O(1)** = tempo costante, non dipende dalla dimensione dell'input. Esempio: accesso per indice `arr[5]`. **O(n)** = tempo lineare, proporzionale alla dimensione. Esempio: cercare un valore in un array non ordinato.

- "Perché l'accesso a un Object/HashMap è O(1)?"
  > La chiave viene passata attraverso una **funzione hash** che calcola direttamente la posizione in memoria. Non serve scorrere tutti gli elementi. È come sapere esattamente in quale cassetto guardare.

- "Quando un algoritmo O(n²) è accettabile?"
  > Quando n è piccolo (< ~1000) o quando non esistono alternative migliori per il problema specifico. Per n grande, O(n²) diventa impraticabile: 10⁶ elementi = 10¹² operazioni.

- "Perché .sort() è O(n log n) e non O(n)?"
  > È dimostrato matematicamente che **nessun algoritmo basato su confronti** può fare meglio di O(n log n) nel caso medio. Il log n viene dal fatto che ad ogni confronto puoi al massimo dimezzare le possibilità (come binary search).

- "Qual è la differenza tra tempo e spazio?"
  > **Complessità temporale:** quante operazioni servono. **Complessità spaziale:** quanta memoria extra serve. Spesso c'è un trade-off: puoi risparmiare tempo usando più memoria (es. hash map per lookup O(1) invece di cercare in O(n)).

- "Spiega la differenza tra Array e LinkedList"
  > **Array:** accesso O(1) per indice, inserimento O(n) nel mezzo. Dati contigui in memoria → cache-friendly. **LinkedList:** accesso O(n), inserimento O(1) se hai il nodo. Dati sparsi in memoria. Usa array di default, linked list solo se fai molti inserimenti/rimozioni nel mezzo.

- "Cosa significa 'stabile' in un algoritmo di sorting?"
  > Un sort è **stabile** se elementi con lo stesso valore mantengono il loro **ordine relativo** originale. Esempio: se ordini studenti per voto e due hanno 8, un sort stabile li lascia nell'ordine in cui erano. JS `.sort()` è stabile dal 2019 (ECMAScript 2019).

- "Come scegli la struttura dati giusta?"
  > Chiediti: 1) Devo accedere per **indice**? → Array. 2) Devo cercare per **chiave**? → Object/Map. 3) Devo verificare **esistenza**? → Set. 4) Devo mantenere un **ordine LIFO**? → Stack. 5) Devo mantenere un **ordine FIFO**? → Queue. 6) Il dato è **gerarchico**? → Tree.
