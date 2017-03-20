Courses = function(){
    this.tab,
    this.date;

    this.initTab = function(){
        this.setFilter(true);
        var self = this;
        this.tab = $('#cources').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch":"Поиск: ",
            },
            "aoColumns": [
                {'mDataProp':'date'},
                {'mDataProp':'in_eur'},
                {'mDataProp':'in_rur'},
                {'mDataProp':'in_usd'},
                {'mDataProp':'in_uah'},
                {'mDataProp':'pp_eur'},
                {'mDataProp':'pp_usd'},
                {'mDataProp':'wmr_wmz'},
                {'mDataProp':'wmu_wmz'},
                {'mDataProp':'privat_uah'}
            ],
            "aLengthMenu": [[25, 50, 100], [25, 50, 100]],
            "bFilter": false,
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[ 0, "desc" ]],
            "aoColumnDefs": [],
            "sAjaxSource": "/panel/courses/show",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"date","value":self.date}
                );
            },
            "fnRowCallback":function( nRow, aData, status){
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.setFilter = function(mode){
        this.date = {
            'start': $('#start_date').val(),
            'end': $('#end_date').val(),
        };
        if (typeof mode == 'undefined' || false === mode) {
            this.tab.fnReloadAjax();
        }
    };

    this.downloadExcel = function(){
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        if (!confirm('Скачать архив?')) {
            return false;
        }

        var params = 'start_date='+start_date+
                    '&end_date='+end_date;
        document.location.href = "/panel/courses/report?"+params;
    };
}