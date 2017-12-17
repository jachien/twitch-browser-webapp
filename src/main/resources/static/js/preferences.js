var prefsKey = 'prefs.v0.1';

var defaultGames = [ 'Dota 2', 'PLAYERUNKNOWN\'S BATTLEGROUNDS', 'Hearthstone' ];

class Prefs {
	constructor(gameProps) {
		this.gameProps = gameProps;
	}

	static readPrefs() {
	    if (!localStorage.getItem(prefsKey)) {
	        let prefs = Prefs._createPrefs(defaultGames);
	        Prefs.storePrefs(prefs);
	    }

	    let prefsJson = localStorage.getItem(prefsKey);
	    let prefs = JSON.parse(prefsJson);

	    Prefs._sortGameProps(prefs);

	    return new Prefs(prefs.gameProps);
	}

	static storePrefs(prefs) {
		Prefs._sortGameProps(prefs);
		let prefsJson = JSON.stringify(prefs);
		localStorage.setItem(prefsKey, prefsJson);
	}

	addGame(gameName) {
		let prop = Prefs._createGameProp(gameName);
        this.gameProps.push(prop);
	}

	removeGame(gameName) {
		let idx = 0;
        while (idx < this.gameProps.length) {
            if (this.gameProps[idx].name == gameName) {
                this.gameProps.splice(idx, 1);
                return;
            }
            idx++;
        }
	}

	getDebugString() {
		let ret = "";

		this.gameProps.forEach((game) => {
	        ret += "[name: " + game.name + ", disp: " + game.display + ", ct: " + game.createTime + "]\n";
	    });

	    return ret;
	}

	static _createPrefs(games) {
		// make sure games is sorted, but don't modify the arg
		games = games.slice().sort();

		let prefs = new Prefs();

		games.forEach((game) => {
			let prop = Prefs._createGameProp(game);
			this.gameProps.push(prop);
		})

		return prefs;
	}

	static _createGameProp(game) {
		var date = new Date();
		return {
			name: game,
			display: true,
			createTime: date.getTime()
		}
	}

	static _compareGameName(a, b) {
		return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
	}

	static _sortGameProps(prefs) {
		let sorted = true;
		for (let i=1; i < prefs.gameProps.length; i++) {
			if (Prefs._compareGameName(prefs.gameProps[i-1], prefs.gameProps[i]) > 0) {
				sorted = false;
				break;
			}
		}

		if (!sorted) {
			prefs.gameProps.sort(Prefs._compareGameName);
		}
	}
}
