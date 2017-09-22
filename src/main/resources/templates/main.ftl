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
                        <!-- 
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <v-icon>home</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Home</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile> 
                        -->
                        <v-list-tile
                          v-for="game in games"
                          :key="game"
                          @click=""
                        >
                          <v-list-tile-content>
                            <v-list-tile-title>
                              {{ game }}
                            </v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-navigation-drawer>
                <v-toolbar dark fixed>
                     <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                    <v-toolbar-title>Twitch Browser</v-toolbar-title>
                </v-toolbar>
                <main>
                    <v-container fluid>
                        <stream-component v-for="stream in streams" :key="stream.channelId" v-bind:stream="stream"></stream-component>

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
            props: ['stream'],
            template: `
                <div class="stream_item" v-bind:id="'stream-' + stream.channelId">
                    <div><a v-bind:href="stream.channelUrl"><img v-bind:src="stream.previewUrl"/></a></div>
                    <div>{{stream.status}}</div>
                    <div><strong>{{stream.displayName}}</strong> playing <strong>{{stream.gameName}}</strong></div>
                    <div>{{stream.numViewers}} viewers</div>
                </div>
            `
        }

        var app = new Vue({
            el: '#app',
            data () {
                return {
                    content: 'Loading streams...',
                    games: readGames(),
                    streams: [],
                    drawer: true
                }

            },
            components: {
                'stream-component': streamComponent
            },
            methods: {
                loadAllStreams: function() {
                    games = readGames()
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

                }
            },
            created: function() {
                this.loadAllStreams();
            }
        })
    </script>
</body>
</html>