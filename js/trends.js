TREND = function(){
    var $chartContainer = $('#chart');
    var $flySubmit = $('#submit-filter');
	this.filter = {};
	this.grafInfo;
	this.is_graf_init = false;
    this.defFilter = true;
    this.filterName = true;
    this.noGraph;
    this.availPreload = true;

	this.initGraf = function(){
		var self = this;
		$chartContainer.highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: false
            },
            legend : {
                enabled : false
            },
            subtitle: {
                //text: 'Irregular time data in Highcharts JS'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Период показа'
                }
            },
            yAxis: {
                title: {
                    text: 'Количество объявлений'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>Объявлений</b>: ',
                pointFormat: '{point.y}'
                
            },

            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },

            series: self.grafInfo
        });

		this.is_graf_init = true;
	};

	this.getGraphInfo = function(fname){
        if( $('#serch_string').val() == '' ){
            openNotification('Введите строку поиска');
            return false;
        }
        $flySubmit.hide();
        this.filter = this.setFilters();
        if (fname != 'undefined' && false != fname) {
            this.filter['fname'] = fname;
        }
        this.availPreload = true;
        openPreloader();
		var self = this;
		$.post('/teazer/show/loadtrend', {'params':this.filter},function(data){
            var result = $.parseJSON(data);
            if( typeof result.success != 'undefined' && result.success === true ){
                console.log('1');
                closePreloader();
                $chartContainer.html('');
                if( typeof result.success != 'undefined' ){
                    console.log('2');
                    if(result.success){
                        console.log('3');
                        self.grafInfo = self.preparedGraphData( result.graf );
                        $('#js-findCnt').html(result.count);
                        if( self.is_graf_init ){
                            console.log('4');
                            $chartContainer.highcharts().series[0].remove();
                            $chartContainer.highcharts().addSeries(self.grafInfo[0]);
                            $chartContainer.highcharts().redraw();
                        }else{
                            console.log('5');
                            self.initGraf();
                        }

                        $('.js-downloadReport').show();
                    }else{
                        console.log('6');
                        $('.js-downloadReport').hide();
                        $('#js-findCnt').html(0);
                    }
                }
                self.preloadTsrCnt();
            }else if( typeof result.success != 'undefined' && result.success === false ){
                setTimeout(function(){
                    self.getGraphInfo();
                },2000);
            }else if( typeof result.count != 'undefined' && result.count == -1 ){
                $('#js-findCnt').html(0);
                $('#chart').html(self.noGraph);
                closePreloader();
                return false;
            }
		});
	};

    this.preparedGraphData = function(data){
        var oneData = data[0];
        var graphRes = new Array();
        for( i in oneData['data'] ){
            graphRes.push([
                    Date.UTC(oneData['data'][i].y, oneData['data'][i].m, oneData['data'][i].d),
                    oneData['data'][i].cnt,
                ]);
        }

        data[0]['data'] = graphRes;

        return data;
    };

    this.setFilters = function(){
        var geo_list = new Array();
        var tn_list = new Array();
        var device = new Array();
        var cats = new Array();
        var search = $('#serch_string').val();
        $('#geotarg input:checked').each(function(){
            var gid = $(this).data('item');
            geo_list.push(gid);
        });
        $('#tn input:checked').each(function(){
            var tid = $(this).data('item');
            tn_list.push(tid);
        });
        $('#devid input:checked').each(function(){
            var did = $(this).data('item');
            device.push(did);
        });
        $("#adult .adult_chbox ").filter(":checkbox:checked").each(function () {
            cats.push($(this).attr("name"));
        });

        if( geo_list.length > 0 ||
            tn_list.length > 0 ||
            device.length > 0 ||
            search != ''
            ) this.defFilter = false;

        return {
            /*'search':search,
            'dRange':{
                'start':$('#date_from_text').html(),
                'end':$('#date_to_text').html(),
            },
            'geo_list':geo_list,
            'device':device,
            'tn_list':tn_list,
            'cats':cats
            //'all':1*/

            'search':search,
            'date':{
                'from':$('#date_from_text').html(),
                'to':$('#date_to_text').html(),
            },
            'geo':geo_list,
            'device':device,
            'tn':tn_list,
            'cats':cats
            //'all':1
        };
    };

	this.reloadInfo = function(a){
        if( $('#serch_string').val() == '' ){
            openNotification('Введите ключевое слово в строку поиска');
            return false;
        }
		this.getGraphInfo();
	};

    /* ENTER EVENT */
    this.enter = function(event){
        if(event.keyCode == 13){
            this.reloadInfo();
        }
    };

    this.resetFilter = function(){
        $('#geotarg input:checked').prop('checked', false).trigger('refresh');
        $('#tn input:checked').prop('checked', false).trigger('refresh');
        $('#devid input:checked').prop('checked', false).trigger('refresh');
        $(".filter-acc-one").removeClass("leftFilterActiveBg");
        $("#submit-filter").hide();
        $("small.reset-filters").hide();
        unselectPeriod();
        this.resetSearch();
    };

    this.resetSearch = function () {
        this.availPreload = false;
        $("#serch_string").val("");
        $("#js-findCnt").html(0);
        $('.filter-acc-one small.right').html('');
        $('img.preloadTsrCnt').hide();
        this.resetBlock();
    };

    this.getFilterList = function(){
        $.post('/teazer/default/filterlist', {}, function(result) {
            $("#filterSearchList").html(result);
            $("#popupSaveFilter").show();
        });
    };

    this.selectFilter = function(event){
        if(event.keyCode == 13){
            this.saveFilter();
        }
    };

    this.saveFilter = function(){
        var filters = this.setFilters();
        this.filterName = $('#newFilterName').val();

        if( this.defFilter ){
            popunderShow('<p>Вы пытаетесь сохранить настройки фильтров по умолчанию.<br> Для успешного сохранения выберите необходимые значения фильтров и нажмите сохранить настройки.</p>');
            return false;
        }

        this.filterName = this.filterName.replace(/^\s*/,'').replace(/\s*$/,'');

        if( this.filterName == '' ){
            openNotification('Вы не ввели название фильтра');
            return false;
        }

        hideCPrompt();

        console.log(filters);
        var postData = {
            'datepicker':filters['date']['from'],
            'datepicker2':filters['date']['to'],
            'geonm':filters['geo'],
            'idtnid':filters['tn'],
            'devid':filters['device'],
        };

        var self = this;
        $.post('/teazer/default/filtersave', {'filter':postData,'filtername':this.filterName,'type':2,'search':filters['search']},function(response){
            if( response != '' ){
                var rlf = $("#resultList");

                if( rlf.hasClass("noActForm") )
                    rlf.removeClass("noActForm");

                if( response != 'Ok' )
                    $("#filtersList").append(response);

                openNotification('Настройки фильтра успешно сохранены! <a href="javascript:void(0);" onclick="trend.reloadInfo();">Применить фильтр</a>');
            }
        });
    };

    this.useFilter = function(id, name){
        this.setSelectSearch(id,name);
        var self = this;
        $.post('/teazer/default/filterload', {'id':id},function(response){
            var _data = $.parseJSON(response);

            self.resetFilter();

            if (_data.datepicker)
                $("#date_from_text").html(_data.datepicker);
            if (_data.datepicker2)
                $("#date_to_text").html(_data.datepicker2);

            for (var key in _data) {
                if ((key != "datepicker") && (key != "datepicker2")) {
                    if( key == 'search' ){
                        $("#serch_string").val( _data[key] );
                    }else if( key == 'devid' ){
                        for (var di in _data[key]) {
                            $('#devid input[data-item='+_data[key][di]+']').prop('checked', true);
                        }
                    }else{
                        var inputs = $("input." + key + "_chbox");

                        inputs.each(function(){
                            for( var it in _data[key] ){
                                if( this.name == _data[key][it] ){
                                    $(this).attr("checked","checked");
                                }
                            }
                        });
                    }
                }
            }
            $('input').trigger('refresh');
            setTimeout(function(){
                        self.getGraphInfo(_data.fname);
                    },1000);
        });
    };

    this.setSelectSearch = function(id,name){
        $("#resultList").click();
        $("#resultList").html('<span class="filterN">' + name + '</span><span class="clearFilter" onclick="clearFilterSelect();">Очистить</span>');
    };

    this.downloadReport = function(){
        this.filter = this.setFilters();

        var self = this;
        $.post('/teazer/show/trendreport', {'setfilter':1,'params':this.filter},function(result){
            document.location.href = "/teazer/show/trendreport";
        });
    };

    this.resetBlock = function(){
        $chartContainer.html(this.noGraph);
    };

    this.preloadTsrCnt = function(){
        $(".preloadTsrCnt").show();
        $("small.right.colvo").html('');

        this.filter = this.setFilters();
        this.filter['new_ads'] = 0;
        
        var self = this;
        $.post('/teazer/default/tsrcnt', this.filter, function (data) {
            var result = $.parseJSON(data);
            if(self.availPreload && typeof result.status != 'undefined' && result.status === "success" ){
                for( var jq in result.data ){
                    var inputs = $("input." + jq + "_cnt_inp");
                    if( inputs.length > 0 ){
                        inputs.each(function(){
                            var id = $(this).data('item');
                            
                            if( typeof result.data[jq][id] != 'undefined' ){
                                $("small." + jq + "_cnt_" + id).html(result.data[jq][id]);
                            }else{
                                $("small." + jq + "_" + id).html('');
                            }
                        });
                    }
                }
                $(".preloadTsrCnt").hide();
            }else if(self.availPreload && typeof result.status != 'undefined' && (result.status === false || result.status === "then" )){
                setTimeout(function(){
                    self.preloadTsrCnt();
                },2000);
            }
        });
    };
};

function save_filter(name){
    $('#newFilterName').val(name);
    trend.saveFilter();
}

function useFilter(id, name){
    trend.useFilter(id, name);
}

function deleteFilter(id, name){
     if(confirm("Вы хотите удалить фильтр: " + name + " ?")){
        function onSuccess(result){
            if(result.status == 'ok')
                $(".fsi_" + id).remove();

            $("#blockMsg").html('Настройки фильтра ' + name + ' удалены! <a onclick="revDelFilter(' + id + ');" href="javascript:void(0);">Отменить</a>').show();
            //openNotification('Настройки фильтра ' + name + ' удалены! <b onclick="revDelFilter(' + id + ');">Отменить</b>');

            var fList = $("#filtersList").html();
            fList = fList.replace(/\s*/g,'');

            if( fList == '' )
                $("#resultList").addClass("noActForm");

            if( name == $("#resultList").html() ){
                $("#resultList").html('Выбрать настройки фильтра');
                $("#resultList").click();
                reset_filter();
            }
        }
        function onError() {
            openNotification("Удалить фильтр не удалось.");
        }

        $.ajax({
            url: '/teazer/default/filterdel',
            type: 'POST',
            data: { 'id': id },
            dataType: 'json',
            success: onSuccess,
            error: onError,
            cache: false
        });
    }
}

function showTnList(b, m){
  $(b).hide();
  $('.'+m).show();
}