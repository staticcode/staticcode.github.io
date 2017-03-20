Payments = function(){
    this.tab;

    this.tarif;
    this.dstart;
    this.dend;
    this.status;
    this.payType;
    this.payTypeDetail;
    this.payTypeRel;
    this.perPeriod;
    this.rangePayDetail;
    this.codeErrorPay;
    this.paySystem;
    this.refEmail;
    this.manager;
    this.endSubscribe;
    this.currency;
    this.promoсode;
    this.fields;

    this.aplyHideColumn = function(){
        var self = this;
        $("input[name=filter_show_field]").each(function(){
            self.tab.fnSetColumnVis( $(this).val(), $(this).prop('checked') );
        });
    };

    this.changeVisibleBlock = function (e) {
        var controlClass = $(e).data('control');
        if (controlClass) {
            var status = $(e).prop('checked');
            if (status) {
                $("." + controlClass).show();
            } else {
                $("." + controlClass).hide();
            }
        }
    };

    this.hideMutableBlock = function () {
        $('input[data-control]:not(:checked)').each(function (i, elem) {
            var controlClass = $(elem).data('control');
            if (controlClass) {
                $("." + controlClass).hide();
            }
        });

        $('input[data-control]:checked').each(function (i, elem) {
            var controlClass = $(elem).data('control');
            if (controlClass) {
                $("." + controlClass).show();
            }
        });
    };

    this.changeView = function (e) {
        var self = this;
        var status = $(e).prop('checked');
        var id = $(e).val();
        self.tab.fnSetColumnVis(id, status);
    };

    this.createPaymentTab = function(){
        var self = this;
        this.tab = $('#all_payments').dataTable({
            // "scrollX": true,
            // "sScrollX": '100%',
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch":"Поиск: ",
            },

            "aoColumns": [
              { "mDataProp": "check" , "bSortable": false, },
              { "mDataProp": "create", },
              { "mDataProp": "name", },
              { "mDataProp": "tarif", },
              { "mDataProp": "referer" },
              { "mDataProp": "promo" },
              { "mDataProp": "discount", },
              { "mDataProp": "type" },
              { "mDataProp": "dtype" },
              { "mDataProp": "currency", },
              { "mDataProp": "ini_cost", },
              { "mDataProp": "cost", },
              { "mDataProp": "cost_fact", },
              { "mDataProp": "period", },
              { "mDataProp": "end_subscribe" },
              { "mDataProp": "purse", },
              { "mDataProp": "pay_system", },
              { "mDataProp": "status", },
              { "mDataProp": "code_error_pay" , "bSortable": false},
              { "mDataProp": "manager" , "bSortable": false}
            ],
            "bServerSide": true,
            "bProcessing": true,
            'iDisplayLength': 20,
            "aaSorting": [[ 1, "desc" ]],
            "aLengthMenu": [[20, 50, 100, 500, 1000, -1], [20, 50, 100, 500 ,1000, "All"]],
            /*"aoColumnDefs": [{
                'bSortable': false, 'aTargets': [0, 17, 19]
            }],*/
            "sAjaxSource": "/panel/allPayment/show",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"tarif","value":self.tarif},
                    {"name":"start_date","value":self.dstart},
                    {"name":"end_date","value":self.dend},
                    {"name":"status","value":self.status},
                    {"name":"paytype","value":self.payType},
                    {"name":"paytypedetail","value":self.payTypeDetail},
                    {"name":"perPeriod","value":self.perPeriod},
                    {"name":"rangePayDetail","value":self.rangePayDetail},
                    {"name":"codeErrorPay","value":self.codeErrorPay},
                    {"name":"paySystem","value":self.paySystem},
                    {"name":"refEmail","value":self.refEmail},
                    {"name":"manager","value":self.manager},
                    {"name":"endSubscribe","value":self.endSubscribe},
                    {"name":"currency","value":self.currency},
                    {"name":"promoсode","value":self.promoсode},
                    {"name":"fields","value":self.fields}
                );
            },
            "fnInfoCallback": function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
                var api = this.api(), data;

                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                data = api.column( 11 ).data();
                total = data.length ?
                    data.reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                    } ) :
                    0;

                data = api.column( 11, { page: 'current'} ).data();
                pageTotal = data.length ?
                    data.reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                    } ) :
                    0;

                data = api.column( 12, { page: 'current'} ).data();
                dataFact = data.length ?
                    data.reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                    } ) :
                    0;

                $('.js-tatalUsd').html('$' + Number( pageTotal ).toFixed(0) + '(' + oSettings.json.totalPays + ')');
                $('.js-tatalUsdFact').html('$' + Number( dataFact ).toFixed(0) + '(' + oSettings.json.totalPayFact + ')');
                return "Showing "+iStart+" to "+ iEnd+" of "+iTotal+" entries";
            },
            "fnInitComplete": function ( oSettings, json ) {
                self.aplyHideColumn();
            },
            "deferRender": true,
            "bDestroy": true
        });

        $('.datepicker').datepicker({
                format: 'yyyy-mm-dd'
        });
    };

    this.reloadTab = function(){
        this.tab.fnReloadAjax();
    };

    this.loadFilter = function(e) {
        var self = this;

        if( typeof e != 'undefined' && $(e).attr('id') == 'js-payType' )
            this.changeType(e);

        var filter = {};
        filter.status = this.status = $('#status_pay').val();
        filter.tarif = this.tarif = $('#js-tarifSel').val();
        filter.payType = this.payType = $('#js-payType').val();
        filter.payTypeDetail = this.payTypeDetail = $('#js-payTypeDetail').val();
        filter.dstart = this.dstart = $('#start_date').val();
        filter.dend = this.dend = $('#end_date').val();
        filter.perPeriod = this.perPeriod = $('#filter_per_period').val();

        filter.rangePayDetail = self.rangePayDetail = [];
        $('input[name=filter_range_pay_detail]:checked').each(function (i, elem) {
            self.rangePayDetail.push($(elem).val());
            filter.rangePayDetail.push($(elem).val());
        });

        filter.codeErrorPay =this.codeErrorPay = $('#filter_code_error_pay').val();
        filter.paySystem =this.paySystem = $('#filter_pay_system').val();
        filter.refEmail =this.refEmail = $('input[name=filter_ref_email]').val();
        filter.manager =this.manager = $('#filter_manager').val();

        filter.endSubscribe = this.endSubscribe = {
            'from': $('input[name=filter_end_subscribe_from]').val(),
            'to': $('input[name=filter_end_subscribe_to]').val(),
        };

        filter.currency = this.currency = $('#filter_currency').val();
        filter.promoсode = this.promoсode = $('input[name=filter_promocode]').val();

        filter.fields = self.fields = [];
        $("input[name=filter_show_field]:checked").each(function () {
            self.fields.push($(this).val());
            filter.fields.push($(this).val());
        });

        return filter;
    };

    this.loadDefaultFilter = function () {
        defaultFilter = this.loadFilter();
        return defaultFilter;
    };

    this.setFilter = function(e){
        this.loadFilter(e);
        this.reloadTab();
    };

    this.filterReset = function() {
        this.status = defaultFilter.status;
        $('#status_pay').prop('selectedIndex', defaultFilter.status);

        this.tarif = defaultFilter.tarif;
        $('#js-tarifSel').prop('selectedIndex', defaultFilter.tarif);

        this.payType = defaultFilter.payType;
        $('#js-payType').prop('selectedIndex', defaultFilter.payType);

        this.payTypeDetail = defaultFilter.payTypeDetail;
        $('#js-payTypeDetail').prop('selectedIndex', defaultFilter.payTypeDetail);

        this.dstart = defaultFilter.dstart;
        $('#start_date').val('');
        this.dend = defaultFilter.dend;
        $('#end_date').val('');

        this.perPeriod = defaultFilter.perPeriod;
        $('#filter_per_period').prop('selectedIndex', defaultFilter.perPeriod);

        this.rangePayDetail = defaultFilter.rangePayDetail;
        this.setDefaultCheck('filter_range_pay_detail', defaultFilter.rangePayDetail);

        this.codeErrorPay = defaultFilter.codeErrorPay;
        this.setDefaultInput('filter_code_error_pay', 1);

        this.paySystem = defaultFilter.paySystem;
        $('#filter_pay_system').prop('selectedIndex', defaultFilter.paySystem);

        this.refEmail = defaultFilter.refEmail;
        this.setDefaultInput('filter_ref_email', 1);

        this.manager = defaultFilter.manager;
        $('#filter_manager').prop('selectedIndex', defaultFilter.manager);

        this.endSubscribe = defaultFilter.endSubscribe;
        this.setDefaultInput('filter_end_subscribe');

        this.currency = defaultFilter.currency;
        $('#filter_currency').prop('selectedIndex', defaultFilter.currency);

        this.promoсode = defaultFilter.promoсode;
        this.setDefaultInput('filter_promocode', 1);

        this.fields = defaultFilter.fields;
        this.setDefaultCheck('filter_show_field', defaultFilter.fields);

        var oSettings = this.tab.fnSettings();
        oSettings.oPreviousSearch.sSearch = "";

        this.controlFieldPayError();
        this.hideMutableBlock();
        this.aplyHideColumn();
        this.reloadTab();
    };

    this.setDefaultCheck = function($nameFilter, $defaultValues) {
        $('input[name=' + $nameFilter + ']').each(function (i, elem) {
            if ($defaultValues.indexOf($(elem).val()) == -1) {
                $(elem).closest('span').removeClass('checked');
                $(elem).prop('checked', false);
            } else {
                $(elem).closest('span').addClass('checked');
                $(elem).prop('checked', true);
            }
        });
    };

    this.setDefaultInput = function($nameFilter, count) {
        if (!count) {
            $('input[name=' + $nameFilter + '_from]').val('');
            $('input[name=' + $nameFilter + '_to]').val('');
        } else {
            $('input[name=' + $nameFilter + ']').val('');
        }
    };

    this.setDatePay = function(a){
        var c = new Date;
        var e = $.datepicker.formatDate("yyyy-mm-dd", c);

        if ("today" == a) {
            var b = $.datepicker.formatDate("yyyy-mm-dd", new Date);
            var f = c;
        }else if ("week" == a) {
            var f = new Date(c.getFullYear(), c.getMonth(), c.getDate() - c.getDay() + 1);
            var b = $.datepicker.formatDate("yyyy-mm-dd", f);
        }else if ("month" == a){
            var f = new Date(c.getFullYear(), c.getMonth(), 1);
            var b = $.datepicker.formatDate("yyyy-mm-dd", f);
        }else if ("year" == a){
            var f = new Date(c.getFullYear(), 0, 1);
            var b = $.datepicker.formatDate("yyyy-mm-dd", f);
        }else
            return false;

        $("#start_date").datepicker("setDate", f), $("#end_date").datepicker("setDate", c);
        $('.datepicker').datepicker("refresh");

        this.setFilter();
    };

    this.changeType = function(e){
        var type_id = $(e).val();

        if( typeof this.payTypeRel[type_id] != 'undefined' ){
            $('#js-payTypeDetail').html(this.payTypeRel[type_id]);
        }
    };

    this.getSelected = function(){
        var items = new Array();
        $("#all_payments input.js-payItem:checked").each(function(){
            var id = $(this).val();
            items.push(id);
        });

        return items;
    };

    this.deletePays = function(){
        if( !confirm('Вы действительно хотите удалить выбранные платежи?') ){
            return false;
        }

        var ids = this.getSelected();

        if( ids.length == 0 ){
            alert("Выберите платежи");
            return false;
        }

        var self = this;
        $.post('/panel/allPayment/mdelete', {'ids':ids}, function (result){
            var answer = $.parseJSON(result);
            if( typeof answer.success != 'undefined' && answer.success === true )
                self.tab.fnReloadAjax();
            else
                alert("Ошибка удаления");
        });
    };

    this.payStatus = function(){
        if( !confirm('Вы хотите поменятиь статус на "Оплачено"?') ){
            return false;
        }

        var ids = this.getSelected();

        if( ids.length == 0 ){
            alert("Выберите платежи");
            return false;
        }

        var self = this;
        $.post('/panel/allPayment/psuccess', {'ids':ids}, function (result){
            var answer = $.parseJSON(result);
            if( typeof answer.success != 'undefined' && answer.success === true )
                self.tab.fnReloadAjax();
            else
                alert("Ошибка изменения статуса");
        });
    };

    this.notPayStatus = function(){
        if( !confirm('Вы хотите поменятиь статус на "Не оплачено"?') ){
            return false;
        }

        var ids = this.getSelected();

        if( ids.length == 0 ){
            alert("Выберите платежи");
            return false;
        }
        var self = this;
        $.post('/panel/allPayment/pfail', {'ids':ids}, function (result){
            var answer = $.parseJSON(result);
            if( typeof answer.success != 'undefined' && answer.success === true )
                self.tab.fnReloadAjax();
            else
                alert("Ошибка изменения статуса");
        });
    };

    this.downloadExcel = function () {
        this.dstart = $('#start_date').val();
        this.dend = $('#end_date').val();

        if (this.dstart == '' ||
            this.dend == '') {
            alert('Выберите период выгрузки');
            return false;
        }
        if (!confirm('Скачать архив?')) {
            return false;
        }

        var filter = this.loadFilter();
        filter.sSearch = $('#all_payments_filter input[type=search]').val();

        var selTab = new Array();
        $("input[name=filter_show_field]").each(function () {
            if (!$(this).prop('checked')) {
                selTab.push($(this).val());
            }
        });
        filter.dcolumn = selTab.join(',');
        filter.start_date = this.dstart;
        filter.end_date = this.dend;

        document.location.href = "/panel/allPayment/report?" + jQuery.param(filter);
    };

    this.chankgeManager = function(e,pid){
        var manId = $(e).val();
        $.post('/panel/allPayment/changeManager', {'pid':pid,'manId':manId}, function (result){
            /*var answer = $.parseJSON(result);
            if( typeof answer.success != 'undefined' && answer.success === true )
                self.tab.fnReloadAjax();
            else
                alert("Ошибка изменения статуса");*/
        });
    };

    this.changeManager = function () {
        var self = this;
        if (!confirm('Вы уверены что хотитие перенести платежи?')) {
            $('#managerList option:first-child').prop('selected', true);
            return false;
        }
        var ids = this.getSelected();
        if (ids.length == 0) {
            alert('Выберите платежи.');
            $('#managerList option:first-child').prop('selected', true);
            return false;
        }
        var params = {
            'pid': ids,
            'manId': $('#managerList').val()
        };
        $.post('/panel/allPayment/changeManager', params, function (result) {
            var answer = $.parseJSON(result);
            if (typeof answer.success != 'undefined' && answer.success === true) {
                $('.js-moveUserBtn').show();
                $('#managerList').hide();
                self.tab.fnReloadAjax();
            } else {
                alert("Не удалось изменить менеджера");
            }
            $('#managerList option:first-child').prop('selected', true);
        });
    };

    this.createInModal = function () {
        $.get('/panel/allPayment/createModal', function (html) {
            $('#addTask').modal('show');
            $('#addTask .modal-body').html(html);
        });

        return false;
    };

    this.createPayment = function () {
        var self = this;

        $.ajax({
            type: 'POST',
            url: '/panel/allPayment/createModal',
            data: $('#payment-form').serialize(),
            success: function (html) {
                $('#addTask .modal-body').html(html);
                self.tab.fnReloadAjax();
            },
            error: function () {
                alert('Ошибка!');
            }
        });
    };

    this.controlFieldPayError = function (e) {
        var elem = e ? $(e) : $('#status_pay');
        var newVal = elem.val();
        var oldVal = $('#old_value_filter_status_pay').val();

        var blockPayError = $('#block_filter_code_error_pay');
        if (oldVal != 6 && newVal == 6 ) {
            blockPayError.show();
            this.tab.fnSetColumnVis(NUM_CODE_ERROR_PAY, true);
        } else if ((!oldVal || oldVal == 6) && newVal != 6) {
            blockPayError.hide();
            this.tab.fnSetColumnVis(NUM_CODE_ERROR_PAY, false);
        }

        elem.blur();
    };
};