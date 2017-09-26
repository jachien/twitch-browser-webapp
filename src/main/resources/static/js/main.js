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

var gameComponent = {
    props: ['gameProp'],
    template: `
        <v-list-tile @click="">
            <v-list-tile-action>
                <v-switch dark v-model="gameProp.display"></v-switch>
            </v-list-tile-action>
            <v-list-tile-content v-bind:title="gameProp.name">
                <v-list-tile-title>
                    {{ gameProp.name }}
                </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-menu
                    offset-y
                    :close-on-content-click="false"
                    v-model="gameProp.menu"
                >
                    <v-btn icon slot="activator">
                        <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                    <v-card dark>
                        <v-list>
                            <v-list-tile avatar>
                                <v-list-tile-avatar>
                                    <v-icon>gamepad</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title class="title">{{ gameProp.name }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <v-card-actions>
                            <v-btn primary dark flat small v-on:click="showOnlyStreams">Show only this game</v-btn>
                            <v-btn error dark flat small v-on:click="removeGame">Remove game</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-list-tile-action>
        </v-list-tile>
    `,
    methods: {
        showOnlyStreams: function() {
            this.$emit('show-only-streams');
        },
        removeGame: function() {
            this.$emit('remove-game');
        }
    }
}

var app = new Vue({
    el: '#app',
    data () {
        return {
            prefs: readPrefs(),
            streams: [],
            streamsLoaded: {},
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
        prefs: {
            handler(prefs, oldPrefs) {
                storePrefs(this.prefs);
            },
            deep: true
        },
        agSearch: function(val) {
            if (val) {
                this.queryGames(val);
            }
        }
    },
    components: {
        'stream-component': streamComponent,
        'game-component': gameComponent,
    },
    methods: {
        loadAllStreams: function() {
            this.prefs.gameProps.forEach((game) => {
                this.loadStreams(game.name, 0, 25);
            });
        },
        loadStreams: function(game, start, limit) {
            if (this.streamsLoaded[game]) {
                return;
            }

            console.log(game + " " + start + " " + limit)

            config = {
                params: {
                    game: game,
                    start: start,
                    limit: limit
                }
            };

            axios.get('/api', config)
                .then(
                    function (response) {
                        console.log(response);

                        if (response.data && response.data.streams) {
                            this.appendStreams(response.data.streams);
                        }

                        this.streamsLoaded[game] = true;
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
            this.closeMenu(game);

            this.prefs.gameProps.forEach((game) => {
                if (game.name == gameName) {
                    game.display = true;
                } else {
                    game.display = false;
                }
            })
        },
        addGame: function() {
            if (this.agSelect && !this.gameIdxs.hasOwnProperty(this.agSelect)) {
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
            this.closeMenu(game);

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

                        if (!response.data || !response.data.games) {
                            return;
                        }

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
        },
        closeMenu: function(game) {
            let idx = this.gameIdxs[game];
            this.prefs.gameProps[idx].menu = false;
        }
    },
    created: function() {
        this.loadAllStreams();
    }
});