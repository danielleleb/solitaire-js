let cards = [];


for (let i = 1; i <= 13; i++) {
    for (let j = 1; j <= 4; j++) {
        let colour;
        let suit;
        switch(j) {
            case 1:
                suit = 'diamond';
                colour = 'Red';
                break;
            case 2:
                suit = 'heart';
                colour = 'Red';
                break;
            case 3:
                suit = 'spades';
                colour = 'Black';
                break;
            case 4:
                suit = 'clubs';
                colour = 'Black';
                break;
        }
        let card = {
            suit,
            colour,
            number: i,
            cardHTML: `<span class="card-number">
                            ${i}
                            </span>
                            <span class="card-suit">
                            ${suit}
                            </span>`,
            visible: false,
            el: false,
            selected: false,
            parent: null
        };
        cards.push(card)
    }
}

// DEAL

const dealtPilesElements = document.querySelectorAll('.dealt-pile');
const dealtPilesObjects = [];
const body = document.querySelector('body')
let selectedCard = [];

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const createCard = (number, suit, parent) => {

    let cardElement = document.createElement('div');
    cardElement.classList.add('card');
    let cardNumberElement = document.createElement('span');
    cardNumberElement.classList.add('card-number');
    cardNumberElement.innerHTML = number
    let cardSuitElement = document.createElement('span');
    cardSuitElement.classList.add('card-suit');
    cardElement.classList.add(suit);
    cardSuitElement.innerHTML = suit
    cardElement.appendChild(cardNumberElement);
    cardElement.appendChild(cardSuitElement);
    parent.appendChild(cardElement);
    return cardElement;
};

const clearSelected = () => {
    let selected = document.querySelectorAll('.selected');
    for (let i = 0; i <selected.length; i++) {
        selected.classList.remove('selected')
    }
    selectedCard = [];
};

const selectCard = () => {

}

shuffle(cards);

for (let i = 1; i < dealtPilesElements.length + 1; i++) {
    let currentPile = [];
    for (let j = 0; j < i; j++) {
        cards[0].el = createCard(cards[0].number, cards[0].suit, dealtPilesElements[i -1]);
        currentPile.push(cards[0]);
        cards.splice(0, 1);
    }
    dealtPilesObjects.push(currentPile);
    currentPile = [];
}

const extraCardPile = document.querySelector('.unflipped-cards');

let dealableCards = cards;
for (let i = 0; i < cards.length; i++) {

    cards[i].el = createCard(cards[i].number, cards[i].suit, extraCardPile);
}

let cardPiles = dealtPilesObjects;
// cardPiles.push(dealableCards);

for (let i = 0; i < cardPiles.length; i++) {
    currentPile = cardPiles[i][cardPiles[i].length - 1];
    currentPile.visible = true;
    currentPile.el.classList.add('visible');
}

let flippedDealableCards = [];
const flippedCardContainerElement = document.querySelector('.flipped-cards');

extraCardPile.addEventListener('click', (e) => {
    if (dealableCards.length) {
        let cardToFlip = dealableCards[dealableCards.length-1];
        flippedDealableCards.unshift(cardToFlip)
        cardToFlip.visible = true;
        flippedCardContainerElement.appendChild(cardToFlip.el)
        dealableCards.pop();
    } else {
        // let flippedCards = flippedCardContainerElement.childNodes;
        flippedDealableCards = flippedDealableCards.reverse();
        for (let i = 0; i < flippedDealableCards.length; i++) {
            extraCardPile.appendChild(flippedDealableCards[i].el);
        }
        flippedCardContainerElement.innerHTML = '';
        dealableCards = flippedDealableCards;
        flippedDealableCards = [];
    }

})

flippedCardContainerElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('card')) {
        selectedCard = [];
        flippedDealableCards[0].el.classList.add('selected')
        flippedDealableCards[0].parent = flippedDealableCards;
        selectedCard.push(flippedDealableCards[0]);

    } else if (selectedCard.length >= 1) {
        clearSelected();
        // selectedCard.length = 0;
        selectedCard.push(flippedDealableCards[0]);
    }
});


for (let i = 0; i < dealtPilesElements.length; i++) {
    dealtPilesElements[i].addEventListener('click', e => {
        let visibleCard = dealtPilesObjects[i][dealtPilesObjects[i].length -1];

        if (selectedCard.length) {
            if (selectedCard[0].colour !== visibleCard.colour && selectedCard[0].number === (visibleCard.number - 1)) {
                dealtPilesObjects[i].unshift(selectedCard[0]);
                selectedCard[0].parent.splice(0, selectedCard.length)
                selectedCard[0].el.classList.add('visible');
                selectedCard[0].el.classList.remove('selected')
                dealtPilesElements[i].appendChild(selectedCard[0].el);
                selectedCard = [];

            }
        } else {
            clearSelected();
            // selectedCard = [];
            // visibleCard.parent = dealtPilesObjects[i];
            // visibleCard.el.classList.add('selected')
            // selectedCard.push(visibleCard);
        }
    })
}


const acePilesElements = document.querySelectorAll('.ace-pile');
let acePilesObjects = [[], [], [], []];
for (let i = 0; i <acePilesElements.length; i++) {
    acePilesElements[i].addEventListener('click', e => {
        // let acePile = acePilesElements[i];
        if (selectedCard.length) {
            if (e.target.classList.contains('card')) {
                    visibleCard = acePilesObjects[i]
                console.log(visibleCard)
                if (visibleCard.suit === selectedCard[0].suit && visibleCard.number === (selectedCard[0].number -1)) {
                    acePilesElements[i].appendChild(selectedCard[0].el);
                    acePilesObjects[i].push(selectedCard[0]);
                    selectedCard[0].parent.splice(0, selectedCard.length);
                    selectedCard[0].el.classList.remove('selected')
                    selectedCard = [];
                }
            } else if (!e.target.classList.contains('card') && selectedCard[0].number === 1) {
                console.log('good')
                acePilesElements[i].appendChild(selectedCard[0].el);
                acePilesObjects[i].push(selectedCard[0]);
                selectedCard[0].parent.splice(0, selectedCard.length);
                selectedCard[0].el.classList.remove('selected')
                selectedCard = [];
            }
            // if (selectedCard[0].colour !== visibleCard.colour && selectedCard[0].number === (visibleCard.number - 1)) {
            //     dealtPilesObjects[i].unshift(selectedCard[0]);
            //     selectedCard[0].parent.splice(0, selectedCard.length)
            //     selectedCard[0].el.classList.add('visible');
            //     selectedCard[0].el.classList.remove('selected')
            //     dealtPilesElements[i].appendChild(selectedCard[0].el);
            //     selectedCard = [];
            //
            // }
        }
    })
}