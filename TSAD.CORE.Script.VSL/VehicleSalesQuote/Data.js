// Data
(function () {
    this.getTaxMasterDetail = function (taxMasterId, effectiveDate) {
        var fetchXml = [
            "<fetch mapping='logical' distinct='false' count='1'>",
              "<entity name='xts_taxmasterdetail'>",
                "<attribute name='xts_taxrate' />",
                "<attribute name='xts_effectivedate' />",
                "<filter type='and'>",
                  "<condition attribute='xts_taxid' operator='eq' value='" + taxMasterId + "' />",
                  "<condition attribute='xts_effectivedate' operator='lt' value='" + effectiveDate + "' />",
                "</filter>",
                "<order attribute='xts_effectivedate' descending='true' />",
              "</entity>",
            "</fetch>"
        ].join("");
        var soapEntities = XrmServiceToolkit.Soap.Fetch(fetchXml, true);
        if (soapEntities.length === 0) return null;
        return soapEntities[0].attributes;
    };
}.call(xts_vsl.Data.xts_vehiclesalesquote = xts_vsl.Data.xts_vehiclesalesquote || {}));