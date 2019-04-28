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
    // if (selected.length) {
        for (let i = 0; i <selected.length; i++) {
            selected[i].classList.remove('selected')
        }
    // }
    selectedCard = [];
};

const selectCard = (cards, parent) => {
    clearSelected();
    if (!Array.isArray(cards)) {
        cards = [cards];

    }
    for (let i = 0; i < cards.length; i++) {
        console.log(cards, cards[i])
        let classList = cards[i].el.classList;
       !classList.contains('selected') && classList.add('selected');
        cards[i].parent = parent;
        selectedCard.push(cards[i]);
    }

};



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
        // cardToFlip.visible = true;
        flippedCardContainerElement.appendChild(cardToFlip.el)
        dealableCards.pop();
    } else {
        // let flippedCards = flippedCardContainerElement.childNodes;
        // flippedDealableCards = flippedDealableCards.reverse();
        for (let i = 0; i < flippedDealableCards.length; i++) {
            extraCardPile.appendChild(flippedDealableCards[i].el);
        }
        dealableCards = flippedDealableCards;
        flippedDealableCards = [];
        flippedCardContainerElement.innerHTML = '';
    }

})

flippedCardContainerElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('card')) {
        // selectedCard = [];
        // flippedDealableCards[0].el.classList.add('selected')
        // flippedDealableCards[0].parent = flippedDealableCards;
        // selectedCard.push(flippedDealableCards[0]);
        console.log(flippedDealableCards[0])
        selectCard(flippedDealableCards[0], flippedDealableCards);

    }
    // else if (selectedCard.length >= 1) {
    //     clearSelected();
        // selectedCard.push(flippedDealableCards[0]);
    // }
});


for (let i = 0; i < dealtPilesElements.length; i++) {
    let currentPileObject = dealtPilesObjects[i];

    dealtPilesElements[i].addEventListener('click', e => {
        let visibleCard = currentPileObject[currentPileObject.length -1];
            // visibleCard && visibleCard.el.classList.add('visible');
        // visibleCard.el.classList.add('visible');

        if (selectedCard.length) {
            let selectedCardParent = selectedCard[0].parent
            if ((!visibleCard) || (selectedCard[0].colour !== visibleCard.colour && selectedCard[0].number === (visibleCard.number - 1))){
                if (selectedCardParent !== flippedDealableCards) {
                    selectedCardParent.splice(selectedCardParent.length- selectedCard.length, selectedCard.length)
                    selectedCardParent[selectedCardParent.length - 1] && selectedCardParent[selectedCardParent.length - 1].el.classList.add('visible')
                } else {
                    selectedCardParent = selectedCardParent.shift();
                }
                for (let j = 0; j < selectedCard.length; j++) {
                    // selectedCard[j].el.classList.add('visible');
                    currentPileObject.push(selectedCard[j]);

                    selectedCard[j].el.classList.remove('selected')
                    selectedCard[j].el.classList.add('visible')

                    dealtPilesElements[i].appendChild(selectedCard[j].el);
                }

                clearSelected();
            } else {
                clearSelected();
            }
        } else {
            let visibleCards = [];
            // let index = dealtPilesObjects[i].indexOf(visibleCard)
            for (let j = 0; j < currentPileObject.length; j++) {
                console.log(currentPileObject[j].el)
                let classList = currentPileObject[j].el.classList;
                if (classList.contains('selected')) {
                    visibleCards.push(currentPileObject[j]);
                }
            }

            selectCard(visibleCards, currentPileObject);
            // selectedCard = [];
            // visibleCard.parent = currentPileObject;
            // visibleCard.el.classList.add('selected')
            // selectedCard.push(visibleCard);
        }
    });

    dealtPilesElements[i].addEventListener('mouseover', e => {
        if (selectedCard.length === 0) {
            if (e.target.classList.contains('visible')) {
                e.target.classList.add('selected')
                // if (e.target.nextSibling) {
                //     let nextCard = e.target.nextSibling;
                //     nextCard.classList.contains('visible') && nextCard.classList.add('selected')
                // }
            }
        }

    });

    dealtPilesElements[i].addEventListener('mouseleave', e => {
        if (selectedCard.length === 0) {
            for (let j = 0; j <currentPileObject.length; j++) {
                if (currentPileObject[j].el && currentPileObject[j].el.classList.contains('selected')) {
                    currentPileObject[j].el.classList.remove('selected')
                }
            }
        }

    });
}


const acePilesElements = document.querySelectorAll('.ace-pile');
let acePilesObjects = [[], [], [], []];
for (let i = 0; i <acePilesElements.length; i++) {
    let currentPileElements = acePilesElements[i];
    let currentPileObjects = acePilesObjects[i];

    currentPileElements.addEventListener('click', e => {
        // let acePile = currentPileElements;
        if (selectedCard.length === 1) {
            let selectedCardParent = selectedCard[0].parent;
            if (e.target.classList.contains('card')) {
                    visibleCard = currentPileObjects[currentPileObjects.length - 1]
                if (selectedCard.length === 1 && visibleCard.suit === selectedCard[0].suit && visibleCard.number === (selectedCard[0].number -1)) {
                    currentPileElements.appendChild(selectedCard[0].el);
                    currentPileObjects.push(selectedCard[0]);
                    if (selectedCardParent !== flippedDealableCards) {
                        selectedCard[0].parent.splice(selectedCardParent.length-1, 1);
                        selectedCardParent[selectedCardParent.length - 1] && selectedCardParent[selectedCardParent.length - 1].el.classList.add('visible')
                    }else {
                        selectedCardParent = selectedCardParent.shift();
                    }
                    // selectedCardParent[selectedCardParent.length - 1] && selectedCardParent[selectedCardParent.length - 1].el.classList.add('visible')
                    selectedCard[0].el.classList.remove('selected')
                    selectedCard[0].el.classList.remove('visible')
                    selectedCard = [];
                }
            } else if (!e.target.classList.contains('card') && selectedCard[0].number === 1) {
                currentPileElements.appendChild(selectedCard[0].el);
                currentPileObjects.push(selectedCard[0]);
                if (selectedCardParent !== flippedDealableCards) {
                    selectedCard[0].parent.splice(selectedCardParent.length-1, 1);
                    selectedCardParent[selectedCardParent.length - 1] && selectedCardParent[selectedCardParent.length - 1].el.classList.add('visible')
                }else {
                    selectedCardParent = selectedCardParent.shift();
                }
                selectedCard[0].el.classList.remove('selected');
                selectedCard[0].el.classList.remove('visible');
                clearSelected();
            } else {
                clearSelected();
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

// let visibleCards = document.querySelectorAll('visible');
// for (let i = 0; i <visibleCards.length; i++) {
//     visibleCards[i].add
// }