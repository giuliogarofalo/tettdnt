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
  > L'effect viene eseguito **solo una volta al mount** del componente. Non si riesegue mai, anche se le variabili usate al suo interno cambiano. È equivalente a `componentDidMount` nelle classi.

- "Perché MUI passa l'event come primo parametro?"
  > È una convenzione di MUI (e del DOM in generale): i callback ricevono sempre l'**event object come primo parametro** e il valore specifico come secondo. Se non lo gestisci nella signature, `newPage` riceve l'event object invece del numero di pagina.

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
  > Perché gli stili inline in JSX sono **oggetti JavaScript**, e in JS le proprietà con trattino (`margin-left`) non sono sintatticamente valide senza bracket notation (`obj['margin-left']`). Il camelCase (`marginLeft`) è la convenzione standard per le proprietà JS.

- "Quali sono le differenze tra inline styles e className in React?"
  > **Inline styles:** oggetti JS applicati direttamente all'elemento, ideali per stili dinamici, hanno priorità CSS alta. **className:** riferisce a classi CSS esterne, più performante per stili statici, permette pseudo-selettori (`:hover`) e media queries che inline non supporta.

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
  > Con il **ternary operator** inline: `style={{ color: condition ? 'green' : 'inherit' }}`. In alternativa, con className condizionali: `className={condition ? 'green-text' : ''}`, oppure usando librerie come `classnames`.

- "Cosa fa `inherit` come valore CSS?"
  > Indica che l'elemento **eredita il valore della proprietà dal suo elemento genitore**. Utile come fallback quando non vuoi applicare un colore specifico, mantenendo la coerenza visiva.

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
  > Perché `handleOpen` richiede un **argomento specifico** (`row`). Se scrivi `onClick={handleOpen}`, React passa l'**event object** come argomento, non il `row`. L'arrow function `() => handleOpen(row)` crea una closure che cattura il `row` corrente e lo passa correttamente.

- "Cosa succede se scrivi `onClick={handleOpen(row)}`?" (si esegue subito!)
  > La funzione viene **eseguita immediatamente durante il render**, non al click! `handleOpen(row)` è una **chiamata di funzione**, non un riferimento. Questo causa: 1) esecuzione al render, 2) possibile loop infinito se la funzione aggiorna lo state, 3) `onClick` riceve il valore di ritorno di `handleOpen`, non la funzione.

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
  > **GET:** per recuperare/leggere dati o notificare senza modificare lo stato del server. È idempotente (chiamarlo N volte produce lo stesso risultato). **POST:** per creare o modificare risorse. Invia dati nel body della request e non è idempotente.

- "Perché un close_event usa GET?" (è una notifica, non crea risorse)
  > Perché è una **semplice notifica** al server che il dialog è stato chiuso. Non sta creando o modificando una risorsa, sta solo segnalando un evento. Non servono dati nel body, e l'operazione è idempotente.

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
  > Con **`.catch()`** sulle Promise oppure **`try/catch`** con async/await. In entrambi i casi, si aggiorna uno state di errore (es. `setError(true)`) per mostrare un messaggio all'utente. Pattern tipico: `setState` nel catch per triggerare un re-render con il feedback di errore.

- "Perché è importante mostrare feedback di errore all'utente?"
  > Senza feedback l'utente **non sa se l'azione è fallita** e non può decidere se riprovare. È un principio fondamentale di UX: ogni azione dell'utente deve avere una risposta visibile, sia in caso di successo che di errore.

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
  > Accede a proprietà nested in modo **sicuro**: se l'oggetto è `null` o `undefined`, ritorna `undefined` invece di lanciare un `TypeError`. Esempio: `response?.description` equivale a `response && response.description` ma è più conciso.

- "Quando usi le graffe `{}` in JSX?"
  > Ogni volta che vuoi inserire un'**espressione JavaScript** nel markup JSX: variabili (`{name}`), calcoli (`{a + b}`), chiamate di funzione (`{fn()}`), ternary (`{x ? 'a' : 'b'}`). Senza graffe, il testo viene trattato come stringa letterale.

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
  > L'useEffect **non si riesegue** quando `currency` cambia. Il dialog mostra sempre i dati della **prima crypto selezionata** (stale data). L'effect è "bloccato" sulla closure iniziale e non vede i nuovi valori.

- "Come decidi cosa mettere nell'array di dipendenze?"
  > Ogni **variabile esterna** (props, state, funzioni) usata dentro l'effect che può cambiare nel tempo **deve essere inclusa**. Regola pratica: se la rimuovi e il comportamento cambia, allora è una dipendenza. Il linter `eslint-plugin-react-hooks` aiuta a verificarlo automaticamente.

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
  > Rende il codice più **leggibile e piatto**: prima gestisci il caso speciale/eccezione e esci, poi procedi con il flusso principale senza nesting aggiuntivo. Riduce la complessità cognitiva (meno livelli di indentazione).

- "Come verifichi se una key esiste in un oggetto?"
  > Tre modi: 1) **`if (obj[key])`** - controlla se il valore è truthy (attenzione: `0` e `""` sono falsy!), 2) **`if (key in obj)`** - verifica l'esistenza della proprietà (anche ereditata), 3) **`obj.hasOwnProperty(key)`** - verifica solo le proprietà proprie, non quelle del prototype.

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
  > Rimuove una **proprietà** da un oggetto. `delete obj.key` elimina la coppia chiave-valore. Ritorna `true` se l'operazione è riuscita. Non funziona su variabili, solo su proprietà di oggetti.

- "Perché creiamo una copia con spread prima di delete?"
  > Per mantenere l'**immutabilità**: in React non si modifica direttamente lo state. Lo spread `{ ...basket }` crea un nuovo oggetto (shallow copy), su cui possiamo fare `delete` senza mutare l'originale.

- "Perché non possiamo fare `delete basket[name]` direttamente?"
  > Perché `basket` è lo **state di React**: mutarlo direttamente non triggera un re-render e viola il principio di immutabilità. React confronta i riferimenti per decidere se ri-renderizzare: se muti l'oggetto esistente, il riferimento resta lo stesso e React non "vede" il cambiamento.

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
  > È il **valore iniziale dell'accumulatore**. `reduce((acc, val) => acc + val, 0)` - lo `0` è il punto di partenza. Senza di esso, reduce usa il **primo elemento** dell'array come valore iniziale e parte dal secondo, il che può causare bug se l'array è vuoto (lancia `TypeError`).

- "Cosa succede se dividi per zero in JavaScript?" (Infinity o NaN)
  > JS **non lancia un errore**: `5 / 0` ritorna `Infinity`, `-5 / 0` ritorna `-Infinity`, `0 / 0` ritorna `NaN`. Per questo è importante il check `length === 0 ? 0 : ...` prima di dividere: evita di mostrare `NaN` o `Infinity` nell'interfaccia.

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
  > **`useMemo`** memoizza il **risultato** di una computazione (un valore calcolato). **`useCallback`** memoizza la **funzione stessa** (il riferimento). `useCallback(fn, deps)` equivale a `useMemo(() => fn, deps)`. useCallback è utile quando passi callback a componenti figlio ottimizzati con `React.memo`.

- "Quando dovresti usare useMemo?"
  > Quando hai **calcoli costosi** che non devono rieseguire ad ogni render (es. filtrare/sommare grandi array), o quando il valore calcolato è passato come prop a componenti ottimizzati con `React.memo`. Non usarlo per operazioni triviali: l'overhead della memoizzazione supererebbe il beneficio.

- "Cosa succede se le dipendenze sono sbagliate?"
  > Se **mancano dipendenze**, useMemo restituisce un valore **stale** (vecchio, non aggiornato). Se ne metti **troppe**, ricalcola inutilmente ad ogni render, vanificando l'ottimizzazione. Il linter ESLint aiuta a identificare dipendenze mancanti.

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
  > Il riferimento all'**elemento DOM reale** (l'`<input>` HTML) a cui è associato tramite l'attributo `ref={inputRef}`. Prima del mount, `.current` è `null`. Dopo il mount, contiene il nodo DOM e puoi chiamare metodi nativi come `.focus()`, `.blur()`, `.value`.

- "Perché useRef e non querySelector?"
  > `useRef` è il modo **React-idiomatico**: non dipende dal DOM globale, funziona con il virtual DOM, si aggiorna automaticamente quando il componente si monta/smonta, ed è **sicuro** in ambienti con SSR. `querySelector` cerca nel DOM reale e potrebbe trovare elementi sbagliati se ci sono duplicati.

- "Cosa succede se scrivi `fn` invece di `fn()`?"
  > `fn` è un **riferimento** alla funzione (non la esegue). `fn()` la **invoca**. Scrivere `inputRef.focus` senza `()` non fa nulla: stai solo leggendo il riferimento al metodo senza chiamarlo. È un bug silenzioso perché non lancia errori.

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
  > 1) Importa il Context: `import { Context } from './context'`. 2) Usa l'hook: `const context = React.useContext(Context)`. 3) Chiama la funzione: `context.addOrder(data)`. Il componente deve essere **dentro** il `<Context.Provider>` nell'albero dei componenti.

- "Perché il check era invertito (! invece di niente)?"
  > `!comment` è `true` quando comment è **vuoto/falsy** (stringa vuota, null, undefined). Ma la logica richiede che il commento **sia presente** per procedere con l'ordine. Quindi serve `comment` (truthy = non vuoto), non `!comment`. Un errore logico classico che inverte la condizione di validazione.

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
  > È un **fallback pattern**: il context ha priorità, ma se non è disponibile (es. in testing o in un contesto senza Provider) si usano le props come default. Rende il componente più **riusabile e testabile**: nei test puoi passare orders direttamente come prop senza dover wrappare con un Provider.

- "Cosa fa `?.` (optional chaining)?"
  > Accede in modo **sicuro** a proprietà di oggetti potenzialmente `null` o `undefined`. `context?.orders` ritorna `undefined` se `context` è nullish, invece di lanciare `TypeError: Cannot read property 'orders' of null`. È equivalente a `context && context.orders` ma più conciso e leggibile.

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
   > - **Mount:** `useEffect(() => {...}, [])` esegue una sola volta dopo il primo render. Equivale a `componentDidMount`.
   > - **Update:** `useEffect(() => {...}, [deps])` riesegue ogni volta che una dipendenza cambia. Equivale a `componentDidUpdate` con condizione.
   > - **Unmount:** La funzione di cleanup `return () => {...}` dentro useEffect esegue prima che il componente venga rimosso dal DOM. Equivale a `componentWillUnmount`. Utile per rimuovere event listeners, cancellare timer, o annullare richieste API.
   > - **Esempio completo:**
   > ```javascript
   > useEffect(() => {
   >   const timer = setInterval(fetchData, 5000);  // Mount/Update
   >   return () => clearInterval(timer);            // Cleanup
   > }, [url]);
   > ```

2. **"Differenza tra useMemo e useCallback?"**
   > - **`useMemo(() => value, [deps])`:** memoizza il **risultato** di una computazione. Ricalcola solo quando le dipendenze cambiano. Uso tipico: calcoli costosi come somme, filtri, ordinamenti su grandi dataset.
   > - **`useCallback((args) => {...}, [deps])`:** memoizza il **riferimento alla funzione**. La funzione non viene ricreata ad ogni render. Uso tipico: passare callback stabili a componenti figlio wrappati con `React.memo` per evitare re-render inutili.
   > - **Relazione:** `useCallback(fn, deps)` equivale a `useMemo(() => fn, deps)`.

3. **"Come funziona il Context in React?"**
   > - **Creazione:** `const MyContext = React.createContext(defaultValue)` - crea il context con un valore di default.
   > - **Provider:** `<MyContext.Provider value={{data, fn}}>` - avvolge i componenti che devono accedere ai dati. Il `value` contiene i dati e funzioni condivise.
   > - **Consumer:** `const ctx = React.useContext(MyContext)` - legge i valori dal Provider più vicino nell'albero.
   > - **Scopo:** Evita il **prop drilling** (passare props attraverso molti livelli di componenti intermedi). Ideale per dati globali: tema, autenticazione, lingua, carrello.
   > - **Attenzione:** Quando il `value` del Provider cambia, **tutti** i consumer si ri-renderizzano.

4. **"Perché React richiede keys nelle liste?"**
   > - React usa le keys per **identificare univocamente** ogni elemento in una lista durante la riconciliazione (diffing del Virtual DOM).
   > - Senza keys (o con keys come indici), React non sa quale elemento è stato aggiunto, rimosso o spostato, e deve **ri-renderizzare l'intera lista**.
   > - Con keys stabili e univoche, React **ottimizza il re-rendering**: aggiorna solo gli elementi modificati.
   > - **Non usare l'indice come key** se la lista può essere riordinata o filtrata: causa bug di stato e performance peggiori.
   > - Key ideale: un **ID univoco** dal database o dai dati stessi.

5. **"Cosa sono le controlled components?"**
   > - Un input il cui valore è **controllato dallo state React**, non dal DOM.
   > - **`value={state}`** legge dallo state, **`onChange={(e) => setState(e.target.value)}`** aggiorna lo state ad ogni modifica.
   > - React diventa la "single source of truth" per il valore dell'input.
   > - **Vantaggi:** validazione in tempo reale, formattazione automatica, controllo completo sull'input, facile da testare.
   > - **Uncontrolled component** (alternativa): usa `ref` per leggere il valore dal DOM (`inputRef.current.value`). Meno controllo ma più semplice per form basici.

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
