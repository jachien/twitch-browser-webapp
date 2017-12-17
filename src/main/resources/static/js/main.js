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
                    <v-container class="stream_preview_overlay" fill-height fluid>
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
    data() {
        return {
            clientId: clientId, // must be defined by whatever is including this js file
            state: state,
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
        gameProps: function() {
            return state.prefs.gameProps;
        }
    },
    watch: {
        'state.prefs': {
            handler(prefs, oldPrefs) {
                //console.log("prefs:\n" + prefs.getDebugString());
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
            this.gameProps.forEach((game) => {
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
            this.gameProps.forEach((game) => {
                game.display = true;
            })
        },
        filterStreams: function(gameName) {
            this.closeMenu(gameName);

            this.gameProps.forEach((game) => {
                if (game.name == gameName) {
                    game.display = true;
                } else {
                    game.display = false;
                }
            })
        },
        addGame: function() {
            if (this.agSelect && !this.state.gamePropMap.hasOwnProperty(this.agSelect)) {
                this.agItems.some((game) => {
                    if (this.agSelect == game) {
                        this.state.addGame(game);
                        // don't need to load streams here, prefs watcher takes care of it
                        return true;
                    }
                    return false;
                });
            }
        },
        removeGame: function(gameName) {
            this.state.removeGame(gameName);
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
        closeMenu: function(gameName) {
            this.state.closeMenu(gameName);
        },

    },
    created: function() {
        this.loadVisibleStreams();
    }
});
