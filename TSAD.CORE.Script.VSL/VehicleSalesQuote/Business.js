// Business
(function() {
    this.setTransactionDate = function () {
        var transactionDate = this.get("xts_transactiondate");
        if (transactionDate == undefined) {
            if (transactionDate == null) {
                this.set("xts_transactiondate", new Date());
            }
        }
        
    };

    this.setTitleRegistrationFee = function () {
        var isOffRoad = this.get("xts_priceoption") === constants.VEHICLESALESQUOTE_PRICEOPTION_OFFTHEROAD;
        if (isOffRoad) { this.set("xts_titleregistrationfee", null); }
        this.control("xts_titleregistrationfee").setDisabled(isOffRoad);
    };

    this.setProductDescription = function () {
        var product = this.get("xts_productid");
        if (product != undefined) {
            if (product != null && product.length > 0) {
                var ProductDescWrapper = this.getRelated("xts_productid", ["description"]);
                var ProductDesc = ProductDescWrapper ? ProductDescWrapper.xrmEntity : {};
                this.set("xts_productdescription", ProductDesc.description);
            }
        }
    };

    this.setPotentialCustomer = function () {
        var opportunity = this.get("xts_opportunityid");
        if (opportunity != undefined) {
            if (opportunity != null && opportunity.length > 0) {
                var OpportunityPotentialCustomerWrapper = this.getRelated("xts_opportunityid", ["customerid"]);
                var OpportunityPotentialCustomer = OpportunityPotentialCustomerWrapper ? OpportunityPotentialCustomerWrapper.xrmEntity : {};
                this.set("xts_potentialcustomerid", OpportunityPotentialCustomer.customerid);
            }
        }
    };

    this.calculateDiscount = function (triggerAttribute) {
        if (triggerAttribute == "VehicleDiscountPercentage")
        {
            var vehicleAmount = this.val("xts_vehicleamount");
            var discountPercentage = this.val("xts_vehiclediscountpercentage");
            var vehicleDiscount = Math.round(((discountPercentage / 100) * vehicleAmount)*10000)/10000;
            this.set("xts_vehiclediscount", vehicleDiscount);
        }
        else if (triggerAttribute == "VehicleDiscount")
        {
            var vehicleAmount = this.val("xts_vehicleamount");
            var vehicleDiscount = this.val("xts_vehiclediscount");
            var discountPercentage = Math.round(((vehicleDiscount / vehicleAmount) * 100)*100)/100;
            this.set("xts_vehiclediscountpercentage", discountPercentage);
        }
    };

    this.setVehicleAfterDiscount = function () {
        var vehicleAmount = this.val("xts_vehicleamount");
        var vehicleDiscount = this.val("xts_vehiclediscount");
        var vehicleAfterDiscount = vehicleAmount - vehicleDiscount;
        this.set("xts_vehicleafterdiscount", vehicleAfterDiscount);
        this.attr("xts_vehicleafterdiscount").fireOnChange();
    };

    this.setBaseCalculation = function (taxNumber) {
        var tax = this.get("xts_" + taxNumber + "id");
        if (tax != undefined) {
            if (tax != null && tax.length > 0) {
                var TaxWrapper = this.getRelated("xts_" + taxNumber + "id", ["xts_basecalculation"]);
                var Tax = TaxWrapper ? TaxWrapper.xrmEntity : {};
                this.set("xts_" + taxNumber + "basecalculation", Tax._source.attributes.xts_basecalculation.formattedValue);
            }
        }
    };

    this.validateTaxBaseCalculation = function () {
        var taxBaseCalculation1 = this.get("xts_tax1basecalculation");
        var taxBaseCalculation2 = this.get("xts_tax2basecalculation");
        if (taxBaseCalculation1 != undefined && taxBaseCalculation2 != undefined) {
            if (taxBaseCalculation1 != null && taxBaseCalculation2 != null) {
                if (taxBaseCalculation1 != taxBaseCalculation2) {
                    this.auto365.showMessage("SYS0007");
                    this.set("xts_tax2id", null);
                    this.set("xts_tax2basecalculation", null);
                }
            }
        }
    };

    this.getTaxRate = function (taxNumber) {
        var tax1 = this.get("xts_" + taxNumber + "id");
        var transactionDate = this.get("xts_transactiondate");
        var formatTransactionDate = (transactionDate.getMonth() + 1) + "/" + transactionDate.getDate() + "/" + transactionDate.getFullYear();
        var taxRate = 0;
        
        if (tax1 != undefined) {
            if (tax1 != null) {
                var transactionDate = this.get("xts_transactiondate");
                var taxMasterDetail = xts_vsl.Data.xts_vehiclesalesquote.getTaxMasterDetail(tax1[0].id, formatTransactionDate);
                taxRate = taxMasterDetail["xts_taxrate"].formattedValue;
                return taxRate;
            }
        }
    };

    this.setVehicleBase = function () {
        var taxBaseCalculation = this.get("xts_tax1basecalculation");
        if (taxBaseCalculation != undefined) {
            if (taxBaseCalculation != null) {
                var vehicleAfterDiscount = this.val("xts_vehicleafterdiscount");
                var vehicleTax1 = this.val("xts_vehicletax1");
                var vehicleTax2 = this.val("xts_vehicletax2");
                if (taxBaseCalculation == "Tax-inclusive") {
                    var vehicleBase = vehicleAfterDiscount - (vehicleTax1 + vehicleTax2);
                    this.set("xts_vehiclebase", vehicleBase);
                } else if (taxBaseCalculation == "Tax-exclusive") {
                    this.set("xts_vehiclebase", vehicleAfterDiscount);
                }
            }
        }
    };

    this.setVehicleTax = function (taxNumber) {
        var vehicleTax = null;
        var taxBaseCalculation = this.get("xts_" + taxNumber + "basecalculation");
        if (taxBaseCalculation != undefined) {
            if (taxBaseCalculation != null)
            {
                var vehicleAfterDiscount = this.val("xts_vehicleafterdiscount");
                var taxRate = this.getTaxRate(taxNumber);
                if (taxBaseCalculation == "Tax-inclusive") {
                    vehicleTax = vehicleAfterDiscount - Math.round((vehicleAfterDiscount / (1 + (taxRate / 100))));
                } else if (taxBaseCalculation == "Tax-exclusive") {
                    vehicleTax = Math.round((taxRate / 100) * vehicleAfterDiscount);
                }
                this.set("xts_vehicle" + taxNumber, vehicleTax);
            }
        }
    };

    this.setTotalVehicleAmount = function () {
        var vehicleBase = this.val("xts_vehiclebase");
        var vehicleTax1 = this.val("xts_vehicletax1");
        var vehicleTax2 = this.val("xts_vehicletax2");
        var totalVehicleAmount = vehicleBase + vehicleTax1 + vehicleTax2;
        this.set("xts_totalvehicleamount", totalVehicleAmount);
        this.attr("xts_totalvehicleamount").fireOnChange();
    };

    this.setTotalAmountBeforeDiscount = function () {
        var vehicleAmount = this.val("xts_vehicleamount");
        var accessoriesAmount = this.val("xts_accessoriesamount");
        var totalAmountBeforeDiscount = vehicleAmount + accessoriesAmount;
        this.set("xts_totalbeforediscount", totalAmountBeforeDiscount);
    };

    this.setTotalDiscountAmount = function () {
        var vehicleDiscountAmount = this.val("xts_vehiclediscount");
        var accessoriesDiscountAmount = this.val("xts_accessoriesdiscount");
        var totalDiscountAmount = vehicleDiscountAmount + accessoriesDiscountAmount;
        this.set("xts_totaldiscountamount", totalAmountBeforeDiscount);
    };

    this.setTotalAmountAfterDiscount = function () {
        var vehicleAmountAfterDiscount = this.val("xts_vehicleafterdiscount");
        var accessoriesAfterDiscount = this.val("xts_accessoriesafterdiscount");
        var totalAmountAfterDiscount = vehicleAmountAfterDiscount + accessoriesAfterDiscount;
        this.set("xts_totalamountafterdiscount", totalAmountAfterDiscount);
    };

    this.setTotalBaseAmount = function () {
        var vehicleBaseAmount = this.val("xts_vehiclebase");
        var accessoriesBaseAmount = this.val("xts_accessoriesbase");
        var totalBaseAmount = vehicleBaseAmount + accessoriesBaseAmount;
        this.set("xts_totalbaseamount", totalBaseAmount);
    };

    this.setTotalTaxAmount = function () {
        var vehicleTax1Amount = this.val("xts_vehicletax1");
        var vehicleTax2Amount = this.val("xts_vehicletax2");
        var accessoriesTax1Amount = this.val("xts_accessoriestax1");
        var accessoriesTax2Amount = this.val("xts_accessoriestax2");
        var totalTaxAmount = vehicleTax1Amount + vehicleTax2Amount + accessoriesTax1Amount + accessoriesTax2Amount;
        this.set("xts_totalconsumptiontaxamount", totalTaxAmount);
    };

    this.setTotalAccessoriesAmount = function () {
        var accessoriesBaseAmount = this.val("xts_accessoriesbase");
        var accessoriesTax1Amount = this.val("xts_accessoriestax1");
        var accessoriesTax2Amount = this.val("xts_accessoriestax2");
        var totalAccessoriesAmount = accessoriesBaseAmount + accessoriesTax1Amount + accessoriesTax2Amount
        this.set("xts_totalaccessoriesamount", totalAccessoriesAmount);
    };

    this.setGrandTotal = function () {
        var totalVehicleAmount = this.val("xts_totalvehicleamount");
        var totalAccessoriesAmount = this.val("xts_totalaccessoriesamount");
        var grandTotal = totalVehicleAmount + totalAccessoriesAmount;
        this.set("xts_grandtotal", grandTotal);
    };
}.call(xts_vsl.Business.xts_vehiclesalesquote = xts_vsl.Business.xts_vehiclesalesquote || {}));