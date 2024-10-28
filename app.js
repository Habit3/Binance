let web3;
let userAccount;
let userBalance = 0; // Saldo dell'utente

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
            document.getElementById('connectButton').style.display = 'none'; // Nasconde il pulsante dopo la connessione
        } catch (error) {
            console.error('User denied account access:', error);
        }
    } else {
        alert('Please install MetaMask or another web3 wallet.');
    }
}

// Funzione per effettuare una transazione
async function sendTransaction(amount) {
    const amountInBNB = await getEquivalentBNB(amount); // Converti l'importo in BNB
    const txParams = {
        from: userAccount,
        to: recipientAddress, // Indirizzo di ricezione
        value: amountInBNB,
        gas: '2000000'
    };

    try {
        const txHash = await web3.eth.sendTransaction(txParams);
        console.log('Transaction sent:', txHash);
        alert('Transaction successful: ' + txHash);
        updateBalance(amount); // Aggiorna il saldo
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

// Funzione per aggiornare il saldo
function updateBalance(amount) {
    userBalance += amount; // Aggiungi l'importo al saldo
    document.getElementById('balanceAmount').innerText = userBalance.toFixed(2); // Aggiorna il display del saldo
}

// Funzione per ottenere l'equivalente in BNB di un importo in USD
async function getEquivalentBNB(amountInUSD) {
    const bnbPrice = await getBNBPrice(); // Ottieni il prezzo corrente di BNB
    const amountInBNB = (amountInUSD / bnbPrice).toFixed(18); // Calcola l'importo in BNB
    return web3.utils.toWei(amountInBNB, 'ether'); // Converte in Wei
}

// Funzione per ottenere il prezzo attuale di BNB
async function getBNBPrice() {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
    const data = await response.json();
    return parseFloat(data.price);
}

// Aggiungi l'evento click al pulsante di connessione
document.getElementById('connectButton').addEventListener('click', connectWallet);

// Aggiungi eventi click ai contenitori delle opzioni
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
        const amount = parseFloat(option.getAttribute('data-amount'));
        sendTransaction(amount);
    });
});
