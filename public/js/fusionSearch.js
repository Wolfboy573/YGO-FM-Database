let inputCard = document.getElementById("cardname");
let inputCard2 = document.getElementById("cardname2");
let inputCard3 = document.getElementById("cardname3");
let inputCard4 = document.getElementById("cardname4");
let inputCard5 = document.getElementById("cardname5");
let output = document.getElementById("output");
let informationCard = document.getElementById("info-card");
let searchMessage = document.getElementById("search-msg");
let resetBtn = document.getElementById("reset-btn");
let searchResultsBtn = document.getElementById("search-results-btn");
let searchNameBtn = document.getElementById("search-name-btn");
let searchFusionsInHandBtn = document.getElementById("search-fusions-in-hand-btn");
let titlesH2 = ["Fusions", "Equips On", "Rituals"];

function resultsClear() {
  output.innerHTML = "";
  informationCard.innerHTML = "";
  searchMessage.innerHTML = "";
}

function createHTMLDanger(input) {
  if (!input) {
    let firstMessage = `<div class="alert-danger">Please enter a valid search term</div>`;
    return firstMessage;
  } else {
    let secondMessage = `<div class="alert-danger">No results found for ${input}</div>`;
    return secondMessage;
  }
}

/** Display a card with information of the query released. */
function createSideCard(card) {
  let typeCard = cardTypes[card.Type];
  let typeImage = typeCard.replace(/\s/, "_");

  let modelCard = `<div class="card-box"><h3 class="card-title">${card.Name}</h3><p class="card-description">${card.Description}</p><div class="card-item"><div class="card-subitem"><img src="public/images/icons/${typeImage}.png" alt="type icon" class="card-icons" width="20" height="20" /><p class="card-text">${typeCard}</p></div>`;

  let starsSection = `</div><div class="card-item"><img src="public/images/icons/star.svg" alt="type icon" class="card-icons" width="20" height="20" />
  <p class="card-text">Starchip ${card.Stars}</p><img src="public/images/icons/padlock.svg" alt="type icon" class="card-icons" width="20" height="20" />
  <p class="card-text">${card.CardCode}</p></div></div>`;

  if (isMonster(card) === true) {
    let monsterSection = `<div class="card-subitem"><img src="public/images/icons/sword.svg" alt="type icon" class="card-icons" width="20" height="20" /><p class="card-text">ATK ${card.Attack} /</p><img src="public/images/icons/shield.svg" alt="type icon" class="card-icons" width="20" height="20" /><p class="card-text">DEF ${card.Defense}</p></div>`;
    let monsterCard = modelCard + monsterSection + starsSection;
    return monsterCard;
  } else {
    let notMonsterCard = modelCard + starsSection;
    return notMonsterCard;
  }
}

// Initialize awesomplete
let cardNameCompletion = new Awesomplete(inputCard, {
  list: card_db()
    .get()
    .map((c) => c.Name), // list is all the cards in the DB
  autoFirst: true, // The first item in the list is selected
  filter: Awesomplete.FILTER_STARTSWITH, // case insensitive from start of word
});
inputCard.onchange = function() {
  cardNameCompletion.select(); // select the currently highlighted item, e.g. if user tabs
};
let cardName2Completion = new Awesomplete(inputCard2, {
  list: card_db()
    .get()
    .map((c) => c.Name), // list is all the cards in the DB
  autoFirst: true, // The first item in the list is selected
  filter: Awesomplete.FILTER_STARTSWITH, // case insensitive from start of word
});
inputCard2.onchange = function() {
  cardName2Completion.select(); // select the currently highlighted item, e.g. if user tabs
};
let cardName3Completion = new Awesomplete(inputCard3, {
  list: card_db()
    .get()
    .map((c) => c.Name), // list is all the cards in the DB
  autoFirst: true, // The first item in the list is selected
  filter: Awesomplete.FILTER_STARTSWITH, // case insensitive from start of word
});
inputCard3.onchange = function() {
  cardName3Completion.select(); // select the currently highlighted item, e.g. if user tabs
};
let cardName4Completion = new Awesomplete(inputCard4, {
  list: card_db()
    .get()
    .map((c) => c.Name), // list is all the cards in the DB
  autoFirst: true, // The first item in the list is selected
  filter: Awesomplete.FILTER_STARTSWITH, // case insensitive from start of word
});
inputCard4.onchange = function() {
  cardName4Completion.select(); // select the currently highlighted item, e.g. if user tabs
};
let cardName5Completion = new Awesomplete(inputCard5, {
  list: card_db()
    .get()
    .map((c) => c.Name), // list is all the cards in the DB
  autoFirst: true, // The first item in the list is selected
  filter: Awesomplete.FILTER_STARTSWITH, // case insensitive from start of word
});
inputCard5.onchange = function() {
  cardName5Completion.select(); // select the currently highlighted item, e.g. if user tabs
};

/** Creates a div component with all the possibles fusions. */
function fusesToHTML(fuselist, title) {
  let pTagList = fuselist
    .map(function(fusion) {
      let pTag = `<p class="card-textplus">${fusion.card1.Name}<strong> + </strong>${fusion.card2.Name}</p>`;
      if (fusion.result) {
        // Equips and Results don't have a result field
        pTag += `<p class="card-result">${createSideCard(fusion.result)}</p>`;
      }
      return pTag;
    })
    .join("\n");
  let cardDiv = `<div class="card-fusion-equip"><h2 class="sub-title">${title}</h2>${pTagList}</div>`;
  return cardDiv;
}

function searchByName() {
  let card = getCardByName(inputCard.value);
  if (!card) {
    searchMessage.innerHTML = createHTMLDanger(inputCard.value);
    return;
  } else {
    informationCard.innerHTML = createSideCard(card);
    let fusionResponse = hasFusions(card);
    let equipResponse = equipCard(card);

    if (fusionResponse) {
      let fuses = cardWithFusions(card);
      output.innerHTML += fusesToHTML(fuses, titlesH2[0]);
    }

    if (equipResponse) {
      let equips = cardWithEquips(card);
      output.innerHTML += fusesToHTML(equips, titlesH2[1]);
    } else {
      searchMessage.innerHTML = createHTMLDanger(inputCard.value);
      return;
    }
  }
}

function checkFusionsForCards(fusionForCard, compareCard, card1, card2, card3, card4) {
  let fusionsInHand = [];
  if (fusionForCard._card2 === card1.Id) {
    let result = getCardById(fusionForCard._result);
    fusionsInHand.push({ card1: compareCard, card2: card1, result: result });
    result.Fusions.map(i => checkFusionsForCards(i, result, card2, card3, card4, getCardByName("Dark Hole")).forEach(fusion => fusionsInHand.push(fusion)));
  }
  if (fusionForCard._card2 === card2.Id) {
    let result = getCardById(fusionForCard._result);
    fusionsInHand.push({ card1: compareCard, card2: card2, result: result });
    result.Fusions.map(i => checkFusionsForCards(i, result, card1, card3, card4, getCardByName("Dark Hole")).forEach(fusion => fusionsInHand.push(fusion)));
  }
  if (fusionForCard._card2 === card3.Id) {
    let result = getCardById(fusionForCard._result);
    fusionsInHand.push({ card1: compareCard, card2: card3, result: result });
    result.Fusions.map(i => checkFusionsForCards(i, result, card1, card2, card4, getCardByName("Dark Hole")).forEach(fusion => fusionsInHand.push(fusion)));
  }
  if (fusionForCard._card2 === card4.Id) {
    let result = getCardById(fusionForCard._result);
    fusionsInHand.push({ card1: compareCard, card2: card4, result: result });
    result.Fusions.map(i => checkFusionsForCards(i, result, card1, card3, card2, getCardByName("Dark Hole")).forEach(fusion => fusionsInHand.push(fusion)));
  }
  return fusionsInHand;
}

function searchFusionCombosForHand() {
  let card1 = getCardByName(inputCard.value);
  let card2 = getCardByName(inputCard2.value);
  let card3 = getCardByName(inputCard3.value);
  let card4 = getCardByName(inputCard4.value);
  let card5 = getCardByName(inputCard5.value);

  if (!card1) {
    searchMessage.innerHTML = createHTMLDanger(inputCard.value);
    return;
  }
  if (!card2) {
    searchMessage.innerHTML = createHTMLDanger(inputCard2.value);
    return;
  }
  if (!card3) {
    searchMessage.innerHTML = createHTMLDanger(inputCard3.value);
    return;
  }
  if (!card4) {
    searchMessage.innerHTML = createHTMLDanger(inputCard4.value);
    return;
  }
  if (!card5) {
    searchMessage.innerHTML = createHTMLDanger(inputCard5.value);
    return;
  }
  let fusionsInHand = [];
  card1.Fusions.map((i) => {
    checkFusionsForCards(i, card1, card2, card3, card4, card5).forEach(cheese => fusionsInHand.push(cheese));
  });
  card2.Fusions.map((i) => {
    checkFusionsForCards(i, card2, card1, card3, card4, card5).forEach(cheese => fusionsInHand.push(cheese));
  });
  card3.Fusions.map((i) => {
    checkFusionsForCards(i, card3, card1, card2, card4, card5).forEach(cheese => fusionsInHand.push(cheese));
  });
  card4.Fusions.map((i) => {
    checkFusionsForCards(i, card4, card1, card2, card3, card5).forEach(cheese => fusionsInHand.push(cheese));
  });
  card5.Fusions.map((i) => {
    checkFusionsForCards(i, card5, card1, card3, card4, card2).forEach(cheese => fusionsInHand.push(cheese));
  });

  output.innerHTML += fusesToHTML(fusionsInHand, titlesH2[0])
}

function searchForResult() {
  let card = getCardByName(inputCard.value);
  if (!card) {
    searchMessage.innerHTML = createHTMLDanger(inputCard.value);
    return;
  } else {
    informationCard.innerHTML = createSideCard(card);
    let booleanResult = hasResult(card);
    if (booleanResult) {
      let results = resultsList[card.Id].map((f) => {
        return { card1: getCardById(f.card1), card2: getCardById(f.card2) };
      });
      output.innerHTML += fusesToHTML(results, titlesH2[0]);
    } else {
      searchMessage.innerHTML = createHTMLDanger(inputCard.value);
      return;
    }
  }
}


searchNameBtn.onclick = function() {
  let booleanResponse = checkInputValidation(inputCard);
  resultsClear();
  if (booleanResponse) {
    searchMessage.innerHTML = createHTMLDanger();
    return;
  } else {
    searchByName();
  }
};

searchResultsBtn.onclick = function() {
  let booleanResponse = checkInputValidation(inputCard);
  resultsClear();
  if (booleanResponse) {
    searchMessage.innerHTML = createHTMLDanger();
    return;
  } else {
    searchForResult();
  }
};

resetBtn.onclick = function() {
  resultsClear();
  inputCard.value = "";
  inputCard2.value = "";
  inputCard3.value = "";
  inputCard4.value = "";
  inputCard5.value = "";
};

// create search fusions for hand!!
searchFusionsInHandBtn.onclick = function() {
  resultsClear();
  let booleanResponse = checkInputValidation(inputCard)
    && checkInputValidation(inputCard2)
    && checkInputValidation(inputCard3)
    && checkInputValidation(inputCard4)
    && checkInputValidation(inputCard5);

  if (booleanResponse) {
    searchMessage.innerHTML = createHTMLDanger();
    return;
  } else {
    searchFusionCombosForHand();
  }

};
