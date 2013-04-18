/*global Y:false*/
Y.registerComponent('.comp-article-quantity-picker',
    ['.comp-alert-box.error', '> .body', '.quantity-selection', '.article-summary', '.article-shop'],
    function($main, $alert, $body, $quantityForm, $articleSummary, $submitArea) {
    "use strict";

    var stockUrl             = Y.optData($main, 'url-stock');

    var sku, priceInfo;

    var obj = {
        requiredElements: {
            $quantityValue: $quantityForm.child('[name=quantity-value]'),
            $quantityUnit: $quantityForm.child('[name=quantity-unit]'),

            $skuId: $articleSummary.child('.sku-id'),
            $skuAvailable: $articleSummary.child('.is-available'),
            $skuNotAvailable: $articleSummary.child('.is-not-available'),
            $skuNotAvailableLink: $skuNotAvailable.child('.article-name'),

            $submitConfirm: $submitArea.child('.comp-ajax-simple-action').has('.confirm'),
            $submitCancel: $submitArea.child('.is-picker-cancel'),
            $submitCart: $submitArea.child('.comp-ajax-simple-action').has('.add-to-cart'),
            $submitList: $submitArea.child('.comp-ajax-tooltip-select').has('.add-to-list'),
        },
        requiredData: {
            getUrl: 'get-url'
        },

        obeys: {
            hide: onHide,
            show: onShow,
            toggleShow: onToggleShow
        },
        observes: {
            done: [
                { target: $submitList, callback: emitAddedToList },
                { target: $submitCart, callback: emitAddedToCart },
                { target: $submitConfirm, callback: emitQuantityUpdated }
            ]
        },
        commands: {
            disable: [$submitCart, $submitList]
        },
        notifications: [
            'shop',
            'list',
            'update'
        ],

        creator: function(_sku, _priceInfo, preSelected) {
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
        },

        expose: {
            calculatePrice: function() {
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
            },

            getArticleSelectionData: function() {
                return {
                    productCode : Y.compData($main, 'product-code'),
                    qty : parseInt($quantityValue.val(), 10),
                    packageUnit : $quantityUnit.val(),
                    price : $main.find('.price-number').text()
                };
            },

            disableSubmitArea: function() {
//        $submitActions.trigger('comp-disable');
                obj.commands.disable($submitCart); //
                $submitCart.command('disable');
                $main.command($submitCart, 'disable');
            },

            emitAddedToCart: function() {
//        $main.trigger('comp-shop');
                obj.notifications.disable();
                $main.notify('disable');
                $main.disable(); // possible name collisions
                $main.notifications.disable();
            },

            emitAddedToList: function() {
                $main.trigger('comp-list');
            },

            emitQuantityUpdated: function() {
                var data = getArticleSelectionData();

//        $main.trigger('comp-update', data);
                obj.notifications.update(data);
                $main.notify('update', data);
                $main.update(data); // possible name collisions
                $main.notifications.update(data);

                onHide();
            },

            enableSubmitArea: function() {
                $submitActions.trigger('comp-enable');
            },

            enableQuantitySelection: function() {
                $quantityForm.removeClass('loading');
                $quantityUnit.prop('disabled', false);
                $quantityValue.prop('disabled', false);
            },

            loadQuantityDetails: function(getUrl) {
                var data = Y.optData($main, 'get-data');
                Y.jsonGet(getUrl, data).done(onQuantityDetailsDone).fail(onFail).always(onAlways);
            },

            onAlways: function() {
                $main.trigger('comp-always');
            },

            onFail: function() {
                $alert.fadeIn('fast');
                $body.hide();
            },

            onUnitSelectedChange: function() {
                var selectedUnit = $(this).val();
                var unitInfo = Y.compData($main, 'price-info')[selectedUnit];
                if (unitInfo && unitInfo.minquantity) {
                    $quantityValue.prop('min', unitInfo.minquantity);
                } else {
                    $quantityValue.prop('min', 1);
                }
            },

            onQuantityDetailsDone: function(data) {
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
            },


            showAvailability: function(data) {
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
            },

            toggleSubmitArea: function() {
                if ($quantityForm.valid()) {
                    enableSubmitArea();
                    calculatePrice();
                } else {
                    disableSubmitArea();
                }

                return false;
            }
        }
    };

    obj.requiredElements.$submitCancel.click(onHide);

    obj.requiredElements.$quantityForm.find('select, input').change(toggleSubmitArea);
    obj.requiredElements.$quantityUnit.change(onUnitSelectedChange);

    return obj;


    function onHide(evt, data) {
        if ($body.is(':hidden')) {
            return false;
        }

        $body.hide();
        $main.trigger('comp-done').trigger('comp-always');

        return false;
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

    /*
     function resetQuantitySelection() {
     $quantityUnit.find('[value=""]').prop('selected', true);
     $quantityValue.val('');
     }
     */
});
