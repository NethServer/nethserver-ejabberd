((function($){

    function applyTranslations() {
        $('#app-views [i18n]').each(function () {
            $(this).text(_($(this).attr('i18n')))
        });
    }

    function getDashboard() {
        applyTranslations();

        $('#loader').show();
        $('#empty').hide();
        $('#content').hide();
        
        // get stats
        nethserver.exec(
            ["nethserver-ejabberd/read"],
            {sections:["status", "configuration"]},
            null,
            function (success) {
                try {
                    success = JSON.parse(success);
                    $('#loader').hide();
                    if(success.configuration.props.status == 'enabled') {
                        $('#stats-uptime').text(success.status['uptime']);
                        $('#stats-registered').text(success.status['registered']);
                        $('#stats-online').text(success.status['online']);
                        $('#stats-s2sin').text(success.status['s2sin']);
                        $('#stats-s2sout').text(success.status['s2sout']);
                        $('#content').show();
                    } else {
                        $('#empty').show();
                    }
                } catch (e) {
                    console.error(e);
                    $('#loader').hide();
                    $('#content').show();
                }
            },
            function (error) {
                console.error(error);
                $('#loader').hide();
                $('#content').show();
            }
        );

        $('#btn_configure').click(function(){
            window.location = '#/configuration';
        });

    } // end getDashboard

    function getConfiguration() {
        
        function doRead() {
            $('#config-loader').hide();
            nethserver.exec(
                ["nethserver-ejabberd/read"],
                {sections:["configuration"]},
                null,
                function (success) {
                    $('#loader').hide();
                    try {
                        var data = JSON.parse(success);

                        var serviceStatus = data['configuration']['props']['status'] == 'enabled';
                        var webAdminStatus = data['configuration']['props']['WebAdmin'] == 'enabled';
                        var s2sStatus = data['configuration']['props']['S2S'] == 'enabled';
                        var modMamStatus = data['configuration']['props']['ModMamStatus'] == 'enabled';
                        var retentionStatus = data['configuration']['props']['ModMamPurgeDBStatus'] == 'enabled';

                        $('#config-service-switch').attr('checked', serviceStatus).trigger('change');
                        $('#config-webadmin-switch').attr('checked', webAdminStatus).trigger('change');
                        $('#config-federation-switch').attr('checked', s2sStatus).trigger('change');
                        $('#config-archive-switch').attr('checked', modMamStatus).trigger('change');
                        $('#config-retention-switch').attr('checked', retentionStatus).trigger('change');

                        $('#config-shaperfast-text').val(data['configuration']['props']['ShaperFast']);
                        $('#config-shapernormal-text').val(data['configuration']['props']['ShaperNormal']);
                        $('#config-retention-value').val(data['configuration']['props']['ModMamPurgeDBInterval']);

                    } catch (e) {
                        console.error(e);
                    }
                    $('#content').show();
                },
                function (error) {
                    console.error(error);
                    $('#loader').hide();
                    $('#content').show();
                }
            );
        }
        
        function doUpdate() {
            $('#config-loader').show();
            $('.form-group .help-block').hide();
            $('.form-group').removeClass('has-error');
            $('#validation-error-notification').hide();
            
            var data = {"configuration":{"props":{
                "status": $("#config-service-switch").is(':checked') ? 'enabled' : 'disabled',
                "WebAdmin": $("#config-webadmin-switch").is(':checked') ? 'enabled' : 'disabled',
                "S2S": $("#config-federation-switch").is(':checked') ? 'enabled' : 'disabled',
                "ModMamStatus": $("#config-archive-switch").is(':checked') ? 'enabled' : 'disabled',
                "ModMamPurgeDBStatus": $("#config-retention-switch").is(':checked') ? 'enabled' : 'disabled',
                "ModMamPurgeDBInterval": $("#config-retention-value").val(),
                "ShaperFast": $("#config-shaperfast-text").val(),
                "ShaperNormal": $("#config-shapernormal-text").val(),
            }}};

            nethserver.exec(
                ["nethserver-ejabberd/validate"],
                data,
                null,
                function (success) {
                    // define notifications
                    nethserver.notifications.success = _("configuration_submit_success");
                    nethserver.notifications.error = _("configuration_submit_error");

                    // update values
                    nethserver.exec(
                        ["nethserver-ejabberd/update"],
                        data,
                        function (stream) {
                            console.info("nethserver-ejabberd", stream);
                        },
                        function (success) {
                            doRead();
                        },
                        function (error) {
                            $('#config-loader').hide()
                            console.error(error);
                        }
                    );
                },
                function (error, data) {
                    $('#config-loader').hide();
                    $('#validation-error-notification').show();
                    var errorData = {};
                    try {
                        errorData = JSON.parse(data);
                        for (var i in errorData.attributes) {
                            var attr = errorData.attributes[i];
                            var id = '';
                            if(attr.parameter == 'ShaperFast') {
                                id = 'config-shaperfast-text';
                            } else if (attr.parameter == 'ShaperNormal') {
                                id = 'config-shapernormal-text';
                            } else if (attr.parameter == 'ModMamPurgeDBInterval') {
                                id = 'config-retention-value';
                            }
                            $('#' + id).closest('.form-group').addClass('has-error');
                            $('#' + id + '-error').text(_(attr.error)).show();
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            );
        }

        $('#loader').show();
        $('#content').hide();
        $('#validation-error-notification').hide();
        applyTranslations();

        $(".bootstrap-switch").bootstrapSwitch({
            "onText": _('switch_label_on'),
            "offText": _('switch_label_off')
        });
        
        $(".bootstrap-touchspin").TouchSpin({
            min: 0,
            max: 9999,
            postfix: _('configuration_retention_days'),
            forcestepdivisibility: 'none'
        });

        // set default state to collapsed for expandable field section
        $('.fields-section-header-pf, .pdc-switch-observer').attr('aria-expanded', 'false');
        $('.fields-section-pf .form-group, .pdc-switch-observer').addClass('hidden');
        $('.fa.field-section-toggle-pf').removeClass('fa-angle-down');

        // click the field section heading to expand the section
        $("#config-advanced-options .field-section-toggle-pf").click(function(event){
          event.preventDefault();
          $(this).parents(".fields-section-pf").find(".fa").toggleClass("fa-angle-down");
          $(this).parents(".fields-section-pf").find(".form-group").toggleClass("hidden");
          if ($(this).parent().attr('aria-expanded') == 'false') {
            $(this).parent().attr('aria-expanded', 'true');
          } else {
            $(this).parent().attr('aria-expanded', 'false');
          }
        });

        $('.pdc-switch-observer[data-pdc-switch]').each(function(){
            var observer = this;
            var id = $(this).attr('data-pdc-switch');
            $('#' + id).change(function() {
                if(this.checked) {
                    $(observer).removeClass('hidden').attr('aria-expanded', 'true');
                } else {
                    $(observer).addClass('hidden').attr('aria-expanded', 'false');
                }
            });
        });

        $('#config-service-switch').on('switchChange.bootstrapSwitch', function(event, state){
            if(state) {
                $('#app-views input[id!=config-service-switch]').attr("disabled", false);
            } else {
                $('#app-views input[id!=config-service-switch]').attr("disabled", true);
            }
        });

        var webadminUrl = 'https://' + window.location.hostname + ':5280/admin/';
        $('#configuration-webadmin-url').text(webadminUrl).attr('href', webadminUrl);

        $('#config-form').submit(function(event){
            event.preventDefault();
            event.stopPropagation();
            doUpdate();
        });

        doRead();
    } // end getConfiguration function

    function getLogs() {
        var logsAction = 'dump'
        var process = null
        applyTranslations();

        // function to handle logs
        function handleLogs(action) {
            $('#loader').show();
            $('#logs-output').hide();

            process = nethserver.readLogs({
                    "action": action,
                    "lines": action == 'dump' ? 30 : null,
                    "mode": "systemd",
                    "paths": ["ejabberd"]
                },
                action == 'follow' ? function (stream) {
                    $('#loader').hide();
                    $('#logs-output').show();

                    $('#logs-output').append(stream)

                    document.getElementById(
                        "logs-output"
                    ).scrollTop = document.getElementById(
                        "logs-output"
                    ).scrollHeight;
                } : null,
                function (success) {
                    $('#loader').hide();
                    $('#logs-output').show();

                    if (success.length == 0) {
                        $('#logs-output').text(_("process_terminated"))
                    } else {
                        $('#logs-output').text(success)
                    }

                    document.getElementById(
                        "logs-output"
                    ).scrollTop = document.getElementById(
                        "logs-output"
                    ).scrollHeight;
                },
                function (error) {
                    $('#loader').hide();
                    $('#logs-output').show();
                    $('#logs-output').text(error)
                },
                false
            );
        }

        // handle click on button
        $('#follow-btn').click(function () {
            if (logsAction == "dump") { // follow mode
                logsAction = 'follow'

                $('#follow-btn').text(_("logs_action_stop"))
                $('#logs-output').text("")
                $('#log-file').text("journalctl -u ejabberd -f")
            } else if (logsAction == "follow") { // dump mode
                logsAction = 'dump'

                $('#follow-btn').text(_("logs_action_follow"))
                $('#logs-output').text("")
                $('#log-file').text("journalctl -u ejabberd")
            }
            handleLogs(logsAction)
        })

        // call method first time
        handleLogs(logsAction)
    } // end getLogs function

    function getAbout() {
        applyTranslations();

        $('#loader').show()
        $('#content').hide()

        // get app info
        nethserver.exec(
            ["system-apps/read"], {
                action: "info",
                name: 'nethserver-ejabberd'
            },
            null,
            function (success) {
                try {
                    success = JSON.parse(success);

                    $('#app-name').text(success.name)
                    $('#app-summary').text(success.summary)
                    $('#app-version').text(success.release.version)
                    $('#app-web').attr("href", success.homepage)
                    $('#app-bug').attr("href", success.bugs.url)
                    $('#app-author').text(success.author.name + ' | ' + success.author.email)

                    $('#loader').hide()
                    $('#content').show()
                } catch (e) {
                    console.error(e)
                    $('#loader').hide()
                    $('#content').show()
                }
            },
            function (error) {
                console.error(error)
            }
        );
    } // end getAbout function

    // define app routing
    var app = $.sammy('#app-views', function () {
        this.use('Template');

        this.get('#/', function (context) {
            this.partial('views/dashboard.html', {}, getDashboard);
        });

        this.get('#/configuration', function (context) {
            this.partial('views/configuration.html', {}, getConfiguration);
        });

        this.get('#/logs', function (context) {
            this.partial('views/logs.html', {}, getLogs);
        });

        this.get('#/about', function (context) {
            this.partial('views/about.html', {}, getAbout);
        });

        this.before('.*', function () {

            var hash = document.location.hash.replace("/", "");
            hash = hash == '#' ? '#dashboard' : hash
            $("nav>ul>li").removeClass("active");
            $("nav>ul>li" + hash + "-item").addClass("active");
        });

    });

    $(document).on("nethserver-loaded", function () {
        app.run('#/');
    });

})(jQuery));