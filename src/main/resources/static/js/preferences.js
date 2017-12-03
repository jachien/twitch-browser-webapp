var prefsKey = 'prefs.v0.1';

var defaultGames = [ 'Dota 2', 'PLAYERUNKNOWN\'S BATTLEGROUNDS', 'Hearthstone' ];

var date = new Date();

function createPrefs(games) {
	// make sure games is sorted, but don't modify the arg
	games = games.slice().sort();

	let prefs = {
		gameProps: []
	};

	games.forEach((game) => {
		let prop = createGameProp(game);
		prefs.gameProps.push(prop);
	})

	return prefs;
}

function createGameProp(game) {
	return {
		name: game,
		display: true,
		createTime: date.getTime()
	}
}

function getPrefsDebugString(prefs) {
	let ret = "";

	prefs.gameProps.forEach((game) => {
        ret += "[name: " + game.name + ", disp: " + game.display + ", ct: " + game.createTime + "]\n";
    });

    return ret;
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

function compareGameName(a, b) {
	return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
}

function sortGameProps(prefs) {
	let sorted = true;
	for (let i=1; i < prefs.gameProps.length; i++) {
		if (compareGameName(prefs.gameProps[i-1], prefs.gameProps[i]) > 0) {
			sorted = false;
			break;
		}
	}

	if (!sorted) {
		prefs.gameProps.sort(compareGameName);
	}
}