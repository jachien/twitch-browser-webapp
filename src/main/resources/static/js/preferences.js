var prefsKey = 'prefs';

var defaultGames = [ 'Dota 2', 'PLAYERUNKNOWN\'S BATTLEGROUNDS', 'Hearthstone' ];

function createPrefs(games) {
	// make sure games is sorted, but don't modify the arg
	games = games.slice().sort();

	let prefs = {
		gameProps: []
	};

	games.forEach((game) => {
		let prop = {
			name: game,
			display: true
		}
		prefs.gameProps.push(prop);
	})

	return prefs;
}

function readPrefs() {
    if (!localStorage.getItem(prefsKey)) {
        let prefs = createPrefs(defaultGames);
        storePrefs(prefs);
    }

    let prefsJson = localStorage.getItem(prefsKey);
    let prefs = JSON.parse(prefsJson);
    
    sortGameProps(prefs);

    return prefs;
}

function storePrefs(prefs) {
	sortGameProps(prefs);
	let prefsJson = JSON.stringify(prefs);
	localStorage.setItem(prefsKey, prefsJson);
}

function sortGameProps(prefs) {
	prefs.gameProps.sort((a, b) => {
    	return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase);
    })
}