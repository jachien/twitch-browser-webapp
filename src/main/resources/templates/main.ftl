<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/js/preferences.js"></script>
    <script src="/js/main.js"></script>
</head>
<body>
    <div id="app">
        <pre>
{{ content }}
        </pre>
    </div>

    <script type="text/javascript">
        var app = new Vue({
          el: '#app',
          data: {
            content: 'Loading streams...',
            results: {}
          }
        })

        loadAllStreams();
    </script>
</body>
</html>