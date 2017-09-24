<html>
<head>
    <meta charset="UTF-8"/>
    <title>Twitch Browser</title>
    <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
    <link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet">
    <link type="text/css" href="/css/twitchbrowser.css" rel="stylesheet"/>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.4/vue.js"></script>
    <script src="https://unpkg.com/vuetify/dist/vuetify.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/js/preferences.js"></script>
    <script src="/js/main.js"></script>

    <#-- 
        hide content before vue renders it 
        http://vuetips.com/v-cloak-directive-hides-html-on-startup
    -->
    <style>
        [v-cloak] {
            display: none;
        }
    </style>
</head>
<body>
    <div id="app" v-cloak>
        <v-app id="browser-app" toolbar footer dark>
            <v-navigation-drawer
              persistent
              clipped
              v-model="drawer"
              enable-resize-watcher
              dark
            >
                <v-list dense>
                    <v-list-tile avatar @click="showAllStreams()">
                        <v-list-tile-avatar>
                            <v-icon>remove_red_eye</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>Show all streams</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-subheader>Games</v-subheader>
                    
                    <#-- games list -->
                    <v-list-tile
                        v-for="game in prefs.gameProps"
                        :key="game.name"
                        v-bind:prefs="prefs" 
                        @click=""
                    >
                        <v-list-tile-action>
                            <v-switch dark v-model="prefs.gameProps[gameIdxs[game.name]].display"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content v-bind:title="game.name">
                            <v-list-tile-title>
                                {{ game.name }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-menu 
                                offset-y
                                :close-on-content-click="false"
                                v-model="prefs.gameProps[gameIdxs[game.name]].menu"
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
                                                <v-list-tile-title class="title">{{ game.name }}</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                    <v-card-actions>
                                        <v-btn primary dark flat small @click="showOnlyStreams(game.name); prefs.gameProps[gameIdxs[game.name]].menu=false">Show only this game</v-btn>
                                        <v-btn error dark flat small @click="removeGame(game.name); prefs.gameProps[gameIdxs[game.name]].menu=false">Remove game</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar dark fixed>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>Twitch Browser</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn primary dark @click="addGame()">Add game</v-btn>
                <v-select
                    label="Find games"
                    autocomplete
                    :async-loading="agLoading"
                    dark
                    cache-items
                    :items="agItems"
                    :search-input.sync="agSearch"
                    :no-data-text="`No matching games available`"
                    v-model="agSelect"
                ></v-select>
            </v-toolbar>
            <main>
                <v-container fluid>
                    <stream-component 
                        v-for="stream in streams" 
                        :key="stream.channelId" 
                        v-bind:stream="stream"
                        v-bind:prefs="prefs"
                        v-bind:game-idxs="gameIdxs"
                    ></stream-component>

                    <#-- spacer to avoid fixed footer overlapping content -->
                    <div class="ma-4" />
                </v-container>
            </main>
            <v-footer fixed dark>
                <span class="white--text"></span>
            </v-footer>
        </v-app>
    </div>

    <script type="text/javascript">
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
        }

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
                                storePrefs(this.prefs);
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
                    storePrefs(this.prefs);
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
        })
    </script>
</body>
</html>