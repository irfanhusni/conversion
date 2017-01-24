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
    }
}.call(xts_vsl.Events.xts_vehiclesalesquotedetail = xts_vsl.Events.xts_vehiclesalesquotedetail || {}));