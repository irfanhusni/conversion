// Business
(function() {
    this.setProductDescription = function () {
        var columnSet = ["description"];
        var productWrapper = this.getRelated("xts_productid", columnSet);
        var product = productWrapper ? productWrapper.xrmEntity : {};

        this.set("xts_productdescription", product.description);
    };

    this.setAmountBeforeDiscount = function () {
        var unitPriceLaborRate = this.val("xts_unitpricelaborrate");
        var qtyHourActual = this.val("xts_qtymanhouractual");
        var amountBeforeDiscount = this.get("xts_amountbeforediscount");

        this.set("xts_amountbeforediscount", qtyHourActual * unitPriceLaborRate);
        if (amountBeforeDiscount != null) {
            this.setAmountAfterDiscount();
        }
    };

    this.setAmountAfterDiscount = function () {
        var amountBeforeDiscount = this.val("xts_amountbeforediscount");
        var discountAmount = this.val("xts_discountamount");

        this.set("xts_amountafterdiscount", amountBeforeDiscount - discountAmount);
        this.attr("xts_amountafterdiscount").fireOnChange();
    };

    this.setDiscountAmount = function () {
        var amountBeforeDiscount = this.val("xts_amountbeforediscount");
        var discount = this.val("xts_discount");

        this.set("xts_discountamount", amountBeforeDiscount * (discount / 100));

    };

    this.setDiscount = function () {
        var amountBeforeDiscount = this.val("xts_amountbeforediscount");
        var discountAmount = this.val("xts_discountamount");

        this.set("xts_discount", (discountAmount / amountBeforeDiscount) * 100);
    };

    this.setTax1BaseCalculation = function () {
        var tax1 = this.get("xts_tax1id");
        var taxRate = 0;
        var baseAmount = 0;

        if (tax1 != null)
        {
            var columnSet = ["xts_basecalculation"];
            var taxWrapper = this.getRelated("xts_tax1id", columnSet);
            var tax = taxWrapper ? taxWrapper.xrmEntity : {};

            var vsoColumnSet = ["xts_transactiondate"];
            var vsoWrapper = this.getRelated("xts_vehiclesalesquoteid", vsoColumnSet);
            var vso = vsoWrapper ? vsoWrapper.xrmEntity : {};

            this.set("xts_tax1basecalculation", tax._source.attributes["xts_basecalculation"].formattedValue);
            this.validateTaxBaseCalculation();

            var taxMasterDetail = xts_vsl.Data.xts_vehiclesalesquotedetail.getTaxMasterDetail(tax.id, vso._source.attributes["xts_transactiondate"].formattedValue);
            taxRate = taxMasterDetail["xts_taxrate"].formattedValue;
            baseAmount = this.setTax1Amount(taxRate);
        }
        else
        {
            baseAmount = this.setTax1Amount(taxRate);
            this.set("xts_tax2basecalculation", null);
        }
        this.set("xts_baseamount", baseAmount);
        this.setTrasactionAmount();
    };

    this.setTax2BaseCalculation = function () {
        var tax2 = this.get("xts_tax2id");
        var taxRate = 0;
        var baseAmount = 0;

        if (tax2 != null) {
            var columnSet = ["xts_basecalculation"];
            var taxWrapper = this.getRelated("xts_tax2id", columnSet);
            var tax = taxWrapper ? taxWrapper.xrmEntity : {};

            var vsoColumnSet = ["xts_transactiondate"];
            var vsoWrapper = this.getRelated("xts_vehiclesalesquoteid", vsoColumnSet);
            var vso = vsoWrapper ? vsoWrapper.xrmEntity : {};

            this.set("xts_tax2basecalculation", tax._source.attributes["xts_basecalculation"].formattedValue);
            this.validateTaxBaseCalculation();

            var taxMasterDetail = xts_vsl.Data.xts_vehiclesalesquotedetail.getTaxMasterDetail(tax.id, vso._source.attributes["xts_transactiondate"].formattedValue);
            var taxRate = taxMasterDetail["xts_taxrate"].formattedValue;
            baseAmount = this.setTax2Amount(taxRate);
        }
        else
        {
            baseAmount = this.setTax2Amount(taxRate);
            this.set("xts_tax2basecalculation", null);
        }
        this.set("xts_baseamount", baseAmount);
        this.setTrasactionAmount();
    };

    this.validateTaxBaseCalculation = function () {        
        if (this.get("xts_tax1basecalculation") != null && this.get("xts_tax2basecalculation") != null) {
            if (this.val("xts_tax1basecalculation") != this.val("xts_tax2basecalculation")) {
                alert("error test");
            }
        }
    };

    this.setTax1Amount = function (taxRate) {
        var amountAfterDiscount = this.val("xts_amountafterdiscount");
        var tax1BaseCalculation = this.val("xts_tax1basecalculation");
        var tax2Amount = this.val("xts_tax2amount");
        var taxAmount = null;
        var baseAmount = 0;

        if (tax1BaseCalculation == "Tax-inclusive") {
            taxAmount = amountAfterDiscount - Math.round((amountAfterDiscount / (1 + (taxRate / 100))));
        }
        else if (tax1BaseCalculation == "Tax-exclusive") {
            taxAmount = Math.round((taxRate / 100) * amountAfterDiscount);
        }
        baseAmount = amountAfterDiscount - (taxAmount + tax2Amount);
        this.set("xts_tax1amount", taxAmount);

        return baseAmount;
    };

    this.setTax2Amount = function (taxRate) {
        var amountAfterDiscount = this.val("xts_amountafterdiscount");
        var tax2BaseCalculation = this.val("xts_tax2basecalculation");
        var tax1Amount = this.val("xts_tax1amount");
        var taxAmount = null;
        var baseAmount = 0;

        if (tax2BaseCalculation == "Tax-inclusive") {
            taxAmount = amountAfterDiscount - Math.round((amountAfterDiscount / (1 + (taxRate / 100))));
        }
        else if (tax2BaseCalculation == "Tax-exclusive") {
            taxAmount = Math.round((taxRate / 100) * amountAfterDiscount);
        }
        baseAmount = amountAfterDiscount - (taxAmount + tax1Amount);
        this.set("xts_tax2amount", taxAmount);

        return baseAmount;
    };

    this.setTrasactionAmount = function () {
        var baseAmount = this.val("xts_baseamount");
        var tax1Amount = this.val("xts_tax1amount");
        var tax2Amount = this.val("xts_tax2amount");

        this.set("xts_transactionamount", baseAmount + tax1Amount + tax2Amount);
    };
    
    
}.call(xts_vsl.Business.xts_vehiclesalesquotedetail = xts_vsl.Business.xts_vehiclesalesquotedetail || {}));