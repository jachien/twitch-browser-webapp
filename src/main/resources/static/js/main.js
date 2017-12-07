var streamComponent = {
    props: ['stream', 'gamePropMap', 'gameColorMap'],
    template: `
        <v-card
            class="stream_item"
            v-show="gamePropMap.hasOwnProperty(stream.gameName) && gamePropMap[stream.gameName].display"
            v-bind:id="'stream-' + stream.channelId"
        >
            <a v-bind:href="stream.channelUrl">
                <v-card-media v-bind:src="stream.previewUrl" height="180px" contain>
                    <v-container class="stream_preview" fill-height fluid>
                      <v-layout>
                        <v-flex>
                          <div class="title channel_name">{{stream.displayName}}</div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                </v-card-media>
            </a>
            <v-card-text class="stream_card_text" v-bind:style="'background:'+gameColorMap[stream.gameName]+';'">
                <div class="stream_text">
                    <div><strong><a v-on:click="filterStreams">{{stream.gameName}}</a></strong></div>
                </div>
            </v-card-text>
            <v-card-text class="stream_card_text">
                <div class="stream_text">
                    <div><a v-bind:href="stream.channelUrl">{{stream.status}}</a></div>
                    <div>{{stream.numViewers}} viewers</div>
                </div>
            </v-card-text>
        </v-card>
    `,
    methods: {
        filterStreams: function() {
            this.$emit('filter-streams');
        }
    }
};

var gameComponent = {
    props: ['gameProp', 'auxProp'],
    template: `
        <v-list-tile @click="">
            <v-list-tile-action>
                <v-switch v-model="gameProp.display"></v-switch>
            </v-list-tile-action>
            <v-list-tile-content v-bind:title="gameProp.name">
                <v-list-tile-title>
                    <a v-on:click="filterStreams">{{ gameProp.name }}</a>
                </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-menu
                    offset-y
                    :close-on-content-click="false"
                    v-model="auxProp.menu"
                >
                    <v-btn icon slot="activator">
                        <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                    <v-card>
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
                            <v-btn color="primary" flat small v-on:click="filterStreams">Show only this game</v-btn>
                            <v-btn color="error" flat small v-on:click="removeGame">Remove game</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-list-tile-action>
        </v-list-tile>
    `,
    methods: {
        filterStreams: function() {
            this.$emit('filter-streams');
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
            clientId: clientId, // needs to be defined by whatever is including this js file
            prefs: {},
            auxData: {},
            streams: [],
            streamsLoaded: {},  // cache of successful /api/streams calls made, but doesn't contain the responses
            agSelect: "",       // add game autocomplete selected item
            agItems: [],
            agSearch: null,     // add game search input
            agLoading: false,
            drawer: true,
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
                //console.log("prefs:\n" + getPrefsDebugString(prefs));

                storePrefs(this.prefs);
                this.loadVisibleStreams();
            },
            deep: true
        },
        agSearch: function(val) {
            this.queryGames(val);
        }
    },
    components: {
        'stream-component': streamComponent,
        'game-component': gameComponent,
    },
    methods: {
        loadVisibleStreams: function() {
            this.prefs.gameProps.forEach((game) => {
                if (game.display) {
                    this.loadStreams(game.name, 0, 25);
                }
            });
        },
        loadStreams: function(game, start, limit) {
            if (this.streamsLoaded[game]) {
                return;
            }

            this.streamsLoaded[game] = true; // eagerly mark streams as loaded, unmark if ajax call errors
            console.log(game + " " + start + " " + limit);

            config = {
                params: {
                    game: game,
                    start: start,
                    limit: limit
                }
            };

            axios.get('/api/streams', config)
                .then(
                    function (response) {
                        console.log("streams request for " + game + " complete");
                        console.log(response);

                        if (response.data && response.data.streams) {
                            this.appendStreams(response.data.streams);
                        }
                    }.bind(this)
                ).catch(
                    function (error) {
                        console.log(error);
                        this.streamsLoaded[game] = false;
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
        filterStreams: function(gameName) {
            this.closeMenu(gameName);

            this.prefs.gameProps.forEach((game) => {
                if (game.name == gameName) {
                    game.display = true;
                } else {
                    game.display = false;
                }
            })
        },
        addGame: function() {
            if (this.agSelect && !this.gamePropMap.hasOwnProperty(this.agSelect)) {
                this.agItems.some((game) => {
                    if (this.agSelect == game) {
                        this.initAuxProp(game);

                        let prop = createGameProp(game);
                        this.prefs.gameProps.push(prop);
                        // don't need to load streams here, prefs watcher takes care of it
                        return true;
                    }
                    return false;
                });
            }
        },
        removeGame: function(game) {
            this.closeMenu(game);

            let idx = 0;
            while (idx < this.prefs.gameProps.length) {
                if (this.prefs.gameProps[idx].name == game) {
                    this.prefs.gameProps.splice(idx, 1);
                    return;
                }
                idx++;
            }
        },
        queryGames: function(gameName) {
            if (!gameName) {
                this.agItems = [];
                return;
            }

            this.agLoading = true;

            config = {
                params: {
                    query: gameName,
                    client_id: this.clientId,
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
            this.auxData[game].menu = false;
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
        let prefs = readPrefs();
        // app.auxData needs to be updated before app.prefs is updated
        this.initAuxData(prefs);
        this.prefs = prefs;
        this.loadVisibleStreams();
    }
});
