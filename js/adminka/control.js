Control = function(){
    this.tab;
    this.date;
    this.status;

    this.createTsrErrTab = function(){
        var self = this;
        this.tab = $('#tsr_parse_err').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch":"Поиск: ",
            },
            "aoColumns": [
              { "mDataProp": "net" },
              { "mDataProp": "title" },
              { "mDataProp": "msg" },
              { "mDataProp": "timestamp" },
              { "mDataProp": "status" }
            ],
            "bServerSide": true,
            "bProcessing": true,
            'iDisplayLength': 20,
            "aaSorting": [[ 3, "desc" ]],
            "aLengthMenu": [[20, 50, -1], [20, 50, "All"]],
            "sAjaxSource": "/panel/control/showerr",
            "deferRender": true,
            "bDestroy": true
        });
    };



    /*this.initCacheTab = function () {
        var self = this;
        this.tab = $('#cache_control').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch":"Поиск: ",
            },
            "aoColumns": [
              { "mDataProp": "net" },
              { "mDataProp": "title" },
              { "mDataProp": "msg" },
              { "mDataProp": "timestamp" },
              { "mDataProp": "status" }
            ],
            "bServerSide": true,
            "bProcessing": true,
            'iDisplayLength': 20,
            "aaSorting": [[ 3, "desc" ]],
            "aLengthMenu": [[20, 50], [20, 50]],
            "sAjaxSource": "/panel/control/cacheshow",
            "deferRender": true,
            "bDestroy": true
        });
    };*/

    this.cacheUpd = function (e, key) {
        var self = this;
        $.post('/panel/control/cacheupd', {'key':key}, function (result){
            var answer = $.parseJSON(result);
            if (typeof answer.success != 'undefined' && answer.success === true) {
                var status = '<span class="badge badge-'+answer.status.class+'">'+answer.status.label+'</span>';
                $(e).closest('tr').find('.js-status').html(status);
                $(e).closest('tr').find('.js-upTime').html(answer.updated);
            } else {
                alert("ошибка обновления кэша");
            }
        });
    };

    this.cacheDel = function (e, key) {
        var self = this;
        $.post('/panel/control/cachedel', {'key':key}, function (result){
            var answer = $.parseJSON(result);
            if (typeof answer.success != 'undefined' && answer.success === true) {
                var status = '<span class="badge badge-'+answer.status.class+'">'+answer.status.label+'</span>';
                $(e).closest('tr').find('.js-status').html(status);
                $(e).closest('tr').find('.js-upTime').html('');
            } else {
                alert("ошибка удаления кэша");
            }
        });
    };

    this.linkScreenTab = function (){
        var self = this;
        this.tab = $('#screenTab').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch":"Поиск: ",
            },
            "aoColumns": [
              { "mDataProp": "id", 'bSortable':false },
              { "mDataProp": "link" },
              { "mDataProp": "status" },
              { "mDataProp": "updated" }
            ],
            "bServerSide": true,
            "bProcessing": true,
            'iDisplayLength': 20,
            "aaSorting": [[ 3, "desc" ]],
            "aLengthMenu": [[20, 50, -1], [20, 50, "All"]],
            "sAjaxSource": "/panel/control/showscreen",
            "fnRowCallback": function (nRow, aData, status) {
                $('td:eq(0)', nRow).html('<input type="checkbox" data-id="'+aData.id+'">');
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.linkScreenUpd = function () {
        var ids = new Array();
        $('#screenTab tbody input:checked').each(function(){
            ids.push($(this).data('id'));
        });
        // console.log(ids);
        var self = this;
        $.post('/panel/control/screenupd', {'ids':ids}, function (result){
            var answer = $.parseJSON(result);
            // console.log(answer);
            if (typeof answer.success != 'undefined' && answer.success === true) {
                self.tab.fnReloadAjax();
            } else {
                alert("ошибка получения повторного скрина");
            }
        });
    };
    
    this.allCheck = function (e) {
        var status = $(e).prop('checked');
        $('#screenTab tbody input').prop('checked', status);
    };

    this.tnTable = function (){
        this.setFilter(true);
        var self = this;
        this.tab1 = $('#tntable').dataTable({
           "oLanguage": {
                "sLengthMenu": "_MENU_ записей в таблице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sZeroRecords": "Данные за этот день еще не собраны",
                "sSearch":"Поиск: ",
            },
            "aoColumns": [
              { "mDataProp": "network" },
              { "mDataProp": "all_ads" },
              { "mDataProp": "new_ads" },
              { "mDataProp": "upload_proj" },
              { "mDataProp": "upload_ads" },
              { "mDataProp": "lnd" },
              { "mDataProp": "plnd" }
            ],
            "bServerSide": true,
            "bProcessing": true,
            'iDisplayLength': 20,
            "aaSorting": [[ 0, "asc" ]],
            "aLengthMenu": [[20, 50, -1], [20, 50, "All"]],
            "sAjaxSource": "/panel/statistic/gettable",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"date","value":self.date},
                    {"name":"status","value":self.status},
                    {"name":"nettype","value":1}
                );
            },
            "drawCallback": function(settings) {
                console.log(settings.json);
                $("td").each(function(){
                var x = $(this).text();
                if (x < 10) $(this).css({background: '#f2dede '});
                });
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.snTable = function (){

        this.setFilter(true);
        var self = this;
        this.tab2 = $('#sntable').dataTable({
           "oLanguage": {
                "sLengthMenu": "_MENU_ записей в таблице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sZeroRecords": "Данные за этот день еще не собраны",
                "sSearch":"Поиск: ",
            },
            "aoColumns": [
              { "mDataProp": "network" },
              { "mDataProp": "all_ads" },
              { "mDataProp": "new_ads" },
              { "mDataProp": "upload_proj" },
              { "mDataProp": "upload_ads" },
              { "mDataProp": "lnd" },
              { "mDataProp": "plnd" }
            ],
            "bServerSide": true,
            "bProcessing": true,
            'iDisplayLength': 20,
            "aaSorting": [[ 0, "asc" ]],
            "aLengthMenu": [[20, 50, -1], [20, 50, "All"]],
            "sAjaxSource": "/panel/statistic/gettable",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"date","value":self.date},
                    {"name":"status","value":self.status},
                    {"name":"nettype","value":2}

                );
            },
            "drawCallback": function(settings) {
                console.log(settings.json);
                $("td").each(function(){
                var x = $(this).text();
                if (x < 10) $(this).css({background: '#f2dede '});
                });
            },
            "deferRender": true,
            "bDestroy": true,

        });
    };

    this.setFilter = function(nonreload){

        if ($('#status').prop('checked')) {
            this.status = 1;
        } else
            this.status = 0;

        if ($('.js-dateFrom').length > 0) {
            this.date = {
                'from': $('.js-dateFrom').val(),
                'to': $('.js-dateTo').val()
            };
        } else {
            this.date = {
                'from': $('#js-dateFrom').val(),
                'to': $('#js-dateTo').val()
            };
        }


        if (!nonreload) {
            this.tab1.fnReloadAjax();
            this.tab2.fnReloadAjax();
        }
        
        /*$("td").each(function(){
        var x = $(this).text();
        if (x < 10) $(this).css({background: 'red'});
        });*/
    };

    this.setDate = function(a){
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

        $("#js-dateFrom").datepicker("setDate", f), $("#js-dateTo").datepicker("setDate", c);
        $('.datepicker').datepicker("refresh");

        this.setFilter();
    };
};