// Events
(function() {
    this.formOnLoad = function() {
        if (Xrm.Page.ui.getFormType() === constants.FORMTYPE_CREATE) {
            fx.common.setBusinessUnitFromOwner("xts_businessunitid");            
        }
    };

    this.owneridOnChange = function() {
        fx.common.setBusinessUnitFromOwner("xts_businessunitid");        
    };

    this.xts_businessunitidOnChange = function () {
        fx.common.setOwnerFromBusinessUnit("xts_businessunitid");
    };

    this.xts_productidOnChange = function () {
        this.business.setProductDescription();
    };

    this.xts_unitpricelaborrateOnChange = function () {
        this.business.setAmountBeforeDiscount();
    };

    this.xts_qtymanhouractualOnChange = function () {
        this.business.setAmountBeforeDiscount();
    };

    this.xts_amountbeforediscountOnChange = function () {
        this.business.setAmountAfterDiscount();
    };

    this.xts_discountamountOnChange = function () {
        this.business.setDiscount();
        this.business.setAmountAfterDiscount();        
    };

    this.xts_discountOnChange = function () {
        this.business.setDiscountAmount();
        this.business.setAmountAfterDiscount();        
    };

    this.xts_tax1OnChange = function () {
        this.business.setTax1BaseCalculation();        
    };

    this.xts_tax2OnChange = function () {
        this.business.setTax2BaseCalculation();
    };

    this.xts_amountafterdiscountOnChange = function () {
        this.business.setTax1BaseCalculation();
        this.business.setTax2BaseCalculation();
    };

}.call(xts_vsl.Events.xts_vehiclesalesquotedetail = xts_vsl.Events.xts_vehiclesalesquotedetail || {}));