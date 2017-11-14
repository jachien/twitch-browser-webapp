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

        .container {
            height: 400px;
            display: flex;
            flex-flow: column wrap;
            justify-content: center;
            align-items: center;
        }

        .item {
            text-align: center;
        }

        main {
            background: #303030;
        }
    </style>
</head>
<body>
    <div id="app" v-cloak>
        <v-app dark>
            <v-toolbar app>
                <v-icon>ondemand_video</v-icon>
                <v-toolbar-title>Twitch Browser</v-toolbar-title>
            </v-toolbar>
            <v-content>
                <#-- todo: recreate this using vuetify -->
                <div class="container">
                    <div class="item"><h1>404 Not Found :(</h1></div>
                    <#-- todo: make host configurable -->
                    <div class="item"><a href="https://streams.jchien.org">streams.jchien.org</a></div>
                </div>
            </v-content>
            <v-footer app>
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
