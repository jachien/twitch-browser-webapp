var gamesKey = 'games';

var defaultGames = [ 'Dota 2', 'PLAYERUNKNOWN\'S BATTLEGROUNDS', 'Hearthstone' ];

function readGames() {
    if (!localStorage.getItem(gamesKey)) {
        storeGames(defaultGames);
    }

    let str = localStorage.getItem(gamesKey);
    let games = JSON.parse(str);
    games.sort();

    let ret = {};
    games.forEach((game) => { 
    	ret[game] = { display: true }; 
    });
    return ret;
}

function storeGames(games) {
	let gamesArr = [];
	for (let game in games) {
		gamesArr.push(game);
	}
	storeGamesArray(gamesArr);
}

function storeGamesArray(gamesArr) {
	gamesArr.sort();
    var str = JSON.stringify(gamesArr);
    localStorage.setItem(gamesKey, str);
}