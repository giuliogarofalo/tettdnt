# Task 1: Cryptocurrencies Exchange Platform - Guida di Studio

## Panoramica del Progetto

Un'applicazione React per acquistare criptovalute con:
- **Tabella** con lista crypto e paginazione
- **Carrello** (basket) per gestire acquisti
- **Dialog** per dettagli crypto
- **Lista ordini** salvati

### Architettura dei File

```
app.jsx           → Componente root, Context Provider, stato ordini
├── cryptoBuy.jsx     → Logica principale (API, basket, pagination)
│   ├── cryptoTable.jsx   → Tabella con paginazione MUI
│   ├── cryptoBasket.jsx  → Carrello con calcoli
│   └── cryptoDetails.jsx → Dialog dettagli
├── orders.jsx        → Lista ordini da context
└── context.js        → React Context
```

---

## I 15 TEST - Analisi Completa

---

### TEST 1: Page Change (Paginazione)

**Cosa testa:** La paginazione della tabella funziona correttamente

**File coinvolti:** `cryptoBuy.jsx`, `cryptoTable.jsx`

**Bug #1 - useEffect senza dipendenza:**
```javascript
// SBAGLIATO
React.useEffect(() => {
  getData();
}, []);  // Array vuoto = esegue solo al mount

// CORRETTO
React.useEffect(() => {
  getData();
}, [page]);  // Riesegue quando 'page' cambia
```

**Bug #2 - Signature handlePageChange:**
```javascript
// SBAGLIATO - MUI passa (event, newPage), non solo newPage
const handlePageChange = newPage => {
  setPage(newPage);
};

// CORRETTO
const handlePageChange = (event, newPage) => {
  setPage(newPage);
};
```

**Concetti React:**
- `useEffect` dependencies array
- Come funziona il re-render quando cambia lo stato
- API di MUI TablePagination

**Domande potenziali:**
- "Cosa succede se useEffect ha un array di dipendenze vuoto?"
- "Perché MUI passa l'event come primo parametro?"

---

### TEST 2: MarginLeft Button

**Cosa testa:** Il bottone "Details" ha `marginLeft: 20px`

**File:** `cryptoTable.jsx`

**Bug - CSS property case-sensitive:**
```javascript
// SBAGLIATO - CSS-in-JS usa camelCase!
style={{ marginleft: '20px' }}

// CORRETTO
style={{ marginLeft: '20px' }}
```

**Concetti React:**
- CSS-in-JS (inline styles in React)
- camelCase per proprietà CSS in JSX
- Differenza tra CSS normale (`margin-left`) e JSX (`marginLeft`)

**Domande potenziali:**
- "Perché React usa camelCase per le proprietà CSS?"
- "Quali sono le differenze tra inline styles e className in React?"

---

### TEST 3: Green Color per Price < 100

**Cosa testa:** I nomi delle crypto con prezzo < 100 sono verdi

**File:** `cryptoTable.jsx`

**Bug - Mancava la logica condizionale:**
```javascript
// SBAGLIATO - Nessuno stile condizionale
<TableCell component="th" scope="row">
  {row.name}
</TableCell>

// CORRETTO
<TableCell
  component="th"
  scope="row"
  style={{ color: row.price < 100 ? 'green' : 'inherit' }}
>
  {row.name}
</TableCell>
```

**Concetti React:**
- Conditional rendering/styling
- Ternary operator in JSX
- `inherit` come valore CSS di fallback

**Domande potenziali:**
- "Come applichi stili condizionali in React?"
- "Cosa fa `inherit` come valore CSS?"

---

### TEST 4: HandleOpen passa Currency

**Cosa testa:** Cliccando "Details" si apre il dialog con la crypto corretta

**File:** `cryptoTable.jsx`

**Bug - Callback senza parametro:**
```javascript
// SBAGLIATO - handleOpen viene chiamato senza argomenti
onClick={handleOpen}

// CORRETTO - Passa l'oggetto row
onClick={() => handleOpen(row)}
```

**Concetti React:**
- Event handlers e closures
- Arrow functions per passare parametri
- Differenza tra `onClick={fn}` e `onClick={() => fn(arg)}`

**Domande potenziali:**
- "Perché usiamo una arrow function invece di passare direttamente handleOpen?"
- "Cosa succede se scrivi `onClick={handleOpen(row)}`?" (si esegue subito!)

---

### TEST 5: axios.get invece di .post

**Cosa testa:** La chiusura del dialog fa una GET request

**File:** `cryptoBuy.jsx`

**Bug - Metodo HTTP sbagliato:**
```javascript
// SBAGLIATO
axios.post(API_URL_CLOSE_EVENT + currency.id)

// CORRETTO
axios.get(API_URL_CLOSE_EVENT + currency.id)
```

**Concetti:**
- Metodi HTTP (GET vs POST)
- GET = leggere/notificare, POST = creare/modificare
- API RESTful conventions

**Domande potenziali:**
- "Quando usi GET vs POST?"
- "Perché un close_event usa GET?" (è una notifica, non crea risorse)

---

### TEST 6: setCloseError nel catch

**Cosa testa:** Se la close request fallisce, mostra "Try again"

**File:** `cryptoBuy.jsx`

**Bug - Mancava setCloseError(true):**
```javascript
// SBAGLIATO
.catch(() => {
  setOpen(false);
});

// CORRETTO
.catch(() => {
  setCloseError(true);  // Mostra il messaggio di errore
  setOpen(false);
});
```

**Concetti React:**
- Error handling con Promises
- Gestione dello stato di errore
- UX: feedback all'utente quando qualcosa fallisce

**Domande potenziali:**
- "Come gestisci gli errori delle API in React?"
- "Perché è importante mostrare feedback di errore all'utente?"

---

### TEST 7: JSX Interpolation {response?.description}

**Cosa testa:** Il dialog mostra la descrizione della crypto

**File:** `cryptoDetails.jsx`

**Bug - Mancavano le graffe JSX:**
```javascript
// SBAGLIATO - Questo renderizza la stringa letterale "response?.description"
<DialogContentText>response?.description</DialogContentText>

// CORRETTO - Le graffe {} interpolano il valore JavaScript
<DialogContentText>{response?.description}</DialogContentText>
```

**Concetti React:**
- JSX expressions con `{}`
- Optional chaining `?.`
- Differenza tra testo statico e espressioni dinamiche

**Domande potenziali:**
- "Cosa fa l'optional chaining `?.`?"
- "Quando usi le graffe `{}` in JSX?"

---

### TEST 8: useEffect con [currency]

**Cosa testa:** Aprendo un'altra crypto, si caricano i nuovi dettagli

**File:** `cryptoDetails.jsx`

**Bug - useEffect senza dipendenza currency:**
```javascript
// SBAGLIATO - Carica i dati solo una volta
React.useEffect(() => {
  if (currency?.id) { getData(); }
}, []);

// CORRETTO - Ricarica quando cambia la currency
React.useEffect(() => {
  if (currency?.id) { getData(); }
}, [currency]);
```

**Concetti React:**
- useEffect dependencies
- Quando un effect deve rieseguire
- Stale data problem

**Domande potenziali:**
- "Cosa succede se non metti currency nelle dipendenze?"
- "Come decidi cosa mettere nell'array di dipendenze?"

---

### TEST 9: HandleBuy - Check se esiste

**Cosa testa:** Cliccando "Buy" su una crypto già nel carrello, non aumenta la quantità

**File:** `cryptoBuy.jsx`

**Bug - Mancava il check:**
```javascript
// SBAGLIATO - Sovrascrive sempre con quantity: 1
const handleBuy = currency => {
  setBasket({
    ...basket,
    [currency.name]: { quantity: 1, price: currency.price },
  });
};

// CORRETTO - Se esiste, non fare nulla
const handleBuy = currency => {
  if (basket[currency.name]) return;  // Early return
  setBasket({
    ...basket,
    [currency.name]: { quantity: 1, price: currency.price },
  });
};
```

**Concetti React:**
- Guard clauses / Early return pattern
- Immutability: non modificare direttamente l'oggetto
- Business logic nel componente

**Domande potenziali:**
- "Perché usiamo early return invece di un else?"
- "Come verifichi se una key esiste in un oggetto?"

---

### TEST 10: RemoveQuantity elimina a 0

**Cosa testa:** Rimuovendo quantità fino a 0, l'item sparisce dal carrello

**File:** `cryptoBuy.jsx`

**Bug - Non eliminava l'item:**
```javascript
// SBAGLIATO - Lascia l'item con quantity: 0 o negativa
const removeQuantity = name => {
  const removedFrom = basket[name];
  setBasket({
    ...basket,
    [name]: { ...removedFrom, quantity: removedFrom.quantity - 1 },
  });
};

// CORRETTO - Elimina se quantity <= 1
const removeQuantity = name => {
  const removedFrom = basket[name];
  if (removedFrom.quantity <= 1) {
    const newBasket = { ...basket };
    delete newBasket[name];
    setBasket(newBasket);
  } else {
    setBasket({
      ...basket,
      [name]: { ...removedFrom, quantity: removedFrom.quantity - 1 },
    });
  }
};
```

**Concetti JavaScript/React:**
- `delete` operator per rimuovere proprietà
- Spread operator per copiare oggetti
- Immutability: creare nuovo oggetto invece di modificare

**Domande potenziali:**
- "Cosa fa l'operatore `delete`?"
- "Perché creiamo una copia con spread prima di delete?"
- "Perché non possiamo fare `delete basket[name]` direttamente?"

---

### TEST 11: AvgPricePerCoin da 0

**Cosa testa:** La media dei prezzi parte da 0, non da altro valore

**File:** `cryptoBasket.jsx`

**Bug - reduce partiva da 100:**
```javascript
// SBAGLIATO - Il valore iniziale è 100!
const avgPricePerCoin =
  Object.values(basket).reduce((curr, val) => curr + val.price, 100) /
  Object.values(basket).length;

// CORRETTO - Parte da 0, con gestione divisione per zero
const avgPricePerCoin =
  Object.values(basket).length === 0
    ? 0
    : Object.values(basket).reduce((curr, val) => curr + val.price, 0) /
      Object.values(basket).length;
```

**Concetti JavaScript:**
- `Array.reduce()` e il valore iniziale (secondo parametro)
- Gestione edge case: divisione per zero
- Ternary operator per gestire casi speciali

**Domande potenziali:**
- "Cosa fa il secondo parametro di reduce?"
- "Cosa succede se dividi per zero in JavaScript?" (Infinity o NaN)

---

### TEST 12: useMemo con [basket]

**Cosa testa:** La somma si ricalcola quando cambia il basket

**File:** `cryptoBasket.jsx`

**Bug - useMemo senza dipendenze:**
```javascript
// SBAGLIATO - Non ricalcola mai
const sum = React.useMemo(
  () => Object.values(basket).reduce(
    (curr, val) => curr + val.quantity * val.price, 0
  ),
  []  // Array vuoto!
);

// CORRETTO
const sum = React.useMemo(
  () => Object.values(basket).reduce(
    (curr, val) => curr + val.quantity * val.price, 0
  ),
  [basket]  // Ricalcola quando basket cambia
);
```

**Concetti React:**
- `useMemo` per ottimizzazione
- Memoization: cache del risultato
- Dependencies array (come useEffect)

**Domande potenziali:**
- "Qual è la differenza tra useMemo e useCallback?"
- "Quando dovresti usare useMemo?"
- "Cosa succede se le dipendenze sono sbagliate?"

---

### TEST 13: inputRef.current.focus()

**Cosa testa:** Se l'ordine non è valido, il campo comment riceve focus

**File:** `cryptoBasket.jsx`

**Bug - Mancavano .current e ():**
```javascript
// SBAGLIATO
inputRef.focus;  // Non chiama nulla!

// CORRETTO
inputRef.current.focus();  // .current per accedere al DOM, () per chiamare
```

**Concetti React:**
- `useRef` per accedere a elementi DOM
- `.current` contiene il riferimento effettivo
- Differenza tra riferimento a funzione e chiamata di funzione

**Domande potenziali:**
- "Cosa contiene `inputRef.current`?"
- "Perché useRef e non querySelector?"
- "Cosa succede se scrivi `fn` invece di `fn()`?"

---

### TEST 14: context.addOrder

**Cosa testa:** L'ordine viene salvato nel context

**File:** `cryptoBasket.jsx`

**Bug multipli nella funzione order():**
```javascript
// SBAGLIATO
const order = () => {
  if (Object.keys(basket).every(key => basket[key]?.quantity) && !comment) {
    inputRef.blur;          // Manca .current e ()
    addOrder({ ... });      // addOrder non esiste in questo scope!
  }
};

// CORRETTO
const order = () => {
  if (Object.keys(basket).length > 0 &&
      Object.keys(basket).every(key => basket[key]?.quantity) &&
      comment) {                    // comment (truthy), non !comment
    inputRef.current.blur();        // .current.blur()
    context.addOrder({ ... });      // context.addOrder!
  } else {
    inputRef.current.focus();
  }
};
```

**Bug specifici:**
1. `!comment` → `comment` (vogliamo che il commento ci sia)
2. `addOrder` → `context.addOrder` (viene dal context)
3. `inputRef.blur` → `inputRef.current.blur()`
4. Mancava il check `basket.length > 0`

**Concetti React:**
- useContext per accedere ai dati condivisi
- Validazione form
- Logica booleana nei controlli

**Domande potenziali:**
- "Come accedi a una funzione dal Context?"
- "Perché il check era invertito (! invece di niente)?"

---

### TEST 15: Orders da Context

**Cosa testa:** La lista ordini mostra gli ordini dal context

**File coinvolti:** `app.jsx`, `orders.jsx`

**Bug #1 in app.jsx - orders non nel context:**
```javascript
// SBAGLIATO
<Context.Provider value={{ addOrder }}>

// CORRETTO - Aggiungi orders!
<Context.Provider value={{ addOrder, orders }}>
```

**Bug #2 in orders.jsx - Non leggeva dal context:**
```javascript
// SBAGLIATO
export default function Orders({ orders = [] }) {
  return (
    <List>
      {orders.map(...)}  // Usa solo le props
    </List>
  );
}

// CORRETTO
export default function Orders({ orders = [] }) {
  const context = React.useContext(Context);
  const ordersToDisplay = context?.orders || orders;  // Priorità al context

  return (
    <List>
      {ordersToDisplay.map(...)}
    </List>
  );
}
```

**Concetti React:**
- Context Provider value
- useContext per consumare il context
- Fallback pattern: `context?.value || defaultValue`

**Domande potenziali:**
- "Perché passare orders sia via props che via context?"
- "Cosa fa `?.` (optional chaining)?"

---

## Pattern e Best Practices Emersi

### 1. useEffect Dependencies
```javascript
// Regola: includi TUTTE le variabili usate dentro l'effect
useEffect(() => {
  doSomething(value);
}, [value]);  // value DEVE essere qui
```

### 2. Event Handlers con Parametri
```javascript
// Per passare parametri, usa arrow function
onClick={() => handleClick(item)}

// NON questo (si esegue subito):
onClick={handleClick(item)}
```

### 3. Immutability negli Oggetti
```javascript
// Per modificare un oggetto nello state:
const newObj = { ...oldObj };  // Copia
newObj.key = newValue;         // Modifica la copia
setState(newObj);              // Setta la copia
```

### 4. Functional setState per Evitare Stale Closures
```javascript
// SBAGLIATO - può usare valore vecchio
setItems([...items, newItem]);

// CORRETTO - usa sempre il valore più recente
setItems(prevItems => [...prevItems, newItem]);
```

### 5. useRef per DOM Access
```javascript
const inputRef = useRef(null);
// Nel JSX: <input ref={inputRef} />
// Per accedere: inputRef.current.focus()
```

---

## Domande da Colloquio Comuni

1. **"Spiega il ciclo di vita di un componente React con hooks"**
   - Mount: useEffect con [] esegue
   - Update: useEffect con [deps] esegue se deps cambiano
   - Unmount: cleanup function di useEffect

2. **"Differenza tra useMemo e useCallback?"**
   - useMemo: memoizza un VALORE
   - useCallback: memoizza una FUNZIONE

3. **"Come funziona il Context in React?"**
   - Provider avvolge i componenti
   - useContext() per leggere i valori
   - Evita prop drilling

4. **"Perché React richiede keys nelle liste?"**
   - Per identificare quale elemento è cambiato
   - Ottimizza il re-rendering

5. **"Cosa sono le controlled components?"**
   - Il valore dell'input è controllato dallo state React
   - onChange aggiorna lo state, value legge dallo state

---

## Checklist Pre-Esame

- [ ] Conosco la differenza tra `[]` e `[dep]` in useEffect
- [ ] So quando usare arrow functions negli onClick
- [ ] Capisco useRef e `.current`
- [ ] So usare Context (Provider + useContext)
- [ ] Conosco useMemo e le sue dipendenze
- [ ] So gestire oggetti immutabilmente (spread, delete)
- [ ] Conosco CSS-in-JS (camelCase)
- [ ] So gestire errori con .catch() nelle Promise
