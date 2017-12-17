var state = new Vue({
	data() {
		return {
			prefs: {},
	    	auxData: {}
	    }
	},
	computed: {
		gamePropMap: function() {
            let map = {};
            this.prefs.gameProps.forEach((game) => {
                map[game.name] = game;
            });
            return map;
        },
        gameColorMap: function() {
            let colors = [
                "#710c42", // 0 pink
                "#4a148c", // 1 purple
                "#1a237e", // 2 indigo
                "#01579b", // 3 light blue
                "#006064", // 4 cyan
                "#004d40", // 5 teal
                "#1b5e20", // 6 green
                "#3c2e3d", // 7 cranberry
                "#212121", // 8 grey
                "#263238", // 9 blue grey
            ]

            let sortedGameProps = this.prefs.gameProps.slice().sort(function(a, b) {
                if (a.createTime != b.createTime) {
                    return a.createTime - b.createTime;
                }
                return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
            });

            let map = {};
            let colorIdx = 0;
            sortedGameProps.forEach((game) => {
                map[game.name] = colors[colorIdx];
                colorIdx = (colorIdx + 1) % colors.length;
            });

            return map;
        }
    },
    watch: {
    	prefs: {
            handler(prefs, oldPrefs) {
                Prefs.storePrefs(this.prefs);
			},
            deep: true
        }
    },
    methods: {
    	addGame: function(gameName) {
    		this.initAuxProp(gameName);
    		this.prefs.addGame(gameName);
    	},

    	removeGame: function(gameName) {
    		this.closeMenu(gameName);
    		this.prefs.removeGame(gameName);
    	},

    	closeMenu: function(gameName) {
    		this.auxData[gameName].menu = false;
    	},

    	initAuxData: function(prefs) {
            prefs.gameProps.forEach((game) => {
                this.initAuxProp(game.name)
            });
        },

        initAuxProp: function(gameName) {
            this.auxData[gameName] = {
                menu: false
            };
        }
    },
    created: function() {
    	let prefs = Prefs.readPrefs();
	   	this.initAuxData(prefs);
	   	this.prefs = prefs;
    }
});
