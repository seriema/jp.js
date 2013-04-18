/*global Y:false*/
Y.registerComponent('.comp-article-quantity-picker', function($main) {
    "use strict";

    var $alert               = Y.compChild($main, '.comp-alert-box.error');
    var $body                = Y.compChild($main, '> .body');

    var $quantityForm        = Y.compChild($main, '.quantity-selection');
    var $quantityValue       = Y.compChild($main, $quantityForm, '[name=quantity-value]');
    var $quantityUnit        = Y.compChild($main, $quantityForm, '[name=quantity-unit]');

    var $articleSummary      = Y.compChild($main, '.article-summary');
//  var $skuText        = Y.optChild($main, $articleSummary, '.sku-text');
    var $skuId               = Y.optChild($main, $articleSummary, '.sku-id');
    var $skuAvailable        = Y.optChild($main, $articleSummary, '.is-available');
    var $skuNotAvailable     = Y.optChild($main, $articleSummary, '.is-not-available');
    var $skuNotAvailableLink = Y.optChild($main, $skuNotAvailable, '.article-name');

    var $submitArea          = Y.compChild($main, '.article-shop');
    var $submitConfirm       = Y.optChild($main, $submitArea, '.comp-ajax-simple-action').has('.confirm');
    var $submitCancel        = Y.optChild($main, $submitArea, '.is-picker-cancel');
    var $submitCart          = Y.optChild($main, $submitArea, '.comp-ajax-simple-action').has('.add-to-cart');
    var $submitList          = Y.optChild($main, $submitArea, '.comp-ajax-tooltip-select').has('.add-to-list');
    var $submitActions       = $submitConfirm.add($submitCart).add($submitList);


    var getUrl               = Y.compData($main, 'get-url');
    var stockUrl             = Y.optData($main, 'url-stock');

    var sku, priceInfo;
    /*
     $main.on('init', initialize);
     $main.on('term', terminate);
     */
    $main.on('comp-hide', onHide);
    $main.on('comp-show', onShow);
    $main.on('comp-toggle-show', onToggleShow);

    //$submitActions.on('comp-done', onHide);
    $submitList.on('comp-done', emitAddedToList);
    $submitCart.on('comp-done', emitAddedToCart);
    Y.observe($main, $submitConfirm, 'comp-done', emitQuantityUpdated);
    $submitCancel.click(onHide);

    $quantityForm.find('select, input').change(toggleSubmitArea);
    $quantityUnit.change(onUnitSelectedChange);

    function calculatePrice() {
        var unit = $quantityUnit.val();
        var quantity = parseInt($quantityValue.val(), 10);

        if (!unit || !quantity) {
            return;
        }

        var unitPrices = priceInfo[unit].prices;

        var closestUnitPrice = 0;
        var firstStepPrice;
        var nextStep;
        $.each(unitPrices, function(currentStepString, priceString) {
            var price = parseInt(priceString, 10);
            var currentStep = parseInt(currentStepString, 10);

            if (!firstStepPrice) {
                firstStepPrice = price;
            }

            if (quantity >= currentStep) {
                closestUnitPrice = price;
            } else if (!nextStep) {
                nextStep = currentStep;
            }
        });

        var price = quantity * closestUnitPrice;

        // $config.find('.amount').html(requestedQuantity + ' ' + requestedUnit);
        $main.find('.price').removeClass('is-hidden');
        $main.find('.price-number').html(price);

        var $discount = $main.find('.discount');
        if (nextStep) {
            $discount.removeClass('is-hidden');
            $discount.find('.discount-amount').html(quantity * firstStepPrice - quantity * unitPrices[nextStep]);
            $discount.find('.discount-next').html(nextStep);
        } else {
            $discount.addClass('is-hidden');
        }

        enableSubmitArea();

        var articleData = getArticleSelectionData();

        $submitActions.data('post-data', articleData);

        if(stockUrl) {
            Y.jsonGet(stockUrl, JSON.stringify(articleData)).done(showAvailability);
        }
    }

    function getArticleSelectionData() {
        return {
            productCode : Y.compData($main, 'product-code'),
            qty : parseInt($quantityValue.val(), 10),
            packageUnit : $quantityUnit.val(),
            price : $main.find('.price-number').text()
        };
    }

    function disableSubmitArea() {
//    $submitArea.addClass('disabled');
//    $submitActions.addClass('disabled');
        $submitActions.trigger('comp-disable');
    }
    /*
     function disableQuantitySelection() {
     $quantityForm.addClass('loading');
     $quantityUnit.prop('disabled', true);
     $quantityValue.prop('disabled', true);
     }
     */
    function emitAddedToCart() {
        $main.trigger('comp-shop');
    }

    function emitAddedToList() {
        $main.trigger('comp-list');
    }

    function emitQuantityUpdated() {
        var data = getArticleSelectionData();

        $main.trigger('comp-update', data);
        onHide();
    }

    function enableSubmitArea() {
        $submitActions.trigger('comp-enable');
//    $submitArea.removeClass('disabled');
//    $submitActions.removeClass('disabled');
    }

    function enableQuantitySelection() {
        $quantityForm.removeClass('loading');
        $quantityUnit.prop('disabled', false);
        $quantityValue.prop('disabled', false);
    }

    function initialize(_sku, _priceInfo, preSelected) {
        if (!_sku) {
            console.error('No sku data sent to component articleQuantityPicker.', $main);
        }
        if (!_priceInfo) {
            console.error('No price data sent to component articleQuantityPicker.', $main);
        }

        sku = _sku;
        priceInfo = _priceInfo;
        $main.data('product-code', sku);
        $main.data('price-info', priceInfo);
        $main.data('pre-selected', preSelected);

        enableQuantitySelection();

        $quantityValue.val('1');
        $quantityUnit.html('');
        $skuId.text(sku);
        $.each(priceInfo, function(unit, unitObj) {
            $quantityUnit.append('<option value="' + unit + '">' + unitObj.label + '</option>');
        });

        if (preSelected) {
            $quantityUnit.find('[value="'+preSelected.unit+'"]').prop('selected', true);
            $quantityValue.val(preSelected.quantity);
            if (priceInfo[preSelected.unit]) {
                $quantityValue.prop('min', priceInfo[preSelected.unit].minquantity);
            }
        }

        calculatePrice();

        $body.fadeIn('fast', $.fn.trigger.bind($main, 'comp-done', { articleCode: sku }));
    }

    function loadQuantityDetails(getUrl) {
        var data = Y.optData($main, 'get-data');
        Y.jsonGet(getUrl, data).done(onQuantityDetailsDone).fail(onFail).always(onAlways);
    }

    function onAlways() {
        $main.trigger('comp-always');
    }

    function onFail() {
        $alert.fadeIn('fast');
        $body.hide();
    }

    function onHide(evt, data) {
        if ($body.is(':hidden')) {
            return false;
        }

        $body.hide();
        $main.trigger('comp-done').trigger('comp-always');

        return false;
    }

    function onQuantityDetailsDone(data) {
        data = Y.checkJson($main, data, {
            sku: "88036955",
            priceInfo: {
                sample: { label: 'Samples', prices: { 1: 10, 2: 9, 5: 8, 10: 7}, minquantity: 250 },
                exact: { label: 'Exact amount of sheets', prices: { 1: 5, 5: 4, 10: 3}, minquantity: 3 },
                ream: { label: 'Ream (250 sheets)', prices: { 1: 100, 2: 99, 5: 95, 10: 90}, minquantity: 1 },
                pallet: { label: 'Pallet (16 000 sheet)',  prices: { 1: 1000, 2: 990,  5: 950, 10: 900}, minquantity: 1 }
            },
            preSelected: {
                unit: 'pallet',
                quantity: 5
            }
        });

        if (!data.preSelected) {
            data.preSelected = Y.optData($main, 'pre-selected');
        }

        initialize(data.sku, data.priceInfo, data.preSelected);
    }

    function onShow() {
        var priceInfo = Y.optData($main, 'price-info');
        var sku = Y.optData($main, 'product-code');
        var preSelected = Y.optData($main, 'pre-selected');

        if (priceInfo && sku) {
            initialize(sku, priceInfo, preSelected);
            $main.trigger('comp-always');
        } else if (getUrl) {
            loadQuantityDetails(getUrl);
        } else {
            $alert.fadeIn('fast');
            console.error('Not enough data in articleQuantityPicker component. Needs data-get-url or data-sku with data-price-info attributes.');
        }
    }

    function onToggleShow() {
        if ($body.is(':visible')) {
            onHide();
        } else {
            onShow();
        }
    }

    function onUnitSelectedChange() {
        var selectedUnit = $(this).val();
        var unitInfo = Y.compData($main, 'price-info')[selectedUnit];
        if (unitInfo && unitInfo.minquantity) {
            $quantityValue.prop('min', unitInfo.minquantity);
        } else {
            $quantityValue.prop('min', 1);
        }
    }

    /*
     function terminate() {
     $main.removeData('product-code');
     $main.removeData('price-info');

     resetQuantitySelection();
     disableQuantitySelection();
     }
     */
    function showAvailability(data) {
        data = Y.checkJson($main, data, {
            success: true,
            available: false,
            substituteUrl: '/url-to-configured-article-with-quantity',
            articleName: 'Name of article'
        });

        if (data.available) {
            $skuNotAvailable.hide();
            $skuAvailable.fadeIn('fast');
        } else {
            $skuNotAvailableLink
                .prop('href', data.substituteUrl)
                .text(data.articleName);

            $skuAvailable.hide();
            $skuNotAvailable.fadeIn('fast');
        }
    }

    function toggleSubmitArea() {
        if ($quantityForm.valid()) {
            enableSubmitArea();
            calculatePrice();
        } else {
            disableSubmitArea();
        }

        return false;
    }

    /*
     function resetQuantitySelection() {
     $quantityUnit.find('[value=""]').prop('selected', true);
     $quantityValue.val('');
     }
     */
});
