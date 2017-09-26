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
                    <game-component
                        v-for="game in prefs.gameProps"
                        :key="game.name + '-' + game.createTime"
                        :game-prop="prefs.gameProps[gameIdxs[game.name]]"
                        v-on:show-only-streams="showOnlyStreams(game.name)"
                        v-on:remove-game="removeGame(game.name)"
                    ></game-component>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar dark fixed>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>Twitch Browser</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn primary dark @click="addGame()">Add game</v-btn>
                <v-select
                    autocomplete
                    :async-loading="agLoading"
                    dark
                    cache-items
                    append-icon="search"
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

    <script src="/js/main.js"></script>
</body>
</html>