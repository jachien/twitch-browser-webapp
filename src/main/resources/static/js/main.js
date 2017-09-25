var streamComponent = {
    props: ['stream', 'prefs', 'gameIdxs'],
    template: `
        <div class="stream_item" v-show="gameIdxs.hasOwnProperty(stream.gameName) && prefs.gameProps[gameIdxs[stream.gameName]].display" v-bind:id="'stream-' + stream.channelId">
            <div><a v-bind:href="stream.channelUrl"><img v-bind:src="stream.previewUrl"/></a></div>
            <div><strong>{{stream.displayName}}</strong></div>
            <div>{{stream.status}}</div>
            <div><strong>{{stream.gameName}}</strong></div>
            <div>{{stream.numViewers}} viewers</div>
        </div>
    `
};

var app = new Vue({
    el: '#app',
    data () {
        return {
            prefs: readPrefs(),
            streams: [],
            agSelect: "",
            agItems: [],
            agSearch: null,
            agLoading: false,
            drawer: true
        }

    },
    computed: {
        gameIdxs: function() {
            let gameIdxs = {}
            let idx = 0;
            this.prefs.gameProps.forEach((game) => {
                gameIdxs[game.name] = idx;
                idx++;
            });
            return gameIdxs;
        }
    },
    watch: {
        prefs: function(prefs) {
            console.log("updating prefs");
            storePrefs(prefs);
            // todo load streams if necessary
        },
        agSearch: function(val) {
            if (val) {
                this.queryGames(val);
            }
        }
    },
    components: {
        'stream-component': streamComponent,
    },
    methods: {
        loadAllStreams: function() {
            this.prefs.gameProps.forEach((game) => {
                this.loadStreams(game.name, 0, 25);
            });
        },
        loadStreams: function(game, start, limit) {
            console.log(game + " " + start + " " + limit)
            config = {
                params: {
                    game: game,
                    start: start,
                    limit: limit
                }
            };

            //console.log(config);
            axios.get('/api', config)
                .then(
                    function (response) {
                        console.log(response);
                        //app.content = response;
                        this.appendStreams(response.data.streams);
                    }.bind(this)
                ).catch(
                    function (error) {
                        console.log(error);
                    }
                );
        },
        appendStreams: function(newStreams) {
            let mergedStreams = this.streams.concat(newStreams);
            mergedStreams.sort(function(a, b) {
                return b.numViewers - a.numViewers;
            });
            this.streams = mergedStreams;
        },
        showAllStreams: function() {
            this.prefs.gameProps.forEach((game) => {
                game.display = true;
            })
        },
        showOnlyStreams: function(gameName) {
            this.prefs.gameProps.forEach((game) => {
                if (game.name == gameName) {
                    game.display = true;
                } else {
                    game.display = false;
                }
            })
        },
        addGame: function() {
            if (this.agSelect != "" && !this.gameIdxs.hasOwnProperty(this.agSelect)) {
                this.agItems.some((game) => {
                    if (this.agSelect == game) {
                        let prop = createGameProp(game);
                        this.prefs.gameProps.push(prop);
                        this.loadStreams(game, 0, 25);
                        return true;
                    }
                    return false;
                })
            }
        },
        removeGame: function(game) {
            let idx = this.gameIdxs[game];
            this.prefs.gameProps.splice(idx, 1);
        },
        queryGames: function(gameName) {
            this.agLoading = true;

            config = {
                params: {
                    query: gameName,
                    // todo extract this to config
                    client_id: "ib5vu55l2rc4elcwyrqikyza4hio0y",
                    api_version: "5"
                }
            };

            //console.log(config);
            axios.get('https://api.twitch.tv/kraken/search/games', config)
                .then(
                    function (response) {
                        console.log(response);

                        let games = response.data.games;
                        games.sort(function(a, b) {
                            return b.popularity - a.popularity;
                        });

                        let items = [];
                        games.forEach((game) => {
                            items.push(game.name);
                        });

                        this.agItems = items;

                    }.bind(this)
                ).catch(
                    function (error) {
                        console.log(error);
                    }
                );

            this.agLoading = false;
        }

    },
    created: function() {
        this.loadAllStreams();
    }
});