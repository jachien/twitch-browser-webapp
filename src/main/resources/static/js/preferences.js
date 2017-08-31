var gamesKey = 'games';

var defaultGames = [ 'Dota 2', 'PLAYER UNKNOWN\'S BATTLEGROUNDS', 'Hearthstone' ];

function readGames() {
    if (!localStorage.getItem(gamesKey)) {
        storeGames(defaultGames);
    }

    var str = localStorage.getItem(gamesKey);
    return JSON.parse(str);
}

function storeGames(games) {
    var str = JSON.stringify(games);
    localStorage.setItem(gamesKey, str);

}