// Business
(function() {
    this.setProductDescription = function () {
        var columnSet = ["description"];
        var productWrapper = this.getRelated("xts_productid", columnSet);
        var product = productWrapper ? productWrapper.xrmEntity : {};

        this.set("xts_description", product.description);
    };
}.call(xts_vsl.Business.xts_vehiclesalesquotedetail = xts_vsl.Business.xts_vehiclesalesquotedetail || {}));