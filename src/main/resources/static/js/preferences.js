var gamesKey = 'games';

var defaultGames = [ 'Dota 2', 'PLAYERUNKNOWN\'S BATTLEGROUNDS', 'Hearthstone' ];

function readGames() {
    if (!localStorage.getItem(gamesKey)) {
        storeGames(defaultGames);
    }

    var str = localStorage.getItem(gamesKey);
    var games = JSON.parse(str);
    games.sort();
    return games;
}

function storeGames(games) {
	games.sort();
    var str = JSON.stringify(games);
    localStorage.setItem(gamesKey, str);

}