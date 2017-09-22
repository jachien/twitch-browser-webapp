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
</head>
<body>
    <div id="app">
        <!-- <pre>
{{ content }}
        </pre> -->

        
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
                        
                        <v-list-group v-for="game in games"
                            :key="game"
                            v-bind:game-props="gameProps"
                        >
                            <v-list-tile slot="item" @click="">
                                <v-list-tile-action>
                                    <v-switch dark v-model="gameProps[game].display"></v-switch>
                                </v-list-tile-action>
                                <v-list-tile-content v-bind:title="game">
                                    <v-list-tile-title>
                                        {{ game }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-icon>keyboard_arrow_down</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>Remove</v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-icon>clear</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list-group> 

                        <!-- <game-component 
                            v-for="game in games" 
                            :key="game" 
                            v-bind:game="game"
                            v-bind:game-props="gameProps"
                        ></game-component> -->
                    </v-list>
                </v-navigation-drawer>
                <v-toolbar dark fixed>
                     <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                    <v-toolbar-title>Twitch Browser</v-toolbar-title>
                </v-toolbar>
                <main>
                    <v-container fluid>
                        <stream-component 
                            v-for="stream in streams" 
                            :key="stream.channelId" 
                            v-bind:stream="stream"
                            v-bind:game-props="gameProps"
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
            props: ['stream', 'gameProps'],
            template: `
                <div class="stream_item" v-show="gameProps[stream.gameName].display" v-bind:id="'stream-' + stream.channelId">
                    <div><a v-bind:href="stream.channelUrl"><img v-bind:src="stream.previewUrl"/></a></div>
                    <div><strong>{{stream.displayName}}</strong></div>
                    <div>{{stream.status}}</div>
                    <div><strong>{{stream.gameName}}</strong></div>
                    <div>{{stream.numViewers}} viewers</div>
                </div>
            `
        }

        var gameComponent = {
            props: ['game', 'gameProps'],
            template: `
                <v-list-group>
                    <v-list-tile slot="item" @click="">
                        <v-list-tile-action>
                            <v-switch dark v-model="gameProps[game].display"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content v-bind:title="game">
                            <v-list-tile-title>
                                {{ game }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>Remove</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>clear</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group> 
            `
        }

        var app = new Vue({
            el: '#app',
            data () {
                return {
                    content: 'Loading streams...',
                    gameProps: readGames(),
                    streams: [],
                    display: {},
                    drawer: true
                }

            },
            computed: {
                games: function() {
                    let gameNames = [];
                    for (let gameName in this.gameProps) {
                        gameNames.push(gameName);
                    }
                    gameNames.sort();
                    return gameNames;
                }
            },
            components: {
                'stream-component': streamComponent,
                'game-component': gameComponent
            },
            methods: {
                loadAllStreams: function() {
                    games = this.games;
                    for (var i=0; i < games.length; i++) {
                        this.loadStreams(games[i], 0, 25);
                    }
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
                    
                    console.log(config);
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
                    var mergedStreams = this.streams.concat(newStreams);
                    mergedStreams.sort(function(a, b) {
                        return b.numViewers - a.numViewers;
                    });
                    this.streams = mergedStreams;
                },
                showAllStreams: function() {
                    this.games.forEach((game) => {
                        this.gameProps[game].display = true;
                    })
                }
            },
            created: function() {
                this.loadAllStreams();
            }
        })
    </script>
</body>
</html>