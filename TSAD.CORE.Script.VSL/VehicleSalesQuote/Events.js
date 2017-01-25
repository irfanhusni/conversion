// Events
(function () {
    this.formOnLoad = function () {
        if (Xrm.Page.ui.getFormType() === constants.FORMTYPE_CREATE) {
            fx.common.auto365.setBusinessUnitFromOwner("xts_businessunitid");
        }
        this.business.setTransactionDate();
    };

    this.formOnSave = function () {
        this.business.setTotalVehicleAmount();
        this.business.setTotalAmountBeforeDiscount();
        this.business.setTotalDiscountAmount();
        this.business.setTotalAmountAfterDiscount();
        this.business.setTotalBaseAmount();
        this.business.setTotalTaxAmount();
        this.business.setTotalAccessoriesAmount();
        this.business.setGrandTotal();
    };

    this.owneridOnChange = function () {
        fx.common.auto365.setBusinessUnitFromOwner("xts_businessunitid");
    };

    this.xts_businessunitidOnChange = function () {
        fx.common.auto365.setOwnerFromBusinessUnit("xts_businessunitid");
    };

    this.xts_priceoptionOnChange = function () {
        this.business.setTitleRegistrationFee();
    };

    this.xts_productidOnChange = function () {
        this.business.setProductDescription();
    };

    this.xts_opportunityidOnChange = function () {
        this.business.setPotentialCustomer();
    };

    this.xts_vehiclediscountpercentageOnChange = function () {
        this.business.calculateDiscount("VehicleDiscountPercentage");
        this.business.setVehicleAfterDiscount();
    };

    this.xts_vehiclediscountOnChange = function () {
        this.business.calculateDiscount("VehicleDiscount");
        this.business.setVehicleAfterDiscount();
    };

    this.xts_vehicleamountOnChange = function () {
        this.business.setVehicleAfterDiscount();
    };

    this.xts_tax1idOnChange = function () {
        this.business.setBaseCalculation("tax1");
        this.business.validateTaxBaseCalculation();
    };

    this.xts_tax2idOnChange = function () {
        this.business.setBaseCalculation("tax2");
        this.business.validateTaxBaseCalculation();
    };

    this.xts_vehicletax1OnChange = function () {
        this.business.setVehicleTax("tax1");
        this.business.setVehicleTax("tax2");
        this.business.setVehicleBase();
        this.business.setTotalVehicleAmount();
    };

    this.xts_vehicletax2OnChange = function () {
        this.business.setVehicleTax("tax1");
        this.business.setVehicleTax("tax2");
        this.business.setVehicleBase();
        this.business.setTotalVehicleAmount();
    };

    this.xts_vehicleafterdiscountOnChange = function () {
        this.business.setVehicleTax("tax1");
        this.business.setVehicleTax("tax2");
        this.business.setVehicleBase();
        this.business.setTotalVehicleAmount();
    };

    this.xts_vehiclebaseOnChange = function () {
        this.business.setVehicleTax("tax1");
        this.business.setVehicleTax("tax2");
        this.business.setVehicleBase();
        this.business.setTotalVehicleAmount();
    };

    this.xts_totalvehicleamountOnChange = function () {
        this.business.setVehicleTax("tax1");
        this.business.setVehicleTax("tax2");
        this.business.setVehicleBase();
        this.business.setTotalVehicleAmount();
    };
}.call(xts_vsl.Events.xts_vehiclesalesquote = xts_vsl.Events.xts_vehiclesalesquote || {}));