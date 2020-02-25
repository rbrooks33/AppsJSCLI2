    var Me = {
        Items: [],
        Initialize: function () {
            var qs_vars = [], hash;
            var q = document.URL.split('?')[1];
            if (q !== undefined) {
                q = q.split('&');
                for (var i = 0; i < q.length; i++) {
                    hash = q[i].split('=');
                    qs_vars.push(hash[1]);
                    qs_vars[hash[0].toLowerCase()] = hash[1]; //this implementation forces lowercase
                }
            }
            Me.Items = qs_vars;
        }
    };
export { Me as QueryStrings };