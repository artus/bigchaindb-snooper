class BigchainDBSnooper {
    constructor(baseUrl) {
        this.url = baseUrl + "/api/v1/"
    }

    queryAssets(queryString, callback) {
        this.sendRequest("assets/?search=" + queryString, callback);
    }

    getTransactions(assetId, callback) {
        this.sendRequest("transactions?asset_id=" + assetId, callback);
    }

    sendRequest(path, callback) {
        let request = new XMLHttpRequest();

        request.onreadystatechange = () => {

            // Check if the request succeeded
            if (request.status == 200 && request.readyState == 4) {
                callback(JSON.parse(request.response));
            }
        };

        request.open('GET', this.url + path);
        request.send();
    }
}

var snooper = new Vue({
    el: "#snooper",
    data: {
        snooperApi: new BigchainDBSnooper("https://test.bigchaindb.com"),
        assets: new Array(),
        transactions: new Array(),

        // Delay query
        isTyping: false,
        isLoading: false,

        // Transaction snooping
        currentTransaction: undefined,

        // Input fields
        searchInput: "",
    },
    methods: {
        resetSearchInput() {
            this.searchInput = "";
            this.assets = new Array();
            this.transactions = new Array();
            this.currentTransaction = undefined;
        },
        onAssetQueryResponse(response) {
            this.stopLoading();
            this.assets = response;
        },
        onTransactionsResponse(response) {
            this.transactions = response;
        },
        startLoading() {
            this.isLoading = true;
        },
        stopLoading() {
            this.isLoading = false;
        },
        onSearchInputChange() {
            if (this.searchInput == "") 
            {
                this.stopLoading();
                this.assets = new Array();
            }
            else {
                this.assets = new Array();
                this.startLoading();
                this.isTyping = true;

                setTimeout(() => {
                    this.isTyping = false;
                }, 500);
                setTimeout(() => {
                    this.requestAssetQuery();
                }, 1000);
            }
        },
        requestAssetQuery() {
            if (!this.isTyping)
                this.snooperApi.queryAssets(this.searchInput, this.onAssetQueryResponse);
        },
        displayAssetTransactions(assetId) {
            this.snooperApi.getTransactions(assetId, this.onTransactionsResponse);
        },
        displayTransactionDetails(transaction) {
            this.currentTransaction = transaction;
        }
    }
});
