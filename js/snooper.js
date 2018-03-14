class BigchainDBSnooper 
{
    constructor(baseUrl)
    {
        this.url = baseUrl + "/api/v1/"
    }

    queryAssets(queryString, callback) {

        let request = new XMLHttpRequest();

        request.onreadystatechange = () => {

            // Check if the request succeeded
            if (request.status == 200 && request.readyState == 4) {
                callback(JSON.parse(request.response));
            }
        };

        request.open('GET', this.url + "assets/?search=" + queryString);
        request.send();
    }
}

var snooper = new Vue({
    el: "#snooper",
    data: {
        snooperApi: new BigchainDBSnooper("https://test.bigchaindb.com"),
        assets: new Array(),
        
        // Input fields
        searchInput: "",
    },
    methods: {
        onAssetQueryResponse(response) {
            this.assets = response;
        },
        onSearchInputChange() {
            if (this.searchInput == "") this.assets = new Array();
            else this.snooperApi.queryAssets(this.searchInput, this.onAssetQueryResponse);
        }

    }
});
