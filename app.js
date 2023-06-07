// Part 1: Number Facts

// 1. Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. (Make sure you get back JSON by including the json query key, specific to this API.

async function favNumFact(num) {
    let baseURL = 'http://numbersapi.com';
    let numData = await axios.get(`${baseURL}/${num}?json`)
    console.log(numData.data.text)
}

favNumFact(2);

// 2. Figure out how to get data on multiple numbers in a single request. Make that request and when you get the data back, put all of the number facts on the page.

let favNums = [3, 7, 8, 14]

async function multiNumsFacts(nums) {
    let baseURL = 'http://numbersapi.com';
    let numData = await axios.get(`${baseURL}/${nums}`)
    for (fact in numData.data) {
        console.log(numData.data[fact]);
    }
}

multiNumsFacts(favNums);

// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. It’s okay if some of the facts are repeats.

async function fourFactsForNum(num) {
    let baseURL = 'http://numbersapi.com';
    let facts = await Promise.all([
        axios.get(`${baseURL}/${num}?json`),
        axios.get(`${baseURL}/${num}?json`),
        axios.get(`${baseURL}/${num}?json`),
        axios.get(`${baseURL}/${num}?json`),
    ]);

    console.log(`FACT 1: ${facts[0].data.text}`);
    console.log(`FACT 2: ${facts[1].data.text}`);
    console.log(`FACT 3: ${facts[2].data.text}`);
    console.log(`FACT 4: ${facts[3].data.text}`);
}

fourFactsForNum(4);

// Part 2: Deck of Cards

// 1. Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).

// Draws a single card from a new deck
// let deckURL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'

async function drawCard() {
    let deckURL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1';
    let res = await axios.get(`${deckURL}`);
    let value = res.data.cards[0].value.toLowerCase();
    let suit = res.data.cards[0].suit.toLowerCase();
    let card = `You drew the ${value} of ${suit}`;
    let deckID = res.data.deck_id;
    console.log(card);
    return [card, deckID];
};

// drawCard();

// 2. Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the same deck.

async function getCards() {
    let draw = await drawCard();
    let card1 = draw[0];
    let deckID = draw[1];
    let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    let card2 = `${res.data.cards[0].value.toLowerCase()} of ${res.data.cards[0].suit.toLowerCase()}`
    console.log(`${card1} and the ${card2}`)
}

// 3. Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.

let newDeckURL = 'https://deckofcardsapi.com/api/deck'
let deckId = null;
let $btn = $('button');
let $cardArea = $('#card-area');

async function getDeckID() {
    let res = await axios.get(`${newDeckURL}/new/shuffle/`);
    deckId = res.data.deck_id;
    $btn.show();
};

$btn.on('click', async function() {
    let res = await axios.get(`${newDeckURL}/${deckId}/draw/`);
    let cardSrc = res.data.cards[0].image;
    let angle = Math.random() * 90 - 45;
    let randomX = Math.random() * 40 - 20;
    let randomY = Math.random() * 40 - 20;
    $cardArea.append(
        $('<img>', {
            src: cardSrc,
            css: {
                transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
            }
        })
    );
    if (res.data.remaining === 0) $btn.remove();
});

getDeckID();