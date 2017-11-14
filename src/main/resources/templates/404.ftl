<html>
<head>
    <meta charset="UTF-8"/>
    <title>Twitch Browser</title>
    <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
    <link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.3/vue.js"></script>
    <script src="https://unpkg.com/vuetify/dist/vuetify.js"></script>

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
        <v-app dark>
            <v-toolbar app fixed>
                <v-icon>ondemand_video</v-icon>
                <v-toolbar-title>Twitch Browser</v-toolbar-title>
            </v-toolbar>
            <main>
                <v-content>
                    <v-container fill-height>
                        <v-layout row wrap align-center>
                            <v-flex class="text-xs-center">
                                <h1>404 Not Found :(</h1>
                                <div><a href="https://streams.jchien.org">streams.jchien.org</a></div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-content>
            </main>
            <v-footer app fixed>
                <span class="white--text"></span>
            </v-footer>
        </v-app>
    </div>

    <script type="text/javascript">
        var app = new Vue({
            el: '#app',
            data: {}
        });
    </script>
</body>
</html>
