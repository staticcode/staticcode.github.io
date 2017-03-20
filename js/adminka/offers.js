/**
 * Created by bleid3 on 02.09.15.
 */
Offer = function () {
    this.table = null;
    this.tableGoal = null;
    this.tablePartner = null;

    this.date = {};
    this.categories = [];
    this.modStatuses = [];
    this.partners = [];
    this.goals = [];
    this.sources = [];

    this.showPartnersTable = function () {
        var self = this;
        this.tablePartner = $('#partner_all').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },

            "aoColumns": [
                {'mDataProp': 'id'},
                {'mDataProp': 'title'},
                {'mDataProp': 'countOffers'},
                {'mDataProp': 'logo'},
                {'mDataProp': 'rating'},
                {'mDataProp': 'dateAdd'},
                {'mDataProp': 'priority'},
                {'mDataProp': 'dateUpdate'},
                {'mDataProp': 'action', sDefaultContent: "N/A"}
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[0, "asc"]],
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": [0, 2, 3, 4, 8]
                }
            ],
            "sAjaxSource": "/panel/offer/allPartner",

            "fnRowCallback": function (nRow, aData, status) {

                if (aData.logo) {
                    $('td:eq(3)', nRow).html('<img class="img-responsive" src="' + aData.logo + '">');
                } else {
                    $('td:eq(3)', nRow).html('Нет');
                }

                if (aData.id == 'delete') {
                    $('td:eq(0)', nRow).html('');
                    $('td:eq(8)', nRow).html('<div>Партнерка удаляется!!!</div>');
                } else {
                    $('td:eq(0)', nRow).html('<input type="checkbox" class="partnerSelector" data-id=' + aData.id + ' id="partner_' + aData.id + '">').addClass('first_column');
                    $('td:eq(8)', nRow).html(
                        '<button data-id=' + aData.id + ' onclick="_offer.editPartner(' + aData.id + ')" class="btn btn-primary">Редактировать</button>' +
                        '<button data-id=' + aData.id + ' onclick="_offer.parserPartner(' + aData.id + ')" class="btn btn-primary">Обновить</button>' +
                        '<button data-id=' + aData.id + ' onclick="_offer.manageVotePartner(' + aData.id + ')" class="btn btn-primary">Голоса</button>'
                    );
                }
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.reloadTablePartner = function () {
        this.tablePartner.fnReloadAjax();
    };

    this.manageVotePartner = function (id) {
        $.post(
            '/panel/offer/voteList',
            {id: id},
            function (data) {
                var dataArr = JSON.parse(data);
                $('#modalVote #contentVote').html(dataArr.content);
                $('#modalVote').modal('toggle');
            }
        );
        return false;
    };

    this.deletePartnerVote = function (id) {

        var self = this;

        if (confirm('Удалить голос?')) {
            $.post(
                '/panel/offer/deleteVote',
                {id: id},
                function (data) {
                    if (data == 'ok') {
                        $('#deleteVote' + id).remove();
                        self.reloadTablePartner();
                    } else {
                        alert(data);
                    }
                }
            );
        }
        return false;
    };


    this.editPartner = function (id) {
        $.post(
            '/panel/offer/updatePartner',
            {id: id},
            function (data) {
                var dataArr = JSON.parse(data);
                $('#containerCreatePartner').html('');
                $('#MyModalPartner #contentPartner').html(dataArr.content);
                $('#MyModalPartner #myModalLabelPartner').html(dataArr.title);
                $('#MyModalPartner').modal('toggle');
            }
        );
        return false;
    };

    this.createPartner = function () {
        $.post(
            '/panel/offer/createPartner',
            function (data) {
                var dataArr = JSON.parse(data);
                $('#MyModalPartner #contentPartner').html('');
                $('#containerCreatePartner').html(dataArr.content);
                $('#containerCreatePartner').toggle();
                $('#formByPartnerButtonGroup').toggle();
            }
        );
        return false;
    };

    this.parserPartner = function (id) {
        if (confirm('Обновить партнерку?')) {
            $.post(
                '/panel/offer/parserPartner',
                {id: id},
                function (data) {
                    alert(data);
                }
            );
            return false;
        }

    };

    this.parserManyPartner = function () {
        var self = this;
        var ids = [];
        $('.partnerSelector').each(function () {
            if ($(this).is(':checked')) {
                ids.push($(this).data('id'));
            }
        });

        if (ids.length === 0) {
            alert('Выберите хотя бы одного партнера!');
        } else {
            if (confirm('Обновить выбраные партнерки?')) {
                var gOfrId = $('#manyOfr_gOfrId').val();
                $.post(
                    '/panel/offer/parserManyPartner',
                    {ids: ids},
                    function (data) {
                        alert(data);
                        self.reloadTablePartner();
                    }
                );

                return false;
            }
        }
    };

    this.applyEditPartner = function (closeModal, newRecord) {

        var self = this;
        var idPartner = $('#myFormPartner #editPartner_id').val();
        var title = $('#myFormPartner #editPartner_title').val();
        var nameClass = $('#myFormPartner #editPartner_nameClass').val();
        var link = $('#myFormPartner #editPartner_link').val();
        var reflink = $('#myFormPartner #editPartner_reflink').val();
        var paymentMethods = $('#myFormPartner #editPartner_payment_method').val();
        var paymentPeriod = $('#myFormPartner #editPartner_payment_period').val();
        var paymentMin = $('#myFormPartner #editPartner_payment_min').val();
        var currency = $('#myFormPartner #editPartner_currency').val();
        var priority = $('#myFormPartner #editPartner_priority').val();
        var description = $('#myFormPartner #editPartner_description').val();
        var comment = $('#myFormPartner #editPartner_comment').val();
        var dateAdd = $('#myFormPartner #editPartner_dateAdd').val();
        var isActive = $('#myFormPartner #editPartner_active').is(':checked') ? 1 : 0;
        var imgLocal = $('#myFormPartner #insertImg').attr('src');

        $.post(
            newRecord ? '/panel/offer/createPartner' : '/panel/offer/updatePartner',
            {
                id: idPartner,
                OfrPartner: {
                    title: title,
                    name_class: nameClass,
                    link: link,
                    reflink: reflink,
                    payment_method: paymentMethods,
                    payment_period: paymentPeriod,
                    payment_min: paymentMin,
                    currency: currency,
                    priority: priority,
                    description: description,
                    comment: comment,
                    date_add: dateAdd,
                    is_active: isActive,
                    img_local: imgLocal,
                }
            },
            function (data) {
                var dataArr = JSON.parse(data);

                if (newRecord) {
                    if (dataArr.success) {
                        $('#containerCreatePartner').toggle();
                        $('.add-pp_row1').toggle();
                        $('#containerCreatePartner').html('');
                        self.reloadTablePartner();
                    } else {
                        $('#containerCreatePartner').html(dataArr.content);
                        $('#formByPartnerButtonGroup').toggle();
                    }
                } else {
                    if (dataArr.success && dataArr.message) {
                        $('#MyModalPartner #myModalLabelPartner').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.message + '</div>');
                    } else if (!dataArr.success && dataArr.message) {
                        $('#MyModalPartner #myModalLabelPartner').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                    } else {
                        $('#MyModalPartner #myModalLabelPartner').html(dataArr.title);
                    }
                    $('#MyModalPartner #contentPartner').html(dataArr.content);

                    if (dataArr.success && closeModal) {
                        $('#MyModalPartner').modal('toggle');
                        self.reloadTablePartner();
                    } else if (dataArr.success && !closeModal) {
                        self.reloadTablePartner();
                    }
                }

                $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");
            }
        );

        return false;

    };

    this.deletePartner = function () {

        var self = this;
        var idPartner = $('#MyModalPartner #editPartner_id').val();

        if (confirm('Удалить партнерку(Осторожно удалятся все связанные офферы)?')) {
            $.post(
                '/panel/offer/deletePartner',
                {id: idPartner},
                function (data) {
                    $('#MyModalPartner').modal('toggle');
                    alert(data);
                    self.reloadTablePartner();
                }
            );
        }

        return false;
    };


    this.showOffersTable = function () {
        var self = this;
        this.table = $('#offer_all').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },

            "aoColumns": [
                {'mDataProp': 'id'},
                {'mDataProp': 'title'},
                {'mDataProp': 'partnerTitle'},
                {'mDataProp': 'dateAdd'},
                {'mDataProp': 'goals'},
                {'mDataProp': 'sources'},
                {'mDataProp': 'groupOfferTitle'},
                {'mDataProp': 'category'},
                {'mDataProp': 'modStatus'},
                {'mDataProp': 'action', sDefaultContent: "N/A"}
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[5, "asc"]],
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": [0, 2, 4, 5, 6, 7, 9]
                }
            ],
            "sAjaxSource": "/panel/offer/allOffer",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name": "date", "value": self.date},
                    {"name": "categories", "value": self.categories},
                    {"name": "modStatuses", "value": self.modStatuses},
                    {"name": "partners", "value": self.partners},
                    {"name": "goals", "value": self.goals},
                    {"name": "sources", "value": self.sources}
                );
            },

            "fnRowCallback": function (nRow, aData, status) {
                if (aData.modStatus == 0) {
                    $(nRow).addClass('status_require_moderation');
                }
                $('td:eq(0)', nRow).html('<input type="checkbox" class="offerSelector" data-id=' + aData.id + ' id="offer_' + aData.id + '">').addClass('first_column');
                $('td:eq(8)', nRow).html(aData.modStatus == 1 ? 'Готово' : 'Требует модерации');
                $('td:eq(9)', nRow).html('<button onclick="_offer.editOffer(' + aData.id + ')" class="btn btn-primary" data-id=' + aData.id + '>Редактировать</button>');
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.reloadTable = function () {
        this.setFilter();
        this.table.fnReloadAjax();
    };

    this.setFilter = function () {
        var self = this;

        self.date = {
            'from': $('#from').val(),
            'to': $('#to').val()
        };
        self.categories = $('#filterCategoryList').val();
        self.modStatuses = $('#filterModStatusList').val();
        self.partners = $('#filterPartnerList').val();
        self.goals = $('#filterGoalList').val();
        self.sources = $('#filterSourceList').val();

        console.log(this.partners);
        console.log(this.date);
    };

    //-----------Начало стандартизация в таблицах

    this.tableStd = [];
    this.stdPartners = [];
    this.stdGroups = [];
    this.stdModStatus = null;
    this.stdWrapper = null;
    this.stdAutoWrapper = null;

    this.showListStdTable = function (tab) {
        var self = this;
        this.tableStd[tab] = $('#std_table_' + tab).dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },

            "aoColumns": [
                {'mDataProp': 'id'},
                {'mDataProp': 'title'},
                {'mDataProp': 'partnerTitle'},
                {'mDataProp': 'groupTitle'},
                {'mDataProp': 'modStatus'},
                {'mDataProp': 'action', sDefaultContent: "N/A"}
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[0, "desc"]],
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": [0, 5]
                }
            ],
            "sAjaxSource": "/panel/offer/listDataStdTable",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name": "tab", "value": tab},
                    {"name": "partners", "value": self.stdPartners},
                    {"name": "groups", "value": self.stdGroups},
                    {"name": "modStatus", "value": self.stdModStatus},
                    {"name": "wrapper", "value": self.stdWrapper},
                    {"name": "autoWrapper", "value": self.stdAutoWrapper}
                );
            },

            "fnRowCallback": function (nRow, aData, status) {
                if (aData.modStatus == 0 && aData.wrapper == 0) {
                    $(nRow).addClass('status_require_moderation');
                } else if (aData.modStatus == 0 && aData.wrapper == 1) {
                    $(nRow).addClass('status_wrapper_and_moderation');
                } else if (aData.modStatus == 1 && aData.wrapper == 1) {
                    $(nRow).addClass('status_wrapper');
                }

                if (aData.modStatus == 0 && aData.hasWrapper == 0) {
                    $(nRow).addClass('status_require_moderation');
                } else if (aData.modStatus == 0 && aData.hasWrapper == 1) {
                    $(nRow).addClass('status_wrapper_and_moderation');
                } else if (aData.modStatus == 1 && aData.hasWrapper == 1) {
                    $(nRow).addClass('status_wrapper');
                }

                $('td:eq(0)', nRow).html('<input type="checkbox" class="stdSelector_' + tab + '" data-id=' + aData.id + ' id="std_item_' + tab + '_' + aData.id + '">').addClass('first_column');
                $('td:eq(4)', nRow).html(aData.modStatus == 1 ? 'Готово' : 'Требует модерации');
                $('td:eq(5)', nRow).html('<button onclick="_offer.openModalMoveItemToGroup(' + tab + ',' + aData.id + ',' + true + ')" class="btn btn-primary" data-id=' + aData.id + '>Редактировать</button>');
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.reloadTableStd = function (tab) {
        this.setFilterStd(tab);
        this.tableStd[tab].fnReloadAjax();
    };

    this.setFilterStd = function (tab) {
        var self = this;
        self.stdPartners = $('#filterPartnerList_' + tab).val();
        self.stdGroups = $('#filterGroupList_' + tab).val();
        self.stdModStatus = $('#filterModStatusList_' + tab).val();
        self.stdWrapper = $('#filterWrapperList_' + tab).val();
        self.stdAutoWrapper = $('#filterAutoWrapperList_' + tab).val();
    };

    this.clearFilterStd = function (tab) {
        var self = this;
        self.stdPartners = [];
        self.stdGroups = [];
        self.stdModStatus = null;
        self.stdWrapper = null;
        self.stdAutoWrapper = null;

        $('#filterPartnerList_' + tab).prop('selectedIndex', -1);
        $('#filterGroupList_' + tab).prop('selectedIndex', -1);
        $('#filterModStatusList_' + tab).prop('selectedIndex', false);
        $('#filterWrapperList_' + tab).prop('selectedIndex', false);
        $('#filterAutoWrapperList_' + tab).prop('selectedIndex', false);

        $('div#filterPartnerList_' + tab + '_chzn li.search-choice').remove();
        $('div#filterGroupList_' + tab + '_chzn li.search-choice').remove();

        this.tableStd[tab].fnReloadAjax();
    };

    this.openModalMoveItemToGroup = function (tab, id, loadOtherData) {
        var modalId = 'groupEditModalTab' + tab;
        $('.stdSelector_' + tab).each(function () {
            $(this).prop('checked', false);
        });
        $('#std_item_' + tab + '_' + id).prop('checked', true);
        $('#' + modalId).modal('toggle');

        if (loadOtherData) {
            $.post(
                '/panel/offer/partDataForModalStd',
                {id: id, tab: tab},
                function (data) {
                    $('#' + modalId + ' #partDataForModalStd').empty();
                    $('#' + modalId + ' #partDataForModalStd').append(data);
                }
            );
        }
    };

    this.applyMoveItemsToGroup = function (tab) {
        var self = this;
        var ids = [];
        var modalId = 'groupEditModalTab' + tab;

        $('.stdSelector_' + tab).each(function () {
            if ($(this).is(':checked')) {
                ids.push($(this).data('id'));
            }
        });

        if (ids.length === 0) {
            $('#' + modalId).modal('toggle');
            alert('Выберите хотя бы один елемент!');
        } else {
            var groupId = $('#stdSelectedGroupTab' + tab).val();
            $.post(
                '/panel/offer/moveItemsToGroup',
                {
                    ids: ids,
                    groupId: groupId,
                    tab: tab
                },

                function (data) {
                    var dataArr = JSON.parse(data);
                    if (dataArr.success && dataArr.message) {
                        $('#' + modalId + ' #labelGroupEditModalTab' + tab).append(' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.message + '</div>');
                    } else if (!dataArr.success && dataArr.message) {
                        $('#' + modalId + ' #labelGroupEditModalTab' + tab).append(' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                    }

                    $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");

                    if (dataArr.success) {
                        $('#' + modalId).modal('toggle');
                        self.reloadTableStd(tab);
                    }
                }
            );

            return false;
        }
    };
    //-----------Конец стандартизация в таблицах


    this.selectAll = function (checked, selector) {
        var chb = $(selector);
        chb.each(function () {
            $(this).prop('checked', checked);
        });
    };

    this.applyEditManyOffer = function () {
        var self = this;
        var ids = [];
        $('.offerSelector').each(function () {
            if ($(this).is(':checked')) {
                ids.push($(this).data('id'));
            }
        });

        if (ids.length === 0) {
            $('#MyModal').modal('toggle');
            alert('Выберите хотя бы один оффер!');
        } else {
            var gOfrId = $('#manyOfr_gOfrId').val();
            $.post(
                '/panel/offer/updateManyOffer',
                {
                    ids: ids,
                    groupOfferId: gOfrId
                },

                function (data) {
                    var dataArr = JSON.parse(data);
                    if (dataArr.success && dataArr.message) {
                        $('#MyModal #myModalLabelManyOffer').append(' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.message + '</div>');
                    } else if (!dataArr.success && dataArr.message) {
                        $('#MyModal #myModalLabelManyOffer').append(' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                    }

                    $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");

                    if (dataArr.success) {
                        $('#MyModal').modal('toggle');
                        self.reloadTable();
                    }
                }
            );

            return false;
        }
    };

    this.editOffer = function (id) {
        $.post(
            '/panel/offer/updateOffer',
            {id: id},
            function (data) {
                var dataArr = JSON.parse(data);
                $('#MyModal2 #contentOffer').html(dataArr.content);
                $('#MyModal2 #myModalLabelOffer').html(dataArr.title);
                $('#MyModal2').modal('toggle');
            }
        );
        return false;
    };

    this.applyEditOffer = function (closeModal) {

        var self = this;
        var idOffer = $('#editOfr_idOffer').val();
        var link = $('#editOfr_link').val();
        var partnerLink = $('#editOfr_partnerLink').val();
        var gOfrId = $('#editOfr_gOfrId').val();
        var status = $('#editOfr_status').val();
        var pageStd = window.location.href.indexOf('standardization') != -1 ? true : false;

        $.post(
            '/panel/offer/updateOffer',
            {
                id: idOffer,
                OfrOffer: {
                    link: link,
                    partner_offer_link: partnerLink,
                    group_offer_id: gOfrId,
                    status: status
                }
            },
            function (data) {
                var dataArr = JSON.parse(data);
                if (dataArr.successMessage) {
                    $('#MyModal2 #myModalLabelOffer').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.successMessage + '</div>');
                } else {
                    $('#MyModal2 #myModalLabelOffer').html(dataArr.title);
                }
                $('#MyModal2 #contentOffer').html(dataArr.content);
                $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");

                if (closeModal) {
                    $('#MyModal2').modal('toggle');
                }

                if (pageStd) {
                    self.loadNonStdOfferList();
                    self.loadStdOfferList();
                } else {
                    self.reloadTable();
                }
            }
        );

        return false;

    };

    this.editGroupOffer = function (id) {
        $.post(
            '/panel/offer/updateGroupOffer',
            {id: id},
            function (data) {
                var dataArr = JSON.parse(data);
                $('#MyModalGroupOffer #contentGroupOffer').html(dataArr.content);
                $('#MyModalGroupOffer #myModalLabelGroupOffer').html(dataArr.title);
                $('#MyModalGroupOffer').modal('toggle');
            }
        );
        return false;
    };

    this.applyEditGroupOffer = function (closeModal) {

        var self = this;
        var idGroupOffer = $('#MyModalGroupOffer #editGroupOfr_groupOfferId').val();
        var title = $('#MyModalGroupOffer #editGroupOfr_title').val();
        var groupCategoryId = $('#MyModalGroupOffer #editGroupOfr_category').val();
        var description = $('#MyModalGroupOffer #editGroupOfr_description').val();
        var imgLocal = $('#MyModalGroupOffer #insertImg').attr('src');

        $.post(
            '/panel/offer/updateGroupOffer',
            {
                id: idGroupOffer,
                OfrGroupOffer: {
                    title: title,
                    group_category_id: groupCategoryId,
                    description: description,
                    img_local: imgLocal,
                }
            },
            function (data) {
                var dataArr = JSON.parse(data);

                if (dataArr.success && dataArr.message) {
                    $('#MyModalGroupOffer #myModalLabelGroupOffer').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.message + '</div>');
                } else if (!dataArr.success && dataArr.message) {
                    $('#MyModalGroupOffer #myModalLabelGroupOffer').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                } else {
                    $('#MyModalGroupOffer #myModalLabelGroupOffer').html(dataArr.title);
                }
                $('#MyModalGroupOffer #contentGoal').html(dataArr.content);

                $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");

                if (closeModal && dataArr.success) {
                    $('#MyModalGroupOffer').modal('toggle');
                }
            }
        );

        return false;

    };

    this.deleteGroupOffer = function () {

        var self = this;
        var idGroupOffer = $('#MyModalGroupOffer #editGroupOfr_groupOfferId').val();

        if (confirm('Удалить групу?')) {
            $.post(
                '/panel/offer/deleteGroupOffer',
                {id: idGroupOffer},
                function (data) {
                    var dataArr = JSON.parse(data);

                    if (dataArr.success && dataArr.message) {
                        $('#MyModalGroupOffer #myModalLabelGroupOffer').append(' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.message + '</div>');
                    } else if (!dataArr.success && dataArr.message) {
                        $('#MyModalGroupOffer #myModalLabelGroupOffer').append(' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                    }

                    $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");

                    if (dataArr.success) {
                        self.loadNonStdOfferList();
                        self.loadStdOfferList();
                        $('#MyModalGroupOffer').modal('toggle');
                    }

                }
            );
        }

        return false;
    };


    this.showGoalsOfferTable = function (offerId) {
        var self = this;
        this.tableGoal = $('#goal_all').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },

            "aoColumns": [
                {'mDataProp': 'title'},
                {'mDataProp': 'geos'},
                {'mDataProp': 'cost'},
                {'mDataProp': 'profit'},
                {'mDataProp': 'action', sDefaultContent: "N/A"}
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[0, "asc"]],
            "aoColumnDefs": [
                {
                    "bSortable": false,
                    "aTargets": [1, 4]
                }
            ],
            "sAjaxSource": "/panel/offer/allGoals?offerId=" + offerId,

            "fnRowCallback": function (nRow, aData, status) {
                $('td:eq(0)', nRow).html('<div title="' + aData.title + '">' + aData.titleGroup + '</div>');
                $('td:eq(4)', nRow).html('<button onclick="_offer.editGoal(' + aData.id + ')" class="btn btn-primary" data-id=' + aData.id + '>Редактировать</button>');
            },
            "deferRender": false,
            "bDestroy": false
        });
    };

    this.reloadTableGoal = function () {
        this.tableGoal.fnReloadAjax();
    };

    this.editGoal = function (id) {
        $.post(
            '/panel/offer/updateGoal',
            {id: id},
            function (data) {
                var dataArr = JSON.parse(data);
                $('#MyModal3 #contentGoal').html(dataArr.content);
                $('#MyModal3 #myModalLabelGoal').html(dataArr.title);
                $('#MyModal3').modal('toggle');
            }
        );
        return false;
    };

    this.applyEditGoal = function (closeModal) {

        var self = this;
        var idGoal = $('#MyModal3 #editGoal_goalId').val();
        var gGoalId = $('#MyModal3 #editGoal_gGoalId').val();
        var geos = $('#MyModal3 #editGoal_geos').val();
        var cost = $('#MyModal3 #editGoal_cost').val();
        var currencyCost = $('#MyModal3 #editGoal_currencyCost').val();
        var profit = $('#MyModal3 #editGoal_profit').val();
        var currencyProfit = $('#MyModal3 #editGoal_currencyProfit').val();
        var isPercent = $('#MyModal3 #editGoal_isPercent').is(':checked') ? 1 : 0;
        var pageStd = window.location.href.indexOf('standardization') != -1 ? true : false;

        $.post(
            '/panel/offer/updateGoal',
            {
                id: idGoal,
                OfrGoal: {
                    group_goal_id: gGoalId,
                    geos: geos,
                    cost: cost,
                    currency_cost: currencyCost,
                    profit: profit,
                    currency_profit: currencyProfit,
                    is_percent: isPercent,
                }
            },
            function (data) {
                var dataArr = JSON.parse(data);

                if (dataArr.success && dataArr.message) {
                    $('#MyModal3 #myModalLabelGoal').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.message + '</div>');
                } else if (!dataArr.success && dataArr.message) {
                    $('#MyModal3 #myModalLabelGoal').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                } else {
                    $('#MyModal3 #myModalLabelGoal').html(dataArr.title);
                }
                $('#MyModal3 #contentGoal').html(dataArr.content);

                $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");


                if (dataArr.success && closeModal && !pageStd) {
                    $('#MyModal3').modal('toggle');
                    self.reloadTableGoal();
                } else if (!closeModal && !pageStd) {
                    self.reloadTableGoal();
                } else if (closeModal && pageStd) {
                    $('#MyModal3').modal('toggle');
                }

                if (pageStd) {
                    self.loadNonStdGoalList();
                    self.loadStdGoalList();
                }
            }
        );

        return false;

    };

    this.deleteGoal = function () {

        var self = this;
        var idGoal = $('#editGoal_goalId').val();
        var pageStd = window.location.href.indexOf('standardization') != -1 ? true : false;

        if (confirm('Удалить цель?')) {
            $.post(
                '/panel/offer/deleteGoal',
                {
                    id: idGoal,
                },
                function (data) {
                    var dataArr = JSON.parse(data);

                    if (dataArr.success && dataArr.message) {
                        $('#MyModal2 #myModalLabelOffer').append(' <div class="flash-success"><img src="/images/admin/ok.png" />' + dataArr.message + '</div>');
                    } else if (!dataArr.success && dataArr.message) {
                        $('#MyModal2 #myModalLabelOffer').append(' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                    }

                    $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");

                    $('#MyModal3').modal('toggle');

                    if (pageStd) {
                        self.loadNonStdGoalList();
                        self.loadStdGoalList();
                    } else {
                        self.reloadTableGoal();
                    }
                }
            );
        }

        return false;
    };

    this.createGoal = function () {
        $.post(
            '/panel/offer/createGoal',
            function (data) {
                var dataArr = JSON.parse(data);
                $('#MyModal3Create #contentCreateGoal').html(dataArr.content);
                $('#MyModal3Create #myModalLabelGoalCreate').html(dataArr.title);
                $('#MyModal3Create').modal('toggle');
            }
        );
        return false;
    };

    this.applyCreateGoal = function (closeModal) {

        var self = this;
        var idOffer = $('#editOfr_idOffer').val();
        var gGoalId = $('#MyModal3Create #editGoal_gGoalId').val();
        var geos = $('#MyModal3Create #editGoal_geos').val();
        var cost = $('#MyModal3Create #editGoal_cost').val();
        var currencyCost = $('#MyModal3Create #editGoal_currencyCost').val();
        var profit = $('#MyModal3Create #editGoal_profit').val();
        var currencyProfit = $('#MyModal3Create #editGoal_currencyProfit').val();
        var isPercent = $('#MyModal3Create #editGoal_isPercent').is(':checked') ? 1 : 0;

        $.post(
            '/panel/offer/createGoal',
            {
                idOffer: idOffer,
                OfrGoal: {
                    group_goal_id: gGoalId,
                    geos: geos,
                    cost: cost,
                    currency_cost: currencyCost,
                    profit: profit,
                    currency_profit: currencyProfit,
                    is_percent: isPercent,
                }
            },
            function (data) {
                var dataArr = JSON.parse(data);

                if (!dataArr.success && dataArr.message) {
                    $('#MyModal3Create #myModalLabelGoal').html(dataArr.title + ' <div class="flash-success"><img src="/images/admin/error.png" />' + dataArr.message + '</div>');
                } else {
                    $('#MyModal3Create #myModalLabelGoal').html(dataArr.title);
                }
                $('#MyModal3Create #contentCreateGoal').html(dataArr.content);

                $(".flash-success").animate({opacity: 1.0}, 1000).fadeOut("slow");

                if (dataArr.success) {
                    $('#MyModal3Create').modal('toggle');

                    if (!closeModal) {
                        self.editGoal(dataArr.goalId);
                    }

                    self.reloadTableGoal();
                } else {

                }
            }
        );

        return false;

    };


    /* початок. стандартизация */
    this.loadNonStdOfferList = function () {
        var id = $('#ofr_filterPartnerList').val();
        $.post(
            '/panel/offer/loadNonStdOfferList',
            {id: id},
            function (result) {
                $("#nonstandardOfferList").html(result);
            });
    };

    this.loadStdOfferList = function () {
        var search = $('#ofr_filterOfferGroupName').val();
        $.post(
            '/panel/offer/loadStdOfferList',
            {search: search},
            function (result) {
                $("#standardOfferList").html(result);
            });
    };

    this.loadNonStdCategoryList = function () {
        var id = $('#cat_filterPartnerList').val();
        $.post(
            '/panel/offer/loadNonStdCategoryList',
            {id: id},
            function (result) {
                $("#nonstandardCategoryList").html(result);
            });
    };

    this.loadStdCategoryList = function () {
        var search = $('#cat_filterCategoryGroupName').val();
        $.post(
            '/panel/offer/loadStdCategoryList',
            {search: search},
            function (result) {
                $("#standardCategoryList").html(result);
            });
    };

    this.loadNonStdSourceList = function () {
        var id = $('#source_filterPartnerList').val();
        $.post(
            '/panel/offer/loadNonStdSourceList',
            {id: id},
            function (result) {
                $("#nonstandardSourceList").html(result);
            });
    };

    this.loadStdSourceList = function () {
        var search = $('#source_filterSourceGroupName').val();
        $.post(
            '/panel/offer/loadStdSourceList',
            {search: search},
            function (result) {
                $("#standardSourceList").html(result);
            });
    };

    this.loadNonStdGoalList = function () {
        openPreloader();
        var id = $('#goal_filterPartnerList').val();
        $.post(
            '/panel/offer/loadNonStdGoalList',
            {id: id},
            function (result) {
                closePreloader();
                $("#nonstandardGoalList").html(result);
            });
    };

    this.loadStdGoalList = function () {
        openPreloader();
        var search = $('#goal_filterGoalGroupName').val();
        $.post(
            '/panel/offer/loadStdGoalList',
            {search: search},
            function (result) {
                closePreloader();
                $("#standardGoalList").html(result);
            });
    };

    /* конец. стандартизация */


    this.sendImage = function (classModel) {
        var form = new FormData();
        form.append('img', $('#imgFile')[0].files[0]);
        form.append('classModel', classModel);

        if ($('#imgFile')[0].files[0] != '') {
            $.ajax({
                cache: false,
                type: 'POST',
                url: '/panel/offer/upload',
                data: form,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (data) {
                    if (data.status == 'success') {
                        $("#res_msg").html('Файл загружен').css({"color": "green", 'display': 'block'});
                        $("#insertImg").attr("src", data.data).css({'display': 'block'});
                        $(".attach_image").text("Изменить картинку (.jpg .png .gif)");
                        $(".delete_img").css('display', 'block');
                        $("#img_name").val(data.data);
                    }
                    else if (data.status == 'fail')
                        $("#res_msg").html(data.err).css("color", "red");
                },
                error: function (data) {
                    if (typeof data.status !== "undefined" && data.status == 'fail')
                        $("#res_msg").html(data.err).css("color", "red");
                }
            });
        }
    };

    this.deleteImg = function (type) {

        var img = $("#insertImg").attr("src");
        $("#insertImg").attr("src", "").css({'display': 'none'});

        $.post(
            '/panel/offer/deleteImage',
            {img: img, type: type},
            function (result) {
                if (result == 'ok') {
                    $("#res_msg").css("display", "none");
                    $(".delete_img").css('display', 'none');
                    $("#img_name").val("");
                    $(".attach_image").text("Загрузить картинку (.jpg .png .gif)");
                } else {
                    alert(result);
                }
            });

    };
};

OfferStandart = function () {
    this.tabs = [];
    this.partners;
    this.subcats;
    this.goals;
    this.srcs;
    this.status;
    this.templates = [];
    this.ids = [];
    this.pager = [];
    this.quickSets;
    this.groupLive;

    this.initTabs = function () {
        var self = this;
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(){
            var action = $(this).data('action');
            var contentId = $(this).attr('href');
            $('.js-floatBtn').attr('onclick', "ofr.openSetts(false, '"+action+"');");
            self.loadTabContent(action, contentId);
        });
    };

    this.loadTabContent = function(action, contentId) {
        if (action == 'group') {
            $('.js-floatBtn').hide();
        } else {
            $('.js-floatBtn').show();
        }
        var self = this;
        if ($(contentId).html() == '') {
            $.post('/panel/offers/'+action, {}, function (result) {
                $(contentId).html(result);
                $(contentId).find('select').chosen();
                self.setFilters(action, true);
                self[action+'Init']();
            });
        } else if (typeof this.tabs[action] != 'undefined') {
            this.tabs[action].fnReloadAjax();
        }
    };

    this.setFilters = function (tab, noreload) {
        var self = this;
        this.partners = [];
        $('.js-mainBlock .tab-pane.active .js-partnerList option:selected').each(function(){
            self.partners.push($(this).val());
        });
        this.subcats = [];
        $('.js-mainBlock  .tab-pane.active .js-subcatList option:selected').each(function(){
            self.subcats.push($(this).val());
        });
        this.goals = [];
        $('.js-mainBlock  .tab-pane.active .js-goalList option:selected').each(function(){
            self.goals.push($(this).val());
        });
        this.srcs = [];
        $('.js-mainBlock  .tab-pane.active .js-srcList option:selected').each(function(){
            self.srcs.push($(this).val());
        });
        this.status = $('.js-mainBlock  .tab-pane.active .js-status option:selected').val();
        this.quickSets = $('.js-mainBlock  .tab-pane.active .js-quickSetts option:selected').val();
        this.groupLive = $('.js-mainBlock  .tab-pane.active .js-groupLive option:selected').val();
        if (typeof noreload == 'undefined' || !noreload) {
            this.tabs[tab].fnReloadAjax();
        }
        //this.pager
        //this.tabs[tab].fnDisplayStart();
    };

    this.categoryInit = function () {
        var self = this;
        this.tabs.category = $('#js-catList').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },
            "aoColumns": [
                {'mDataProp': 'check', 'bSortable':false},
                {'mDataProp': 'partner'},
                {'mDataProp': 'cat_partner'},
                {'mDataProp': 'status'},
                {'mDataProp': 'change', 'bSortable':false},
                {'mDataProp': 'cat_our'},
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[2, "asc"]],
            "sAjaxSource": "/panel/offers/catshow",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"partners","value":self.partners},
                    {"name":"subcats","value":self.subcats},
                    {"name":"status","value":self.status}
                );
            },
            "deferRender": false,
            "bDestroy": false
        });
    };

    this.goalInit = function () {
        var self = this;
        this.tabs.goal = $('#js-goalTab').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },
            "aoColumns": [
                {'mDataProp': 'check', 'bSortable':false},
                {'mDataProp': 'partner'},
                {'mDataProp': 'goal_partner'},
                {'mDataProp': 'status'},
                {'mDataProp': 'change', 'bSortable':false},
                {'mDataProp': 'goal_our'},
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[2, "asc"]],
            "sAjaxSource": "/panel/offers/goalshow",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"partners","value":self.partners},
                    {"name":"goals","value":self.goals},
                    {"name":"status","value":self.status}
                );
            },
            "deferRender": false,
            "bDestroy": false
        });
    };

    this.sourceInit = function () {
        var self = this;
        this.tabs.source = $('#js-sourceTab').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },
            "aoColumns": [
                {'mDataProp': 'check', 'bSortable':false},
                {'mDataProp': 'partner'},
                {'mDataProp': 'src_partner'},
                {'mDataProp': 'status'},
                {'mDataProp': 'change', 'bSortable':false},
                {'mDataProp': 'src_our'},
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[2, "asc"]],
            "sAjaxSource": "/panel/offers/srcshow",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"partners","value":self.partners},
                    {"name":"srcs","value":self.srcs},
                    {"name":"status","value":self.status}
                );
            },
            "deferRender": false,
            "bDestroy": false
        });
    };

    this.openSetts = function (id, type, copy) {
        var self = this;
        this.ids = [];
        if (false !== id) {
            this.ids.push(id);
        } else {
            $('.tab-pane.active .js-checkItem:checked').each(function(){
                self.ids.push($(this).data('id'));
            });
        }
        if (this.ids.length == 0) {
            alert('Выберите Элементы');
            return false;
        }
        $.post('/panel/offers/standardizer', {'id':id, type:type, 'ids':this.ids}, function (data) {
            var result = JSON.parse(data);
            var $mb = $('#myModal');
            if (copy) {
                var $nmb = $mb.clone();
                $nmb.attr('id', 'myModalSecond');
                $('#myModalSecond').html($nmb.html());
                $mb = $('#myModalSecond');
            }
            if (typeof result.success != 'undefined') {
                if (typeof result.template != 'undefined') {
                    self.templates[type] = result.template;
                    /*console.log(result.template);
                    console.log(self.templates);*/
                }
                //console.log(type);
                if (result.success) {
                    if (typeof result.class != 'undefined') {
                        $mb.addClass(result.class);
                    } else {
                        $mb.removeClass('modal-lg');
                    }
                    if (typeof result.testBtn != 'undefined' && result.testBtn) {
                        $mb.find('.js-modalTest').show();
                        $mb.find('.js-modalSave').attr('disabled', 'disabled');
                    } else {
                        $mb.find('.js-modalTest').hide();
                        $mb.find('.js-modalSave').removeAttr('disabled');
                    }
                    $mb.find('.modal-body').html(result.block);
                    $mb.find('#myModalLabel').html(result.title);
                    $mb.find('.js-modalSave').attr('onclick', result.jsfunc);
                    $mb.modal('show');
                } else {
                    alert(result.msg);
                }
            }
        });
    };

    this.changeStdTpl = function (e, type) {
        if (typeof this.templates[type] != 'undefined') {
            if (typeof this.templates[type][$(e).val()] != 'undefined') {
                $('.js-templateModal').html(this.templates[type][$(e).val()]);
            } else {
                $('.js-templateModal').html('');
            }
        } else {
            $('.js-templateModal').html('');
        }
        //var tpl = $(e).find('option:selected').data('template');
    };

    this.saveStdTpl = function (type) {
        var self = this;
        var selId = $('.js-stdSelected').val();
        var tpl = $('.js-templateModal').val();
        $.post('/panel/offers/savetpl', {'id':selId, 'type':type, 'tpl':tpl, 'ids':this.ids}, function (data) {
            $('#myModal').modal('hide');
            //self.tabs[type].fnReloadAjax();
            self.tabs[type].fnStandingRedraw();
        });
    };

    this.sandboxInit = function () {
        var self = this;
        this.tabs.sandbox = $('#js-sandboxTab').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },
            "aoColumns": [
                {'mDataProp': 'check', 'bSortable':false},
                {'mDataProp': 'partner'},
                {'mDataProp': 'ofr_partner'},
                {'mDataProp': 'change', 'bSortable':false},
                {'mDataProp': 'ofr_group'},
                {'mDataProp': 'type', 'bSortable':false},
                {'mDataProp': 'subcat', 'bSortable':false},
                {'mDataProp': 'status'},
            ],
            "aaSorting": [[2, "asc"]],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "bServerSide": true,
            "bProcessing": true,
            "sAjaxSource": "/panel/offers/sandboxshow",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"partners","value":self.partners},
                    {"name":"subcats","value":self.subcats},
                    {"name":"status","value":self.status},
                    {"name":"quickSets","value":self.quickSets}
                );
            },
            "fnRowCallback": function (nRow, aData, status) {
                $('td:eq(3)', nRow).html('<span class="dropdown">'+
                                        '<button class="btn btn-success btn-circle-mini js-toggle-dropdown" type="button" onclick="'+
                                        "ofr.loadOfferInfo("+aData.change+", this);"+
                                        '">!</button><div class="info-ddown_cnt"></div></span> '+
                                        '<button type="button" class="btn btn-primary btn-mini" onclick="'+
                                        "ofr.openSetts("+aData.change+", 'sandbox');"+
                                        '"><i class="icon-pencil icon-white"></i></button>').addClass('irow_'+aData.change);
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.loadOfferInfo = function (id, e) {
        var block = $(e).closest('td').find('.info-ddown_cnt');
        // block.toggle();
        if (block.html() == '') {
            $.post('/panel/offers/ofrinfo', {'id':id}, function (data) {
                block.html(data);
            });
        }
    };

    this.trim = function (str) {
        return str.replace(/^\s*/,'').replace(/\s*$/,'');
    };

    this.testStdOffer = function (e) {
        var tpl = $(e).closest('.modal').find('.js-templateModal').val();
        //console.log (tpl);
        if (this.trim(tpl) == '') {
            alert('Введите ключевые слова');
            return false;
        }
        var subcat = [];
        $(e).closest('.modal').find('.js-stdSelected option:selected').each(function(){
            subcat.push($(this).val());
        });
        var params = {
            'ids': this.ids,
            'tpl': tpl,
            'subcat': subcat,
        };
        $.post('/panel/offers/ofrtest', params, function (data) {
            var result = JSON.parse(data);
            if (typeof result.success != 'undefined') {
                $(e).closest('.modal').find('table.js-modalTab tbody').html(result.block);
                $(e).closest('.modal-footer').find('.js-modalSave').removeAttr('disabled');
            } else {
                alert('Ничего не найдено');
            }
        });
    };

    this.saveStdOffer = function (e, type) {
        var self = this;
        var activeTab = $('#myTab > li.active a').data('action');
        if ($(e).closest('.modal').find('.nav-tabs li.active').data('action') == 'new') {
            var subcat = [];
            $(e).closest('.modal').find('.js-stdSelected option:selected').each(function(){
                subcat.push($(this).val());
            });
            var ids = [];
            $(e).closest('.modal').find('table.js-modalTab tbody tr').each(function(){
                ids.push($(this).data('id'));
            });
            var params = {
                'title': $(e).closest('.modal').find('.js-modalTitle').val(),
                'description': $(e).closest('.modal').find('.js-modalDesc').val(),
                'subcat': subcat,
                'template': $(e).closest('.modal').find('.js-templateModal').val(),
                'ids': ids,
                'type': type
            };
            $.post('/panel/offers/saveofrstd', params, function (data) {
                var result = JSON.parse(data);
                if (typeof result.success != 'undefined' && result.success) {
                    $(e).closest('.modal').modal('hide');
                    //$('#myModal').modal('hide');
                    //self.tabs[type].fnReloadAjax();
                    if (type == activeTab) {
                        self.tabs[type].fnStandingRedraw();
                    }
                } else {
                    alert(result.msg);
                }
            });
        } else {
            var gid = $('.js-grpAttach').val();
            if (parseFloat(gid) == 0) {
                alert('Выберите группу');
                return false;
            }
            $.post('/panel/offers/saveofrex', {'gid':gid, 'ids':this.ids}, function (data) {
                var result = JSON.parse(data);
                if (typeof result.success != 'undefined' && result.success) {
                    $(e).closest('.modal').modal('hide');
                    //$('#myModal').modal('hide');
                    //self.tabs['sandbox'].fnReloadAjax();
                    if (type == activeTab) {
                        self.tabs.sandbox.fnStandingRedraw();
                    }
                } else {
                    alert(result.msg);
                }
            });
        }
    };

    this.saveGrpOffer = function (e, grpId) {
        var subcat = [];
        $(e).closest('.modal').find('.js-stdSelected option:selected').each(function(){
            subcat.push($(this).val());
        });
        var quickSetts = [];
        $(e).closest('.modal').find('input.js-group-type:checked').each(function(){
            quickSetts.push($(this).val());
        });

        var params = {
            'id': grpId,
            'title': $(e).closest('.modal').find('.js-modalTitle').val(),
            'description': $(e).closest('.modal').find('.js-modalDesc').val(),
            'subcat': subcat,
            'template': $(e).closest('.modal').find('.js-templateModal').val(),
            'quickSetts': quickSetts,
        };
        var self = this;
        $.post('/panel/offers/grpsave', params, function (data) {
            var result = JSON.parse(data);
            if (typeof result.success != 'undefined' && result.success) {
                $('#myModal').modal('hide');
                //self.tabs['group'].fnReloadAjax();
                self.tabs.group.fnStandingRedraw();
            } else {
                alert(result.msg);
            }
        });
    };

    this.groupInit = function () {
        var self = this;
        this.tabs.group = $('#js-groupTab').dataTable({
            "oLanguage": {
                "sLengthMenu": "_MENU_ записей на странице",
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch": "Поиск: "
            },
            "aoColumns": [
                {'mDataProp': 'id'},
                {'mDataProp': 'group'},
                {'mDataProp': 'change', 'bSortable':false},
                {'mDataProp': 'words', 'bSortable':false},
                {'mDataProp': 'type', 'bSortable':false},
                {'mDataProp': 'subcat', 'bSortable':false},
                {'mDataProp': 'status'},
            ],
            "aLengthMenu": [[15, 25, 50, 100, 200, 500, -1], [15, 25, 50, 100, 200, 500, "All"]],
            "aaSorting": [[0, "desc"]],
            "bServerSide": true,
            "bProcessing": true,
            "sAjaxSource": "/panel/offers/groupshow",
            "fnServerParams": function (aoData) {
                aoData.push(
                    {"name":"partners","value":self.partners},
                    {"name":"subcats","value":self.subcats},
                    {"name":"status","value":self.status},
                    {"name":"quickSets","value":self.quickSets},
                    {"name":"groupLive","value":self.groupLive}
                );
            },
            "fnRowCallback": function (nRow, aData, status) {
                $('td:eq(2)', nRow)
                    .html(
                    '<button type="button" class="btn btn-primary btn-mini" onclick="'+
                    "ofr.openSetts("+aData.change+", 'group');"+
                    '"><i class="icon-pencil icon-white"></i></button>'+
                    ' <button type="button" class="btn btn-danger btn-mini" onclick="'+
                    "ofr.grpDel("+aData.change+");"+
                    '"><i class="icon-trash icon-white"></i></button>'
                    )
                    .addClass('irow_'+aData.change);
            },
            "deferRender": true,
            "bDestroy": true
        });
    };

    this.grpDel = function (id) {
        if (confirm('Вы действительно хотите удалить группу?')) {
            $.post('/panel/offers/grpdel', {'id':id}, function (result) {
                if (typeof result.success != 'undefined') {
                    if (result.success) {
                        this.tabs.group.fnStandingRedraw();
                    } else {
                        alert(result.msg);
                    }
                }
            }.bind(this), 'json');
        }
    };

    this.startStandardizer = function () {
        if (confirm('Запустить стандартизацию?')) {
            $.post('/panel/offers/startstd', {}, function (data) {
                //alert();
            });
        }
    };

    this.checkBox = function (e) {
        $(e).closest('table').find('input[type=checkbox]').prop('checked', $(e).prop('checked'));
    };
};