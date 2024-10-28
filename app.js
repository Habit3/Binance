let web3;
let userAccount;

// L'indirizzo a cui verranno inviati i BNB
const recipientAddress = '0xa867213a6c5B6a2F7F3556e81b2C06C91b155dD0'; // Sostituisci con il tuo indirizzo

// Funzione per connettere il portafoglio
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Richiesta di accesso all'account dell'utente
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            console.log('Connected account:', userAccount);
        } catch (error) {
            console.error('User denied account access:', error);
        }
    } else {
        alert('Please install MetaMask or another web3 wallet.');
    }
}

// Funzione per effettuare una transazione
async function sendTransaction(amount) {
    try {
        const amountInBNB = await getEquivalentBNB(amount); // Converti l'importo in BNB
        const txParams = {
            from: userAccount,
            to: recipientAddress, // Indirizzo di ricezione
            value: amountInBNB,
            gas: '2000000'
        };

        const txHash = await web3.eth.sendTransaction(txParams);
        console.log('Transaction sent:', txHash);
        alert('Transaction successful: ' + txHash);
    } catch (error) {
        console.error('Transaction failed:', error);
        alert('Transaction failed: ' + error.message); // Mostra un messaggio d'errore all'utente
    }
}

// Funzione per ottenere l'equivalente in BNB di un importo in USD
async function getEquivalentBNB(amountInUSD) {
    const bnbPrice = await getBNBPrice(); // Ottieni il prezzo corrente di BNB
    const amountInBNB = (amountInUSD / bnbPrice).toFixed(18); // Calcola l'importo in BNB
    return web3.utils.toWei(amountInBNB, 'ether'); // Converte in Wei
}

// Funzione per ottenere il prezzo attuale di BNB
async function getBNBPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return parseFloat(data.price);
    } catch (error) {
        console.error('Error fetching BNB price:', error);
        alert('Could not fetch BNB price. Please try again later.'); // Messaggio per l'utente
        return 0; // Restituisci 0 in caso di errore
    }
}

// Aggiungi l'evento click al pulsante di connessione
document.getElementById('connectButton').addEventListener('click', connectWallet);

// Aggiungi eventi click ai contenitori delle opzioni
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
        const amount = option.getAttribute('data-amount');
        sendTransaction(amount);
    });
});
